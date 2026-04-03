import Papa from 'papaparse';

export const CATEGORY_CONFIG = {
  'Food & Dining': {
    color: '#f97316',
    bg: 'rgba(249,115,22,0.15)',
    icon: '🍔',
    unnecessary: false,
    keywords: ['zomato', 'swiggy', 'restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'dining', 'sushi',
      'mcdonald', 'starbucks', 'subway', 'dominos', 'kfc', 'grocery', 'bigbasket', 'big basket', 'dmart', 'd-mart',
      'instamart', 'blinkit', 'zepto', 'dunzo', 'bakery', 'canteen', 'mess', 'tiffin'],
  },
  'Transportation': {
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.15)',
    icon: '🚗',
    unnecessary: false,
    keywords: ['uber', 'ola', 'lyft', 'taxi', 'cab', 'rapido', 'bus', 'metro', 'train', 'petrol', 'diesel',
      'fuel', 'gas station', 'indian oil', 'hp petrol', 'parking', 'toll', 'bmtc', 'namma metro', 'irctc'],
  },
  'Bills & Utilities': {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
    icon: '⚡',
    unnecessary: false,
    keywords: ['electricity', 'bescom', 'tata power', 'water bill', 'gas cylinder', 'jio', 'airtel', 'vi ', 'bsnl',
      'broadband', 'internet', 'wifi', 'act fibernet', 'society maintenance', 'maintenance', 'rent', 'utility',
      'mobile recharge', 'postpaid'],
  },
  'Shopping': {
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.15)',
    icon: '🛍️',
    unnecessary: false,
    keywords: ['amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'meesho', 'mall', 'shopping', 'store',
      'market', 'walmart', 'reliance', 'decathlon', 'h&m', 'zara', 'westside', 'pantaloons', 'lifestyle'],
  },
  'Entertainment': {
    color: '#ec4899',
    bg: 'rgba(236,72,153,0.15)',
    icon: '🎬',
    unnecessary: true,
    keywords: ['netflix', 'movie', 'cinema', 'pvr', 'inox', 'gaming', 'steam', 'disney', 'hulu', 'prime video',
      'concert', 'event', 'bookmyshow', 'amusement', 'theatre'],
  },
  'Subscriptions': {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.15)',
    icon: '📱',
    unnecessary: false,
    keywords: ['spotify', 'youtube premium', 'hotstar', 'notion', 'figma', 'adobe', 'microsoft 365',
      'subscription', 'membership', 'renewal', 'saas'],
  },
  'Healthcare': {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    icon: '🏥',
    unnecessary: false,
    keywords: ['hospital', 'clinic', 'pharmacy', 'medicine', 'doctor', 'dental', 'health', 'medical',
      'apollo', 'medplus', 'netmeds', 'practo', 'cult.fit', 'gym', 'yoga', '1mg'],
  },
  'Travel': {
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.15)',
    icon: '✈️',
    unnecessary: false,
    keywords: ['hotel', 'flight', 'airbnb', 'booking.com', 'makemytrip', 'goibibo', 'airline', 'airport',
      'indigo', 'air india', 'spicejet', 'oyo', 'trivago', 'agoda'],
  },
  'Investments': {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.15)',
    icon: '📈',
    unnecessary: false,
    keywords: ['mutual fund', 'sip', 'zerodha', 'groww', 'paytm money', 'angel broking', 'upstox',
      'lic premium', 'insurance', 'ppf', 'nps', 'elss', 'index fund', 'stock', 'demat', 'fd ', 'fixed deposit'],
  },
  'Education': {
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.15)',
    icon: '📚',
    unnecessary: false,
    keywords: ['udemy', 'coursera', 'edx', 'skillshare', 'unacademy', 'byju', 'tuition', 'school fee',
      'college fee', 'course', 'book', 'amazon books', 'flipkart books'],
  },
  'Income': {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
    icon: '💰',
    unnecessary: false,
    keywords: ['salary', 'credit', 'freelance payment', 'interest credited', 'cashback', 'refund',
      'dividend', 'bonus', 'reimbursement', 'transfer received', 'neft received', 'imps received'],
  },
};

export const UNNECESSARY_KEYWORDS = [
  'luxury', 'premium brand', 'designer', 'impulse', 'late night', 'casino', 'gamble',
];

export function categorize(description, type) {
  if (!description) return 'Other';
  const lower = description.toLowerCase();

  // Force Income for credit type with income keywords
  if (type === 'credit') {
    const incomeKws = CATEGORY_CONFIG['Income'].keywords;
    if (incomeKws.some(k => lower.includes(k))) return 'Income';
  }

  for (const [cat, cfg] of Object.entries(CATEGORY_CONFIG)) {
    if (cat === 'Income' && type !== 'credit') continue;
    if (cfg.keywords.some(k => lower.includes(k))) return cat;
  }
  return 'Other';
}

export function isUnnecessary(description, category) {
  const lower = description.toLowerCase();
  if (category === 'Entertainment') return true;
  if (UNNECESSARY_KEYWORDS.some(k => lower.includes(k))) return true;
  // Flag repeat food deliveries
  if (category === 'Food & Dining' && (lower.includes('zomato') || lower.includes('swiggy'))) return false; // not all are unnecessary
  return false;
}

function tryParseDate(raw) {
  if (!raw) return null;
  // try multiple formats: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY, DD MMM YYYY
  const fmts = [
    /^(\d{4})-(\d{2})-(\d{2})$/,   // YYYY-MM-DD
    /^(\d{2})\/(\d{2})\/(\d{4})$/,  // DD/MM/YYYY or MM/DD/YYYY
    /^(\d{2})-(\d{2})-(\d{4})$/,    // DD-MM-YYYY
  ];
  const s = raw.trim();
  // ISO
  if (fmts[0].test(s)) return s;
  // DD/MM/YYYY
  const m2 = s.match(fmts[1]);
  if (m2) return `${m2[3]}-${m2[2]}-${m2[1]}`;
  // DD-MM-YYYY
  const m3 = s.match(fmts[2]);
  if (m3) return `${m3[3]}-${m3[2]}-${m3[1]}`;
  // Natural language
  const d = new Date(s);
  if (!isNaN(d)) return d.toISOString().slice(0, 10);
  return null;
}

function detectColumns(headers) {
  const h = headers.map(x => (x || '').toLowerCase().trim());
  const find = (...terms) => {
    for (const t of terms) {
      const i = h.findIndex(x => x.includes(t));
      if (i !== -1) return i;
    }
    return -1;
  };
  return {
    dateIdx: find('date', 'txn date', 'transaction date', 'value date'),
    descIdx: find('description', 'narration', 'particulars', 'details', 'remark', 'merchant'),
    amountIdx: find('amount', 'amt'),
    debitIdx: find('debit', 'withdrawal', 'dr'),
    creditIdx: find('credit', 'deposit', 'cr'),
    typeIdx: find('type', 'cr/dr', 'txn type'),
  };
}

let idCounter = 1;

export function parseCsvFile(file, source = 'bank') {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data;
        if (rows.length < 2) { resolve([]); return; }

        const headers = rows[0];
        const cols = detectColumns(headers);
        const transactions = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const dateRaw = cols.dateIdx !== -1 ? row[cols.dateIdx] : '';
          const date = tryParseDate(dateRaw);
          if (!date) continue;

          const description = cols.descIdx !== -1 ? (row[cols.descIdx] || '').trim() : 'Unknown';
          let amount = 0;
          let type = 'debit';

          if (cols.debitIdx !== -1 && cols.creditIdx !== -1) {
            const debit = parseFloat((row[cols.debitIdx] || '').replace(/[^0-9.-]/g, '')) || 0;
            const credit = parseFloat((row[cols.creditIdx] || '').replace(/[^0-9.-]/g, '')) || 0;
            if (credit > 0) { amount = credit; type = 'credit'; }
            else { amount = debit; type = 'debit'; }
          } else if (cols.amountIdx !== -1) {
            const raw = (row[cols.amountIdx] || '').replace(/[^0-9.-]/g, '');
            amount = Math.abs(parseFloat(raw) || 0);
            if (cols.typeIdx !== -1) {
              const t = (row[cols.typeIdx] || '').toLowerCase();
              type = t.includes('cr') ? 'credit' : 'debit';
            } else {
              type = parseFloat(raw) < 0 ? 'debit' : 'debit'; // default debit
            }
          }

          if (amount === 0) continue;
          const category = categorize(description, type);
          const txn = {
            id: `csv_${idCounter++}`,
            date,
            description,
            amount,
            type,
            category,
            source,
            isRecurring: false,
            isUnnecessary: isUnnecessary(description, category),
          };
          transactions.push(txn);
        }
        resolve(transactions);
      },
      error: reject,
    });
  });
}

export function detectRecurring(transactions) {
  // Group by normalized description
  const groups = {};
  transactions.forEach(t => {
    const key = t.description.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().slice(0, 30);
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });

  const recurringIds = new Set();
  Object.entries(groups).forEach(([, txns]) => {
    if (txns.length >= 2) {
      txns.forEach(t => recurringIds.add(t.id));
    }
  });

  return transactions.map(t => ({ ...t, isRecurring: recurringIds.has(t.id) }));
}

export const CURRENCY = '₹';
export const fmt = (n) => `${CURRENCY}${Number(n).toLocaleString('en-IN')}`;
