# FinTrack Pro - Personal Finance Tracker

FinTrack Pro is a modern browser based personal finance tracker built using **HTML, CSS, JavaScript, Chart.js, and Local Storage**.

The application helps users manage their daily income and expenses with a clean and interactive interface. Users can add transactions, monitor their financial balance in real time, visualize cash flow through charts, filter transaction history, switch between multiple currencies, personalize their profile settings, and use dark mode.

The app runs entirely in the browser. It does not require a backend server, database, installation, or real authentication system.

---

## Tech Stack

- HTML5
- CSS3
- JavaScript ES6+
- Local Storage API
- Chart.js CDN
- Vercel for deployment

---

## Key Features

- Add income and expense transactions
- Show current balance
- Show total income
- Show total expense
- Show total transaction count
- Cash flow visualization using Chart.js
- Filter transactions by All, Income, or Expense
- Delete transactions instantly
- Multi-currency support: INR, USD, EUR, GBP, JPY
- Profile settings
- Preferred currency setting
- Dark mode / light mode toggle
- Saved theme preference
- Automatic Local Storage data persistence
- One-click reset for all saved data
- CSV export
- Simple login/logout session check
- Fully browser-based
- No backend
- No database

---

## Project Structure

```txt
FinTrack_Pro/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## About the Project

FinTrack Pro is designed to solve a simple problem: helping users understand where their money goes.

The user can add income and expense records with details such as description, amount, date, category, and transaction type. After every change, the dashboard updates automatically to show the latest balance, income, expense, transaction count, table data, and chart visualization.

The project stores all data in the browser using Local Storage. This means the saved transactions and preferences remain available even after refreshing or closing the browser tab.

---

## Main Sections

### 1. Login Page

The app starts with a simple login screen where the user enters their name.

This is not real authentication. It is only a simple session check stored in Local Storage.

Stored session value:

```js
fintrackLoggedIn = true
```

---

### 2. Dashboard

The dashboard contains:

- Current balance card
- Total income card
- Total expense card
- Total transactions card
- Cash flow chart
- Transaction history table
- Filter buttons
- Quick action buttons

---

### 3. Add Transaction Modal

The transaction modal allows users to add a new income or expense entry.

The form collects:

- Transaction type
- Description
- Amount
- Date
- Category

The form validates all required fields before saving the transaction.

---

### 4. Transaction History

The transaction table displays all saved transactions with:

- Date
- Description
- Category
- Type
- Amount
- Delete button

Users can filter transactions by All, Income, or Expense.

---

### 5. Settings Page

The settings page allows users to update:

- Display name
- Preferred currency
- Theme mode
- Stored data

The user can also reset all saved data from this section.

---

## Local Storage Usage

FinTrack Pro uses Local Storage to save data directly in the browser.

The following data is stored:

- Transactions
- User profile name
- Preferred currency
- Theme preference
- Login session status

Local Storage keys used in the project:

```js
fintrackTransactions
fintrackProfile
fintrackTheme
fintrackLoggedIn
```

---

## Data Flow

### Adding a Transaction

1. User clicks the Add Transaction button.
2. The modal opens.
3. User enters transaction details.
4. JavaScript validates the form.
5. A transaction object is created with a unique ID.
6. The transaction is added to the transactions array.
7. The updated array is saved to Local Storage.
8. The modal closes.
9. The dashboard refreshes automatically.

---

### Deleting a Transaction

1. User clicks the Delete button in the transaction table.
2. JavaScript reads the transaction ID.
3. The matching transaction is removed from the array.
4. The updated array is saved to Local Storage.
5. The dashboard refreshes.

---

### Changing Currency

1. User selects a new currency in Settings.
2. The currency preference is saved to Local Storage.
3. All displayed amounts update with the selected currency symbol.
4. Transaction values remain unchanged.

---

### Dark Mode

1. User clicks the dark mode toggle.
2. A dark class is added or removed from the body.
3. CSS variables update the page colors.
4. The selected theme is saved in Local Storage.
5. The same theme is applied again when the user revisits the app.

---

## Core JavaScript Functions

The project uses these main functions:

- `saveTransactions()`
- `saveProfile()`
- `formatMoney()`
- `checkSession()`
- `updateProfileUI()`
- `calculateTotals()`
- `updateCards()`
- `renderTable()`
- `renderChart()`
- `refreshDashboard()`
- `openModal()`
- `closeModal()`
- `addTransaction()`
- `deleteTransaction()`
- `toggleTheme()`
- `resetAllData()`
- `exportCsv()`

The most important function is:

```js
refreshDashboard()
```

This function updates the cards, transaction table, chart, profile text, and currency display after any major change.

---

## Chart.js Usage

The project uses Chart.js to display a cash flow bar chart.

The chart compares:

- Income
- Expense

Transactions are grouped by date. Income and expense values are displayed as separate bars.

Before creating a new chart, the old chart is destroyed to avoid duplicate chart rendering.

---

## Currency Support

Supported currencies:

| Currency | Symbol |
|---|---|
| INR | ₹ |
| USD | $ |
| EUR | € |
| GBP | £ |
| JPY | ¥ |

Currency only changes the displayed symbol. It does not convert amounts using exchange rates.

---

## Why Local Storage?

Local Storage is used because this is a browser-based personal finance tracker with no backend.

Advantages:

- Easy to use
- No server required
- No database required
- Data persists after refresh
- Works directly in the browser
- Good for frontend learning projects

Limitation:

- Data is stored only in the current browser.
- Data does not sync across devices.

---

## Why No Backend?

This project is focused on frontend development and browser APIs.

A backend is not required because:

- Transactions are stored locally
- No real authentication is needed
- No server-side processing is required
- The app is deployable as a static website

---

## Running Locally

Open the project folder and run the app using any of these methods.

### Method 1: Open Directly

Double-click `index.html`.

### Method 2: Use VS Code Live Server

1. Open the project folder in VS Code.
2. Right-click `index.html`.
3. Click **Open with Live Server**.

Recommended method: **Live Server**

---

## Testing Checklist

Before submission, test the following:

- Login with name
- Add income transaction
- Add expense transaction
- Check current balance update
- Check total income update
- Check total expense update
- Check total transaction count
- Check chart update
- Filter by All
- Filter by Income
- Filter by Expense
- Delete transaction
- Change currency
- Save profile settings
- Toggle dark mode
- Refresh page and confirm data remains
- Logout and login again
- Reset all saved data
- Export CSV file

---

## Expected Outcome

By the end of this project, the user gets a complete browser-based finance tracker that demonstrates real-world usage of HTML, CSS, JavaScript, Local Storage, DOM manipulation, chart visualization, user preferences, and responsive UI design.

---

## Author

Built by **Aayush Mehta**
