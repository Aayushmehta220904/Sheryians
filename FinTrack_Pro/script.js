const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("appPage");
const loginForm = document.getElementById("loginForm");
const loginName = document.getElementById("loginName");

const welcomeText = document.getElementById("welcomeText");
const logoutBtn = document.getElementById("logoutBtn");

const navLinks = document.querySelectorAll(".nav-link");
const dashboardPage = document.getElementById("dashboardPage");
const settingsPage = document.getElementById("settingsPage");

const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const transactionModal = document.getElementById("transactionModal");
const transactionForm = document.getElementById("transactionForm");

const transactionType = document.getElementById("transactionType");
const transactionDescription = document.getElementById("transactionDescription");
const transactionAmount = document.getElementById("transactionAmount");
const transactionDate = document.getElementById("transactionDate");
const transactionCategory = document.getElementById("transactionCategory");

const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");
const transactionCount = document.getElementById("transactionCount");
const transactionTableBody = document.getElementById("transactionTableBody");
const emptyMessage = document.getElementById("emptyMessage");

const filterButtons = document.querySelectorAll(".filter-btn");

const settingsForm = document.getElementById("settingsForm");
const profileName = document.getElementById("profileName");
const currencySelect = document.getElementById("currencySelect");
const currencyPreview = document.getElementById("currencyPreview");
const themeToggle = document.getElementById("themeToggle");
const resetAllBtn = document.getElementById("resetAllBtn");
const resetFromDashboardBtn = document.getElementById("resetFromDashboardBtn");

const quickIncomeBtn = document.getElementById("quickIncomeBtn");
const quickExpenseBtn = document.getElementById("quickExpenseBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");

let transactions = JSON.parse(localStorage.getItem("fintrackTransactions")) || [];
let profile = JSON.parse(localStorage.getItem("fintrackProfile")) || {
  name: "",
  currency: "INR"
};

let activeFilter = "all";
let cashFlowChart = null;

const currencySymbols = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥"
};

function saveTransactions() {
  localStorage.setItem("fintrackTransactions", JSON.stringify(transactions));
}

function saveProfile() {
  localStorage.setItem("fintrackProfile", JSON.stringify(profile));
}

function formatMoney(amount) {
  const symbol = currencySymbols[profile.currency] || "₹";
  return `${symbol}${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function checkSession() {
  const loggedIn = localStorage.getItem("fintrackLoggedIn");

  if (loggedIn === "true") {
    loginPage.classList.add("hidden");
    appPage.classList.remove("hidden");
  } else {
    loginPage.classList.remove("hidden");
    appPage.classList.add("hidden");
  }
}

function updateProfileUI() {
  const displayName = profile.name || "User";

  welcomeText.textContent = `Welcome, ${displayName}`;
  profileName.value = profile.name || "";
  currencySelect.value = profile.currency || "INR";

  const symbol = currencySymbols[profile.currency] || "₹";
  currencyPreview.textContent = `${symbol} ${profile.currency}`;
}

function calculateTotals() {
  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      income += Number(transaction.amount);
    } else {
      expense += Number(transaction.amount);
    }
  });

  const balance = income - expense;

  return {
    income,
    expense,
    balance
  };
}

function updateCards() {
  const totals = calculateTotals();

  balanceAmount.textContent = formatMoney(totals.balance);
  incomeAmount.textContent = formatMoney(totals.income);
  expenseAmount.textContent = formatMoney(totals.expense);
  transactionCount.textContent = transactions.length;
}

function getFilteredTransactions() {
  if (activeFilter === "all") {
    return transactions;
  }

  return transactions.filter((transaction) => transaction.type === activeFilter);
}

function renderTable() {
  transactionTableBody.innerHTML = "";

  const filteredTransactions = getFilteredTransactions();

  emptyMessage.style.display = filteredTransactions.length === 0 ? "block" : "none";

  filteredTransactions.forEach((transaction) => {
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = transaction.date;

    const descriptionCell = document.createElement("td");
    descriptionCell.textContent = transaction.description;

    const categoryCell = document.createElement("td");
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "category-pill";
    categoryBadge.textContent = transaction.category;
    categoryCell.appendChild(categoryBadge);

    const typeCell = document.createElement("td");
    const typeBadge = document.createElement("span");
    typeBadge.className =
      transaction.type === "income"
        ? "type-pill type-income"
        : "type-pill type-expense";
    typeBadge.textContent = transaction.type;
    typeCell.appendChild(typeBadge);

    const amountCell = document.createElement("td");
    amountCell.className =
      transaction.type === "income" ? "amount-income" : "amount-expense";
    amountCell.textContent =
      transaction.type === "income"
        ? `+${formatMoney(transaction.amount)}`
        : `-${formatMoney(transaction.amount)}`;

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.dataset.id = transaction.id;
    actionCell.appendChild(deleteButton);

    row.append(
      dateCell,
      descriptionCell,
      categoryCell,
      typeCell,
      amountCell,
      actionCell
    );

    transactionTableBody.appendChild(row);
  });
}

function buildChartData() {
  const grouped = {};

  transactions.forEach((transaction) => {
    if (!grouped[transaction.date]) {
      grouped[transaction.date] = {
        income: 0,
        expense: 0
      };
    }

    if (transaction.type === "income") {
      grouped[transaction.date].income += Number(transaction.amount);
    } else {
      grouped[transaction.date].expense += Number(transaction.amount);
    }
  });

  const labels = Object.keys(grouped).sort();

  const incomeData = labels.map((date) => grouped[date].income);
  const expenseData = labels.map((date) => grouped[date].expense);

  return {
    labels,
    incomeData,
    expenseData
  };
}

function renderChart() {
  const chartCanvas = document.getElementById("cashFlowChart");

  if (!chartCanvas) return;

  const chartData = buildChartData();

  if (cashFlowChart) {
    cashFlowChart.destroy();
  }

  cashFlowChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Income",
          data: chartData.incomeData,
          backgroundColor: "rgba(22, 163, 74, 0.72)",
          borderRadius: 8
        },
        {
          label: "Expense",
          data: chartData.expenseData,
          backgroundColor: "rgba(220, 38, 38, 0.72)",
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body).getPropertyValue("--text")
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue("--muted")
          },
          grid: {
            color: "rgba(148, 163, 184, 0.12)"
          }
        },
        y: {
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue("--muted")
          },
          grid: {
            color: "rgba(148, 163, 184, 0.12)"
          }
        }
      }
    }
  });
}

function refreshDashboard() {
  updateProfileUI();
  updateCards();
  renderTable();
  renderChart();
}

function openModal(defaultType = "income") {
  transactionType.value = defaultType;
  transactionDate.value = getTodayDate();
  transactionModal.classList.remove("hidden");
  transactionDescription.focus();
}

function closeModal() {
  transactionModal.classList.add("hidden");
  transactionForm.reset();
  transactionDate.value = getTodayDate();
}

function addTransaction(event) {
  event.preventDefault();

  const type = transactionType.value;
  const description = transactionDescription.value.trim();
  const amount = Number(transactionAmount.value);
  const date = transactionDate.value;
  const category = transactionCategory.value;

  if (!description || !amount || amount <= 0 || !date || !category) {
    alert("Please fill all transaction fields correctly.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    type,
    description,
    amount,
    date,
    category
  };

  transactions.unshift(newTransaction);

  saveTransactions();
  closeModal();
  refreshDashboard();
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  saveTransactions();
  refreshDashboard();
}

function applyTheme() {
  const savedTheme = localStorage.getItem("fintrackTheme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Switch to Light Mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "Switch to Dark Mode";
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");

  localStorage.setItem("fintrackTheme", isDark ? "dark" : "light");

  themeToggle.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";

  renderChart();
}

function resetAllData() {
  const confirmReset = confirm(
    "Are you sure you want to reset all transactions and preferences?"
  );

  if (!confirmReset) return;

  transactions = [];
  profile = {
    name: "",
    currency: "INR"
  };

  localStorage.removeItem("fintrackTransactions");
  localStorage.removeItem("fintrackProfile");
  localStorage.removeItem("fintrackTheme");
  localStorage.removeItem("fintrackLoggedIn");

  document.body.classList.remove("dark");

  checkSession();
  refreshDashboard();
}

function exportCsv() {
  if (transactions.length === 0) {
    alert("No transactions to export.");
    return;
  }

  const headers = ["Date", "Description", "Category", "Type", "Amount"];

  const rows = transactions.map((transaction) => [
    transaction.date,
    transaction.description,
    transaction.category,
    transaction.type,
    transaction.amount
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((item) => `"${item}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv"
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "fintrack-transactions.csv";
  link.click();

  URL.revokeObjectURL(url);
}

/* EVENTS */

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = loginName.value.trim();

  if (!name) {
    alert("Please enter your name.");
    return;
  }

  profile.name = name;

  saveProfile();
  localStorage.setItem("fintrackLoggedIn", "true");

  loginName.value = "";

  checkSession();
  refreshDashboard();
});

logoutBtn.addEventListener("click", function () {
  localStorage.setItem("fintrackLoggedIn", "false");
  checkSession();
});

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    navLinks.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");

    dashboardPage.classList.remove("active-section");
    settingsPage.classList.remove("active-section");

    const pageId = this.dataset.page;
    document.getElementById(pageId).classList.add("active-section");
  });
});

openModalBtn.addEventListener("click", function () {
  openModal("income");
});

quickIncomeBtn.addEventListener("click", function () {
  openModal("income");
});

quickExpenseBtn.addEventListener("click", function () {
  openModal("expense");
});

closeModalBtn.addEventListener("click", closeModal);

transactionModal.addEventListener("click", function (event) {
  if (event.target === transactionModal) {
    closeModal();
  }
});

transactionForm.addEventListener("submit", addTransaction);

transactionTableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-btn")) {
    const id = Number(event.target.dataset.id);
    deleteTransaction(id);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((item) => item.classList.remove("active"));
    this.classList.add("active");

    activeFilter = this.dataset.filter;

    renderTable();
  });
});

settingsForm.addEventListener("submit", function (event) {
  event.preventDefault();

  profile.name = profileName.value.trim() || "User";
  profile.currency = currencySelect.value;

  saveProfile();
  refreshDashboard();

  alert("Preferences saved.");
});

currencySelect.addEventListener("change", function () {
  profile.currency = currencySelect.value;
  saveProfile();
  refreshDashboard();
});

themeToggle.addEventListener("click", toggleTheme);

resetAllBtn.addEventListener("click", resetAllData);
resetFromDashboardBtn.addEventListener("click", resetAllData);

exportCsvBtn.addEventListener("click", exportCsv);

transactionDate.value = getTodayDate();

applyTheme();
checkSession();
refreshDashboard();