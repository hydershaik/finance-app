export const sampleTransactions = [
  // ── INCOME ──
  { id: 's1',  date: '2024-03-01', description: 'Salary Credit - TechCorp India', amount: 85000, type: 'credit', category: 'Income', source: 'bank' },
  { id: 's2',  date: '2024-03-08', description: 'Freelance Payment - Design Project', amount: 15000, type: 'credit', category: 'Income', source: 'bank' },
  { id: 's3',  date: '2024-03-20', description: 'Interest Credited - Savings A/c', amount: 420, type: 'credit', category: 'Income', source: 'bank' },
  { id: 's4',  date: '2024-03-28', description: 'Cashback Reward - Credit Card', amount: 650, type: 'credit', category: 'Income', source: 'credit_card' },

  // ── FOOD & DINING ──
  { id: 's5',  date: '2024-03-02', description: 'Zomato - Pizza & Wings', amount: 780, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's6',  date: '2024-03-04', description: 'Swiggy Instamart Groceries', amount: 1240, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's7',  date: '2024-03-07', description: 'Starbucks Coffee', amount: 580, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's8',  date: '2024-03-09', description: 'D-Mart Grocery Shopping', amount: 3200, type: 'debit', category: 'Food & Dining', source: 'bank' },
  { id: 's9',  date: '2024-03-12', description: 'Zomato Order - Biryani', amount: 450, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's10', date: '2024-03-15', description: 'McDonald\'s', amount: 340, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's11', date: '2024-03-18', description: 'Swiggy Food Delivery', amount: 620, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's12', date: '2024-03-21', description: 'Big Basket Grocery', amount: 2800, type: 'debit', category: 'Food & Dining', source: 'bank' },
  { id: 's13', date: '2024-03-24', description: 'Zomato - Sushi Restaurant', amount: 1100, type: 'debit', category: 'Food & Dining', source: 'credit_card' },
  { id: 's14', date: '2024-03-27', description: 'Starbucks Coffee', amount: 560, type: 'debit', category: 'Food & Dining', source: 'credit_card' },

  // ── TRANSPORTATION ──
  { id: 's15', date: '2024-03-02', description: 'Uber Cab', amount: 280, type: 'debit', category: 'Transportation', source: 'credit_card' },
  { id: 's16', date: '2024-03-05', description: 'Indian Oil Petrol Pump', amount: 3000, type: 'debit', category: 'Transportation', source: 'bank' },
  { id: 's17', date: '2024-03-10', description: 'Ola Cab Ride', amount: 180, type: 'debit', category: 'Transportation', source: 'credit_card' },
  { id: 's18', date: '2024-03-13', description: 'BMTC Monthly Pass', amount: 800, type: 'debit', category: 'Transportation', source: 'bank' },
  { id: 's19', date: '2024-03-20', description: 'Indian Oil Petrol', amount: 2500, type: 'debit', category: 'Transportation', source: 'bank' },
  { id: 's20', date: '2024-03-25', description: 'Rapido Bike Ride', amount: 60, type: 'debit', category: 'Transportation', source: 'credit_card' },

  // ── BILLS & UTILITIES ──
  { id: 's21', date: '2024-03-03', description: 'BESCOM Electricity Bill', amount: 1800, type: 'debit', category: 'Bills & Utilities', source: 'bank' },
  { id: 's22', date: '2024-03-05', description: 'Jio Postpaid Mobile Bill', amount: 799, type: 'debit', category: 'Bills & Utilities', source: 'bank' },
  { id: 's23', date: '2024-03-06', description: 'ACT Broadband Internet', amount: 1099, type: 'debit', category: 'Bills & Utilities', source: 'bank' },
  { id: 's24', date: '2024-03-10', description: 'Society Maintenance', amount: 3500, type: 'debit', category: 'Bills & Utilities', source: 'bank' },

  // ── SHOPPING ──
  { id: 's25', date: '2024-03-06', description: 'Amazon - Electronics Accessories', amount: 2800, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's26', date: '2024-03-11', description: 'Myntra - Clothing', amount: 3200, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's27', date: '2024-03-14', description: 'Amazon - Books', amount: 640, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's28', date: '2024-03-19', description: 'Nykaa - Cosmetics', amount: 1800, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's29', date: '2024-03-23', description: 'Flipkart - Home Decor', amount: 4500, type: 'debit', category: 'Shopping', source: 'credit_card' },
  { id: 's30', date: '2024-03-26', description: 'Amazon - Impulse Buy Gadget', amount: 5200, type: 'debit', category: 'Shopping', source: 'credit_card' },

  // ── ENTERTAINMENT ──
  { id: 's31', date: '2024-03-04', description: 'Netflix Subscription', amount: 649, type: 'debit', category: 'Entertainment', source: 'credit_card' },
  { id: 's32', date: '2024-03-08', description: 'PVR Cinemas - Movie Tickets', amount: 840, type: 'debit', category: 'Entertainment', source: 'credit_card' },
  { id: 's33', date: '2024-03-15', description: 'Steam - Game Purchase', amount: 1200, type: 'debit', category: 'Entertainment', source: 'credit_card' },
  { id: 's34', date: '2024-03-22', description: 'PVR IMAX - Movie Tickets', amount: 1200, type: 'debit', category: 'Entertainment', source: 'credit_card' },

  // ── SUBSCRIPTIONS ──
  { id: 's35', date: '2024-03-01', description: 'Spotify Premium', amount: 119, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's36', date: '2024-03-03', description: 'Amazon Prime Membership', amount: 179, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's37', date: '2024-03-05', description: 'YouTube Premium', amount: 189, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's38', date: '2024-03-07', description: 'Hotstar Subscription', amount: 299, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's39', date: '2024-03-10', description: 'Notion Pro Plan', amount: 320, type: 'debit', category: 'Subscriptions', source: 'credit_card' },
  { id: 's40', date: '2024-03-12', description: 'Figma Professional', amount: 1200, type: 'debit', category: 'Subscriptions', source: 'credit_card' },

  // ── HEALTHCARE ──
  { id: 's41', date: '2024-03-08', description: 'Apollo Pharmacy - Medicines', amount: 680, type: 'debit', category: 'Healthcare', source: 'bank' },
  { id: 's42', date: '2024-03-16', description: 'Cult.fit Gym Membership', amount: 2500, type: 'debit', category: 'Healthcare', source: 'bank' },

  // ── INVESTMENTS ──
  { id: 's43', date: '2024-03-05', description: 'Groww - Nifty 50 Index Fund SIP', amount: 5000, type: 'debit', category: 'Investments', source: 'bank' },
  { id: 's44', date: '2024-03-05', description: 'Zerodha - ELSS Tax Saving Fund', amount: 3000, type: 'debit', category: 'Investments', source: 'bank' },
  { id: 's45', date: '2024-03-10', description: 'LIC Premium - Term Insurance', amount: 8200, type: 'debit', category: 'Investments', source: 'bank' },

  // ── TRAVEL ──
  { id: 's46', date: '2024-03-16', description: 'MakeMyTrip - Flight to Mumbai', amount: 5800, type: 'debit', category: 'Travel', source: 'credit_card' },
  { id: 's47', date: '2024-03-17', description: 'Hotel Booking - Mumbai', amount: 4200, type: 'debit', category: 'Travel', source: 'credit_card' },

  // ── EDUCATION ──
  { id: 's48', date: '2024-03-14', description: 'Udemy Course - React Advanced', amount: 599, type: 'debit', category: 'Education', source: 'credit_card' },
];
