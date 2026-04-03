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
      desc: `You're saving ${savingsRate.toFixed(1)}% of your income. Try reaching 20-30%. Consider automating savings — set up a SIP the day after salary credit.`,
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
    (t.description.toLowerCase().includes('zomato') || t.description.toLowerCase().includes('swiggy')));
  if (foodDelivery.length >= 4) {
    const total = foodDelivery.reduce((s, t) => s + t.amount, 0);
    tips.push({
      type: 'warning',
      icon: '🍔',
      title: `High Food Delivery Spend — ${fmt(total)}`,
      desc: `You ordered food delivery ${foodDelivery.length} times, spending ${fmt(total)}. Cooking at home even 3 days a week could save ${fmt(total * 0.4)}/month = ${fmt(total * 4.8)}/year.`,
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
      title: 'No Investments Found!',
      desc: `You haven't made any investments this month. Start with at least ${fmt(income * 0.1)}/month in a Nifty 50 Index Fund SIP. Time in market beats timing the market.`,
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
        desc: `You're investing ${fmt(invTotal)} (${invRate.toFixed(1)}% of income). Financial planners suggest 10-20%. Increase SIP by ${fmt(income * 0.1 - invTotal)} to hit 10%.`,
        priority: 3,
      });
    }
  }

  // Emergency fund tip
  if (savings > 0 && savings < expenses * 3) {
    tips.push({
      type: 'info',
      icon: '🛡️',
      title: 'Build Your Emergency Fund',
      desc: `Target 3-6 months of expenses (${fmt(expenses * 3)}–${fmt(expenses * 6)}) in a liquid fund or high-yield savings account before investing aggressively.`,
      priority: 4,
    });
  }

  return tips.sort((a, b) => a.priority - b.priority);
}

export const INVESTMENT_IDEAS = [
  {
    name: 'Nifty 50 Index Fund',
    type: 'Equity Mutual Fund',
    returns: '12–15% p.a.',
    risk: 'medium',
    icon: '📊',
    desc: 'Low-cost passive fund tracking top 50 Indian companies. Ideal for long-term wealth creation. Start with ₹500/month SIP on Groww or Zerodha.',
    minAmount: 500,
  },
  {
    name: 'PPF (Public Provident Fund)',
    type: 'Government Scheme',
    returns: '7.1% p.a.',
    risk: 'low',
    icon: '🏛️',
    desc: 'Tax-free returns, government-backed. Invest up to ₹1.5L/year for Section 80C tax deduction. 15-year lock-in but very safe.',
    minAmount: 500,
  },
  {
    name: 'ELSS Tax Saving Fund',
    type: 'Equity Mutual Fund',
    returns: '13–16% p.a.',
    risk: 'medium',
    icon: '💰',
    desc: 'Save tax under 80C (up to ₹1.5L) while earning market-linked returns. Lowest lock-in of 3 years among 80C options.',
    minAmount: 500,
  },
  {
    name: 'Corporate FD (AAA rated)',
    type: 'Fixed Deposit',
    returns: '8–9% p.a.',
    risk: 'low',
    icon: '🏦',
    desc: 'Higher interest than bank FDs from top-rated companies like Bajaj Finance or HDFC. Suitable for 1–3 year goals.',
    minAmount: 5000,
  },
  {
    name: 'US S&P 500 Index Fund',
    type: 'International Fund',
    returns: '10–14% p.a.',
    risk: 'medium',
    icon: '🌎',
    desc: 'Diversify globally. Invest in top 500 US companies like Apple, Google, Microsoft. Available via Motilal Oswal or Mirae Asset funds.',
    minAmount: 100,
  },
  {
    name: 'Sovereign Gold Bond',
    type: 'Government Bond',
    returns: '8–12% p.a.',
    risk: 'low',
    icon: '🥇',
    desc: 'Digital gold with 2.5% annual interest + gold price appreciation. Tax-free if held till maturity (8 years). Better than physical gold.',
    minAmount: 4500,
  },
];
