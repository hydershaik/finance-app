import * as pdfjsLib from 'pdfjs-dist';
import { categorize, isUnnecessary } from './parser';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

let pdfIdCounter = 1;

// ── Constants ─────────────────────────────────────────────────────────────────

// Items whose Y coords are within this many points are on the same visual line
const Y_TOLERANCE = 3;

// Lines that are page headers/footers/column-headers — skip them
const SKIP_LINE_RE = /^(date|description|amount|balance|debit|credit|transaction|posting|reference|activity|page \d|account number|statement period|opening|closing|beginning|ending|total|subtotal|minimum payment due|new balance|previous balance|credit limit|available credit|payment due|apr |annual percentage|interest charge|fees charged|rewards|summary of account)/i;

// ── US Date Parsing (MM/DD/YYYY) ──────────────────────────────────────────────
//
// ALL major US banks (Chase, Discover, Citi, BofA, Wells Fargo) use MM/DD or
// MM/DD/YYYY format — month comes FIRST.

const MONTH_MAP = {jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',
                   jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};

// Ordered from most-specific to least-specific to avoid partial matches
const DATE_PATTERNS = [
  // MM/DD/YYYY  e.g. 03/15/2024
  {
    re: /\b(1[0-2]|0[1-9]|[1-9])\/(3[01]|[12]\d|0[1-9]|[1-9])\/(20\d{2})\b/,
    fn: m => `${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`,
  },
  // MM/DD/YY  e.g. 03/15/24
  {
    re: /\b(1[0-2]|0[1-9]|[1-9])\/(3[01]|[12]\d|0[1-9]|[1-9])\/(\d{2})\b/,
    fn: m => `20${m[3]}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`,
  },
  // YYYY-MM-DD  (ISO, rare in US bank PDFs)
  {
    re: /\b(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\b/,
    fn: m => `${m[1]}-${m[2]}-${m[3]}`,
  },
  // MMM DD, YYYY  e.g. Mar 15, 2024  or  Mar 15 2024
  {
    re: /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(20\d{2})\b/i,
    fn: m => `${m[3]}-${MONTH_MAP[m[1].toLowerCase()]}-${m[2].padStart(2,'0')}`,
  },
  // MM/DD  e.g. 03/15  — Chase/Discover often omit year in transaction lists
  // We'll assign the current year; a later pass can correct if needed
  {
    re: /\b(1[0-2]|0[1-9])\/(3[01]|[12]\d|0[1-9])\b/,
    fn: m => `2024-${m[1]}-${m[2]}`,
  },
];

function extractDate(text) {
  for (const { re, fn } of DATE_PATTERNS) {
    const m = text.match(re);
    if (m) {
      try {
        const iso = fn(m);
        if (!isNaN(new Date(iso).getTime())) return iso;
      } catch { /* skip invalid */ }
    }
  }
  return null;
}

// Strip date patterns from a string (for cleaning description)
function stripDates(text) {
  let s = text;
  for (const { re } of DATE_PATTERNS) {
    s = s.replace(new RegExp(re.source, 'g'), ' ');
  }
  return s;
}

// ── Amount Parsing ────────────────────────────────────────────────────────────
//
// Chase bank statements: withdrawals are NEGATIVE  e.g.  -18.50
// Chase credit cards:    all charges are POSITIVE  e.g.   15.49
// Discover:              charges are positive, payments are negative
// Citi:                  separate Debit / Credit columns → two amounts on same line

// Match signed/unsigned dollar amounts — must have decimals (avoids matching years)
const SIGNED_AMOUNT_RE = /-?\$?[\d,]+\.\d{2}/g;

function parseRawAmount(s) {
  // e.g. "-$1,234.56" → -1234.56
  return parseFloat(s.replace(/[$,]/g, '')) || 0;
}

function extractSignedAmounts(text) {
  // Strip dates first so "03/15" isn't treated as part of an amount
  const cleaned = stripDates(text);
  const matches = cleaned.match(SIGNED_AMOUNT_RE) || [];
  return matches.map(parseRawAmount).filter(v => v !== 0);
}

// ── Line grouping with Y tolerance ───────────────────────────────────────────

async function extractPageLines(page) {
  const content = await page.getTextContent();
  const buckets = []; // [{y, items:[{x,text}]}]

  for (const item of content.items) {
    const str = item.str;
    if (!str?.trim()) continue;
    const y = item.transform[5];
    const x = item.transform[4];

    // Find an existing bucket within Y_TOLERANCE
    const bucket = buckets.find(b => Math.abs(b.y - y) <= Y_TOLERANCE);
    if (bucket) {
      bucket.items.push({ x, text: str });
      // Update bucket y to average (keeps things stable)
      bucket.y = (bucket.y + y) / 2;
    } else {
      buckets.push({ y, items: [{ x, text: str }] });
    }
  }

  // Sort top→bottom (highest PDF y = top of page)
  buckets.sort((a, b) => b.y - a.y);

  return buckets.map(b => {
    // Sort items left→right, then join
    const line = b.items
      .sort((a, b) => a.x - b.x)
      .map(i => i.text)
      .join(' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return line;
  }).filter(Boolean);
}

// ── Transaction type resolution ───────────────────────────────────────────────

function resolveType(line, amounts, source) {
  const t = line.toLowerCase();

  // 1. Keyword overrides (very reliable)
  if (/payment\s+thank\s+you|payment\s+received|direct\s+dep|direct\s+deposit|payroll|ach\s+credit|zelle\s+from|venmo\s+cashout|interest\s+paid|cashback|refund|return\s+credit|credit\s+adjustment/.test(t)) {
    return 'credit';
  }
  if (/payment\s+to|ach\s+debit|atm\s+withdrawal|online\s+transfer\s+to/.test(t)) {
    return 'debit';
  }

  // 2. Signed amounts: negative → debit (withdrawal), positive → deposit/charge
  const signedAmt = amounts.find(a => a < 0);
  const positiveAmt = amounts.find(a => a > 0);
  if (signedAmt !== undefined) return 'debit';

  // 3. For credit cards, most positive charges are debits; credits are refunds/payments
  if (source === 'credit_card') return 'debit';

  // 4. For bank accounts, positive = deposit (credit)
  if (source === 'bank' && positiveAmt !== undefined) return 'credit';

  return 'debit'; // safe default
}

// ── Pick the transaction amount from a list of amounts on the line ────────────
//
// Common US bank layouts (left→right):
//   Chase bank:   [txn_amount, running_balance]   — txn can be negative
//   Chase CC:     [charge_amount]                 — always positive
//   Citi bank:    [debit_amount, credit_amount, balance]  — one of first two is 0
//   Discover CC:  [charge_amount]
//
// Strategy: the FIRST absolute amount that is not a suspiciously large "balance"
// compared to the others is the transaction amount.

function pickTransactionAmount(amounts, type) {
  if (!amounts.length) return 0;

  const abs = amounts.map(Math.abs);

  if (abs.length === 1) return abs[0];

  if (abs.length === 2) {
    // Assume first is txn, second is running balance.
    // If first is 0, use second (Citi debit/credit column layout)
    return abs[0] !== 0 ? abs[0] : abs[1];
  }

  // 3+ amounts: for Citi-style [debit, credit, balance]
  // One of the first two will be 0; pick the non-zero one
  if (abs[0] === 0 && abs[1] !== 0) return abs[1];
  if (abs[1] === 0 && abs[0] !== 0) return abs[0];

  // Fallback: smallest of first two (least likely to be running balance)
  return Math.min(abs[0], abs[1]);
}

// ── Skip line heuristics ──────────────────────────────────────────────────────

function shouldSkip(line) {
  if (SKIP_LINE_RE.test(line.trim())) return true;
  // Lines with no letters (purely numeric lines like page numbers, totals row)
  if (!/[a-zA-Z]/.test(line)) return true;
  // Very short lines
  if (line.trim().length < 5) return true;
  return false;
}

// ── Clean description ─────────────────────────────────────────────────────────

function cleanDescription(line) {
  let s = stripDates(line);
  // Remove amounts (signed)
  s = s.replace(SIGNED_AMOUNT_RE, ' ');
  // Remove any remaining isolated digit clusters (e.g. check numbers, ref numbers)
  s = s.replace(/\b\d{5,}\b/g, ' ');
  // Remove leading/trailing noise chars
  s = s.replace(/^[\s\-\|\/,*#]+|[\s\-\|\/,*#]+$/g, '');
  // Collapse whitespace
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s || 'Bank Transaction';
}

// ── Multi-line merge ──────────────────────────────────────────────────────────
// Chase sometimes puts a long merchant name on a second line below the date+amount

function mergeMultiLines(lines) {
  const merged = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const hasDate = extractDate(line) !== null;
    const hasAmt = (line.match(SIGNED_AMOUNT_RE) || []).length > 0;
    // If line has a date but no amounts, try to merge with next line
    if (hasDate && !hasAmt && i + 1 < lines.length) {
      merged.push(line + ' ' + lines[i + 1]);
      i += 2;
    } else {
      merged.push(line);
      i++;
    }
  }
  return merged;
}

// ── Parse a single line ───────────────────────────────────────────────────────

function parseTransactionLine(line, source) {
  if (shouldSkip(line)) return null;

  const date = extractDate(line);
  if (!date) return null;

  const amounts = extractSignedAmounts(line);
  if (!amounts.length) return null;

  const type = resolveType(line, amounts, source);
  const amount = pickTransactionAmount(amounts, type);
  if (!amount || amount === 0) return null;

  const desc = cleanDescription(line);

  const category = categorize(desc, type);
  return {
    id: `pdf_${pdfIdCounter++}`,
    date,
    description: desc,
    amount,
    type,
    category,
    source,
    isRecurring: false,
    isUnnecessary: isUnnecessary(desc, category),
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function parsePdfFile(file, source = 'bank') {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const allLines = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const lines = await extractPageLines(page);
    allLines.push(...lines);
  }

  const merged = mergeMultiLines(allLines);
  const transactions = [];
  const seen = new Set(); // deduplicate identical lines

  for (const line of merged) {
    const key = line.trim();
    if (seen.has(key)) continue;
    seen.add(key);

    const txn = parseTransactionLine(line, source);
    if (txn) transactions.push(txn);
  }

  return transactions;
}
