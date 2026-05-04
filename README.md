# FinanceIQ — Smart Financial Tracker

> **Your Money, Fully Understood.**  
> Upload your bank and credit card statements to get instant insights, spending analysis, and personalized financial advice — all processed privately in your browser.

---

## Overview

FinanceIQ is a modern, privacy-first personal finance dashboard built with React and Vite. It parses your real bank/credit card statements (PDF or CSV), categorizes every transaction automatically, and turns raw data into actionable insights — with zero data leaving your device.

---

## Features

| Tab | What it does |
|-----|-------------|
| **Upload** | Drag-and-drop or browse to upload PDF or CSV statements from your bank and credit cards. Try instantly with built-in sample data. |
| **Overview** | Summary cards (Total Income, Total Expenses, Net Savings, Savings Rate) + Expense Pie Chart, Category Bar Chart, and Monthly Income vs Expenses area chart. |
| **Transactions** | Full searchable, filterable transaction table — filter by type, category, date range, or keyword. |
| **Insights** | Financial Health Score (0–100), recurring payment detection, flagged unnecessary expenses, and personalized money-saving tips. |
| **Investments** | SIP calculator, investment ideas based on your surplus, and a financial readiness radar chart. |

### Key Highlights
- **PDF & CSV support** — Works with Chase, Bank of America, Wells Fargo, Citi, Capital One, Discover (text-based PDFs) and any CSV export with Date, Description, Amount columns
- **Auto-categorization** — Transactions automatically sorted into Food, Transport, Shopping, Utilities, Health, Entertainment, and more
- **Recurring payment detection** — Automatically identifies subscriptions and recurring charges
- **100% client-side** — No server, no database, no account required. Your data never leaves your browser.

---

## Screenshots

> **Landing / Upload Page**

The upload page is your entry point. Drop your bank statement PDF or CSV, and the app processes everything locally.

```
┌─────────────────────────────────────────────────┐
│          Your Money, Fully Understood            │
│                                                 │
│   [🏦 Bank Statement]   [💳 Credit Card]        │
│    Drag & drop PDF/CSV   Drag & drop PDF/CSV    │
│                                                 │
│        ✨ Try with Sample Data →                 │
└─────────────────────────────────────────────────┘
```

To see live screenshots, run the app locally (instructions below) and open it in your browser.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite 5** | Build tool & dev server |
| **Recharts** | Charts (Pie, Bar, Area, Radar) |
| **PapaParse** | CSV parsing |
| **pdfjs-dist** | In-browser PDF text extraction |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/hydershaik/finance-app.git

# 2. Navigate into the project folder
cd finance-app

# 3. Install dependencies
npm install
```

### Running the App

```bash
# Start the development server
npm run dev
```

Open your browser and go to: **http://localhost:5173**

### Build for Production

```bash
# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

The built files will be in the `dist/` folder — ready to deploy to any static hosting (Netlify, Vercel, GitHub Pages, etc.).

---

## How to Use

1. **Upload your statement** — Click "Bank Statement" or "Credit Card Statement" and select a PDF or CSV file, or drag and drop it.
2. **Or try sample data** — Click "Load Sample Data" to instantly explore all features with realistic transactions.
3. **Click "Analyze"** — The app parses and categorizes everything in seconds.
4. **Explore your dashboard** — Navigate between Overview, Transactions, Insights, and Investments tabs.

### Supported File Formats

| Format | Details |
|--------|---------|
| **PDF** | Text-based bank statement PDFs from major US banks |
| **CSV** | Exported from online banking — needs `Date`, `Description`, `Amount` columns |

---

## Project Structure

```
finance-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation tabs
│   │   ├── Upload.jsx          # File upload landing page
│   │   ├── Overview.jsx        # Summary + charts dashboard
│   │   ├── Transactions.jsx    # Transaction table with filters
│   │   ├── Insights.jsx        # Health score + tips
│   │   └── Investments.jsx     # SIP calculator + ideas
│   ├── utils/
│   │   ├── parser.js           # CSV parsing + transaction categorization
│   │   ├── pdfParser.js        # PDF text extraction + parsing
│   │   └── analysis.js         # Summary, trends, health score logic
│   ├── data/
│   │   └── sampleData.js       # Built-in sample transactions
│   ├── App.jsx                 # Root component + routing logic
│   ├── main.jsx                # React entry point
│   └── styles.css              # Global dark-theme styles
├── index.html
├── vite.config.js
└── package.json
```

---

## Privacy

All processing happens **entirely in your browser** using the Web APIs. No data is ever uploaded to a server or stored anywhere outside your device.

---

## License

MIT — free to use, modify, and distribute.

---

*Built with React + Vite by [hydershaik](https://github.com/hydershaik)*
