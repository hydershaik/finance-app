export const sampleTransactions = [
  // ── INCOME ──
  { id: 's1',  date: '2024-03-01', description: 'Direct Deposit - Payroll TechCorp', amount: 5800, type: 'credit', category: 'Income', source: 'bank' },
  { id: 's2',  date: '2024-03-08', description: 'Zelle Received - Freelance Project', amount: 1200, type: 'credit', category: 'Income', source: 'bank' },
  { id: 's3',  date: '2024-03-20', description: 'Interest Credited - Savings Account', amount: 38, type: 'credit', category: 'Income', source: 'bank' },
  { id: 's4',  date: '2024-03-28', description: 'Cashback Reward - Chase Sapphire', amount: 45, type: 'credit', category: 'Income', source: 'credit_card' },

  // ── FOOD & DINING ──
  { id: 's5',  date: '2024-03-02', description: 'DoorDash - Chipotle Order', amount: 28, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's6',  date: '2024-03-04', description: 'Whole Foods Market', amount: 142, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's7',  date: '2024-03-06', description: 'Starbucks Coffee', amount: 7, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's8',  date: '2024-03-09', description: 'Trader Joe\'s Grocery', amount: 89, type: 'debit', category: 'Food & Dining', source: 'bank' },
  { id: 's9',  date: '2024-03-11', description: 'DoorDash - Thai Restaurant', amount: 34, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's10', date: '2024-03-13', description: 'McDonald\'s', amount: 12, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's11', date: '2024-03-16', description: 'Grubhub - Pizza Delivery', amount: 41, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's12', date: '2024-03-19', description: 'Kroger Grocery', amount: 124, type: 'debit', category: 'Food & Dining', source: 'bank' },
  { id: 's13', date: '2024-03-22', description: 'The Cheesecake Factory', amount: 78, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's14', date: '2024-03-26', description: 'Starbucks Coffee', amount: 8, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's15', date: '2024-03-29', description: 'Panera Bread', amount: 15, type: 'debit', category: 'Food & Dining', source: 'credit_card' },

  // ── TRANSPORTATION ──
  { id: 's16', date: '2024-03-03', description: 'Uber Trip', amount: 18, type: 'debit', category: 'Transportation', source: 'credit_card' },
  { id: 's17', date: '2024-03-06', description: 'Shell Gas Station', amount: 58, type: 'debit', category: 'Transportation', source: 'bank' },
  { id: 's18', date: '2024-03-12', description: 'Lyft Ride', amount: 14, type: 'debit', category: 'Transportation', source: 'credit_card' },
  { id: 's19', date: '2024-03-15', description: 'Monthly Metro Pass', amount: 132, type: 'debit', category: 'Transportation', source: 'bank' },
  { id: 's20', date: '2024-03-21', description: 'Chevron Gas Station', amount: 52, type: 'debit', category: 'Transportation', source: 'bank' },
  { id: 's21', date: '2024-03-27', description: 'E-ZPass Toll Replenishment', amount: 25, type: 'debit', category: 'Transportation', source: 'bank' },

  // ── BILLS & UTILITIES ──
  { id: 's22', date: '2024-03-03', description: 'Con Edison Electric Bill', amount: 112, type: 'debit', category: 'Bills & Utilities', source: 'bank' },
  { id: 's23', date: '2024-03-05', description: 'Verizon Wireless Bill', amount: 85, type: 'debit', category: 'Bills & Utilities', source: 'bank' },
  { id: 's24', date: '2024-03-06', description: 'Xfinity Internet', amount: 79, type: 'debit', category: 'Bills & Utilities', source: 'bank' },
  { id: 's25', date: '2024-03-01', description: 'Rent Payment - ACH Transfer', amount: 1750, type: 'debit', category: 'Bills & Utilities', source: 'bank' },

  // ── SHOPPING ──
  { id: 's26', date: '2024-03-07', description: 'Amazon - Electronics', amount: 89, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's27', date: '2024-03-10', description: 'Target - Household Items', amount: 67, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's28', date: '2024-03-14', description: 'Amazon - Books & Office', amount: 38, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's29', date: '2024-03-18', description: 'Nordstrom - Clothing', amount: 145, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's30', date: '2024-03-23', description: 'Home Depot - Home Improvement', amount: 212, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's31', date: '2024-03-25', description: 'Amazon - Impulse Buy Gadget', amount: 179, type: 'debit', category: 'Shopping', source: 'credit_card' },

  // ── ENTERTAINMENT ──
  { id: 's32', date: '2024-03-08', description: 'AMC Theaters - Movie Tickets', amount: 36, type: 'debit', category: 'Entertainment', source: 'credit_card' },
  { id: 's33', date: '2024-03-15', description: 'Steam - Game Purchase', amount: 30, type: 'debit', category: 'Entertainment', source: 'credit_card' },
  { id: 's34', date: '2024-03-24', description: 'Ticketmaster - Concert Tickets', amount: 120, type: 'debit', category: 'Entertainment', source: 'credit_card' },

  // ── SUBSCRIPTIONS ──
  { id: 's35', date: '2024-03-01', description: 'Netflix Subscription', amount: 15, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's36', date: '2024-03-02', description: 'Spotify Premium', amount: 11, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's37', date: '2024-03-03', description: 'Hulu Subscription', amount: 18, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's38', date: '2024-03-04', description: 'Disney+ Subscription', amount: 14, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's39', date: '2024-03-05', description: 'Microsoft 365 Personal', amount: 10, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's40', date: '2024-03-06', description: 'Adobe Creative Cloud', amount: 55, type: 'debit', category: 'Subscriptions', source: 'credit_card' },

  // ── HEALTHCARE ──
  { id: 's41', date: '2024-03-09', description: 'CVS Pharmacy - Prescription', amount: 42, type: 'debit', category: 'Healthcare', source: 'bank' },
  { id: 's42', date: '2024-03-16', description: 'Planet Fitness Membership', amount: 25, type: 'debit', category: 'Healthcare', source: 'bank' },
  { id: 's43', date: '2024-03-20', description: 'Doctor Office Copay', amount: 30, type: 'debit', category: 'Healthcare', source: 'bank' },

  // ── INVESTMENTS ──
  { id: 's44', date: '2024-03-01', description: 'Vanguard - 401(k) Contribution', amount: 580, type: 'debit', category: 'Investments', source: 'bank' },
  { id: 's45', date: '2024-03-05', description: 'Fidelity Roth IRA Contribution', amount: 500, type: 'debit', category: 'Investments', source: 'bank' },
  { id: 's46', date: '2024-03-10', description: 'Robinhood - S&P 500 ETF (VOO)', amount: 200, type: 'debit', category: 'Investments', source: 'bank' },

  // ── TRAVEL ──
  { id: 's47', date: '2024-03-16', description: 'Delta Airlines - Flight to NYC', amount: 224, type: 'debit', category: 'Travel', source: 'credit_card' },
  { id: 's48', date: '2024-03-17', description: 'Marriott Hotel - New York', amount: 189, type: 'debit', category: 'Travel', source: 'credit_card' },

  // ── EDUCATION ──
  { id: 's49', date: '2024-03-14', description: 'Udemy Course - AWS Certification', amount: 20, type: 'debit', category: 'Education', source: 'credit_card' },
];
