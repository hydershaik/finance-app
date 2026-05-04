import { fmt } from './parser';

export function computeSummary(transactions) {
  const income = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  return { income, expenses, savings, savingsRate };
}

export function categoryBreakdown(transactions) {
  const map = {};
  transactions.filter(t => t.type === 'debit').forEach(t => {
    if (!map[t.category]) map[t.category] = 0;
    map[t.category] += t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function monthlyTrend(transactions) {
  const map = {};
  transactions.forEach(t => {
    const month = t.date.slice(0, 7); // YYYY-MM
    if (!map[month]) map[month] = { month, income: 0, expenses: 0 };
    if (t.type === 'credit') map[month].income += t.amount;
    else map[month].expenses += t.amount;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
}

export function getRecurringPayments(transactions) {
  const groups = {};
  transactions
    .filter(t => t.type === 'debit')
    .forEach(t => {
      const key = t.description.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().slice(0, 40);
      if (!groups[key]) groups[key] = { name: t.description, category: t.category, amounts: [], dates: [] };
      groups[key].amounts.push(t.amount);
      groups[key].dates.push(t.date);
    });

  return Object.values(groups)
    .filter(g => g.amounts.length >= 2)
    .map(g => {
      const avg = g.amounts.reduce((s, a) => s + a, 0) / g.amounts.length;
      return {
        name: g.name,
        category: g.category,
        avgAmount: avg,
        occurrences: g.amounts.length,
        monthlyEstimate: avg,
        yearlyEstimate: avg * 12,
      };
    })
    .sort((a, b) => b.monthlyEstimate - a.monthlyEstimate);
}

export function getFlaggedTransactions(transactions) {
  return transactions.filter(t => t.isUnnecessary && t.type === 'debit');
}

export function generateTips(transactions, summary) {
  const tips = [];
  const { income, expenses, savings, savingsRate } = summary;

  // Savings rate
  if (savingsRate < 10) {
    tips.push({
      type: 'danger',
      icon: '⚠️',
      title: 'Critical: Very Low Savings Rate',
      desc: `Your savings rate is only ${savingsRate.toFixed(1)}%. Financial experts recommend saving at least 20% of income. You need to cut expenses by ${fmt(expenses - income * 0.8)} to reach that goal.`,
      priority: 1,
    });
  } else if (savingsRate < 20) {
    tips.push({
      type: 'warning',
      icon: '📊',
      title: 'Low Savings Rate — Room to Improve',
      desc: `You're saving ${savingsRate.toFixed(1)}% of your income. Target 20%+. Automate it: set up an auto-transfer to a HYSA on payday so you save before you spend.`,
      priority: 2,
    });
  } else {
    tips.push({
      type: 'success',
      icon: '🎯',
      title: 'Great Savings Rate!',
      desc: `You're saving ${savingsRate.toFixed(1)}% of your income — that's excellent! Consider putting some of those savings into higher-yield investments.`,
      priority: 1,
    });
  }

  // Food delivery
  const foodDelivery = transactions.filter(t => t.type === 'debit' &&
    (t.description.toLowerCase().includes('doordash') || t.description.toLowerCase().includes('grubhub') || t.description.toLowerCase().includes('uber eats')));
  if (foodDelivery.length >= 3) {
    const total = foodDelivery.reduce((s, t) => s + t.amount, 0);
    tips.push({
      type: 'warning',
      icon: '🍔',
      title: `High Food Delivery Spend — ${fmt(total)}`,
      desc: `You ordered food delivery ${foodDelivery.length} times, spending ${fmt(total)} (avg ${fmt(total / foodDelivery.length)}/order including fees & tips). Meal prepping 3 days a week could save ${fmt(total * 0.45)}/month = ${fmt(total * 5.4)}/year.`,
      priority: 3,
    });
  }

  // Subscriptions audit
  const subs = transactions.filter(t => t.category === 'Subscriptions' && t.type === 'debit');
  if (subs.length >= 4) {
    const total = subs.reduce((s, t) => s + t.amount, 0);
    tips.push({
      type: 'info',
      icon: '📱',
      title: `${subs.length} Active Subscriptions — ${fmt(total)}/mo`,
      desc: `Review your ${subs.length} subscriptions. Unused ones are pure waste. Cancel the ones you use less than twice a week. That could free up ${fmt(total * 12)}/year.`,
      priority: 4,
    });
  }

  // Entertainment
  const entertainment = transactions.filter(t => t.category === 'Entertainment' && t.type === 'debit');
  if (entertainment.length >= 2) {
    const total = entertainment.reduce((s, t) => s + t.amount, 0);
    tips.push({
      type: 'warning',
      icon: '🎬',
      title: `Entertainment Spending — ${fmt(total)}`,
      desc: `Entertainment costs ${fmt(total)} this month. Streaming services you already pay for can replace cinema visits. Could save ${fmt(total * 0.5)}/month.`,
      priority: 5,
    });
  }

  // No investments
  const investments = transactions.filter(t => t.category === 'Investments' && t.type === 'debit');
  if (investments.length === 0 && income > 0) {
    tips.push({
      type: 'danger',
      icon: '📈',
      title: 'No Investments Found This Month!',
      desc: `You haven't invested anything this month. Start with at least ${fmt(income * 0.1)}/month — max out your 401(k) employer match first (it's free money), then contribute to a Roth IRA. Time in market beats timing the market.`,
      priority: 1,
    });
  } else if (investments.length > 0) {
    const invTotal = investments.reduce((s, t) => s + t.amount, 0);
    const invRate = income > 0 ? (invTotal / income) * 100 : 0;
    if (invRate < 10) {
      tips.push({
        type: 'info',
        icon: '💡',
        title: `Increase Investment Rate (currently ${invRate.toFixed(1)}%)`,
        desc: `You're investing ${fmt(invTotal)}/month (${invRate.toFixed(1)}% of income). Aim for 15-20%. Consider increasing your 401(k) contribution by ${fmt(income * 0.1 - invTotal)}/mo to hit 10%.`,
        priority: 3,
      });
    }
  }

  // High housing cost warning
  const housing = transactions.filter(t => t.type === 'debit' &&
    (t.description.toLowerCase().includes('rent') || t.description.toLowerCase().includes('mortgage')));
  if (housing.length > 0 && income > 0) {
    const housingTotal = housing.reduce((s, t) => s + t.amount, 0);
    const housingPct = (housingTotal / income) * 100;
    if (housingPct > 30) {
      tips.push({
        type: 'warning',
        icon: '🏠',
        title: `Housing is ${housingPct.toFixed(0)}% of Income (Above 30% Rule)`,
        desc: `Financial advisors recommend keeping housing under 30% of gross income. Your housing costs ${fmt(housingTotal)}/month. Consider a roommate, relocating, or increasing income to rebalance.`,
        priority: 2,
      });
    }
  }

  // Emergency fund tip
  if (savings > 0 && savings < expenses * 3) {
    tips.push({
      type: 'info',
      icon: '🛡️',
      title: 'Build Your Emergency Fund',
      desc: `Target 3–6 months of expenses (${fmt(expenses * 3)}–${fmt(expenses * 6)}) in a high-yield savings account (Marcus, Ally, or SoFi offer 4%+ APY). This is your financial safety net before investing aggressively.`,
      priority: 4,
    });
  }

  return tips.sort((a, b) => a.priority - b.priority);
}

export const INVESTMENT_IDEAS = [
  {
    name: 'S&P 500 Index Fund (VOO/SPY)',
    type: 'ETF / Index Fund',
    returns: '10–11% avg. p.a.',
    risk: 'medium',
    icon: '📊',
    desc: 'Invest in the 500 largest US companies. Vanguard VOO has just 0.03% expense ratio. The simplest, most proven wealth-building vehicle. Buy through Fidelity, Schwab, or Robinhood.',
    minAmount: 1,
  },
  {
    name: '401(k) with Employer Match',
    type: 'Retirement Account',
    returns: 'Market + Free Match',
    risk: 'medium',
    icon: '🏦',
    desc: 'Contribute at least enough to get your full employer match — it\'s an instant 50–100% return. 2024 limit: $23,000. Pre-tax contributions lower your taxable income today.',
    minAmount: 1,
  },
  {
    name: 'Roth IRA',
    type: 'Retirement Account',
    returns: '10–11% avg. p.a.',
    risk: 'medium',
    icon: '💰',
    desc: 'Tax-free growth forever. Contribute up to $7,000/year (2024). Withdraw contributions anytime without penalty. Best if you expect to be in a higher tax bracket in retirement.',
    minAmount: 1,
  },
  {
    name: 'High-Yield Savings (HYSA)',
    type: 'Cash / Emergency Fund',
    returns: '4.5–5.0% APY',
    risk: 'low',
    icon: '🛡️',
    desc: 'Park your 3–6 month emergency fund here. Ally, Marcus by Goldman Sachs, and SoFi offer 4.5%+ APY — 10× better than traditional bank savings. FDIC insured.',
    minAmount: 1,
  },
  {
    name: 'Total Bond Market (BND)',
    type: 'Bond ETF',
    returns: '4–5% p.a.',
    risk: 'low',
    icon: '📜',
    desc: 'Stabilize your portfolio with Vanguard BND. Provides steady income and reduces volatility. Ideal as 10–20% of a long-term portfolio or for goals 1–3 years out.',
    minAmount: 80,
  },
  {
    name: 'Real Estate ETF (VNQ)',
    type: 'REIT ETF',
    returns: '8–10% p.a.',
    risk: 'medium',
    icon: '🏠',
    desc: 'Own real estate without being a landlord. Vanguard VNQ holds 160+ US REITs. Pays regular dividends and provides inflation protection. Great portfolio diversifier.',
    minAmount: 80,
  },
];
