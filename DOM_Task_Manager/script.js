const body = document.body;
const html = document.documentElement;

const themeToggle = document.getElementById("themeToggle");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const prependDemoBtn = document.getElementById("prependDemoBtn");
const clearAllBtn = document.getElementById("clearAllBtn");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const attributeDemoInput = document.getElementById("attributeDemoInput");
const checkAttributeBtn = document.getElementById("checkAttributeBtn");
const attributeOutput = document.getElementById("attributeOutput");

const grandparent = document.getElementById("grandparent");
const parentBox = document.getElementById("parent");
const childBtn = document.getElementById("childBtn");

let tasks = JSON.parse(localStorage.getItem("domTaskManagerTasks")) || [];
let taskId = Number(localStorage.getItem("domTaskManagerId")) || 1;

function saveData() {
  localStorage.setItem("domTaskManagerTasks", JSON.stringify(tasks));
  localStorage.setItem("domTaskManagerId", String(taskId));
}

function updateCounters() {
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;

  totalCount.textContent = tasks.length;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = "task-card";

  card.setAttribute("data-id", task.id);
  card.setAttribute("data-status", task.status);
  card.setAttribute("data-category", task.category);

  if (task.status === "completed") {
    card.classList.add("completed");
  }

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const category = document.createElement("span");
  category.className = "category-pill";
  category.appendChild(document.createTextNode(task.category));

  const status = document.createElement("span");
  status.className = `status-pill ${task.status}`;
  status.appendChild(document.createTextNode(task.status));

  meta.append(category, status);

  const title = document.createElement("h3");
  title.className = "task-title";
  title.appendChild(document.createTextNode(task.title));

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const completeBtn = document.createElement("button");
  completeBtn.className = "task-action complete-btn";
  completeBtn.setAttribute("data-action", "complete");
  completeBtn.appendChild(
    document.createTextNode(task.status === "completed" ? "Undo" : "Complete")
  );

  const editBtn = document.createElement("button");
  editBtn.className = "task-action edit-btn";
  editBtn.setAttribute("data-action", "edit");
  editBtn.appendChild(document.createTextNode("Edit"));

  const duplicateBtn = document.createElement("button");
  duplicateBtn.className = "task-action duplicate-btn";
  duplicateBtn.setAttribute("data-action", "duplicate");
  duplicateBtn.appendChild(document.createTextNode("Duplicate"));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-action delete-btn";
  deleteBtn.setAttribute("data-action", "delete");
  deleteBtn.appendChild(document.createTextNode("Delete"));

  actions.append(completeBtn, editBtn, duplicateBtn, deleteBtn);

  card.append(meta, title, actions);

  return card;
}

function renderTasks() {
  taskList.innerHTML = "";

  const searchValue = searchInput.value.trim().toLowerCase();
  const selectedCategory = filterCategory.value;

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchValue);
    const matchesCategory =
      selectedCategory === "all" || task.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const fragment = document.createDocumentFragment();

  filteredTasks.forEach((task) => {
    const taskCard = createTaskCard(task);
    fragment.appendChild(taskCard);
  });

  taskList.appendChild(fragment);

  emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";

  updateCounters();
}

function addTask(title, category, mode = "append") {
  const newTask = {
    id: taskId,
    title: title,
    category: category,
    status: "pending"
  };

  taskId++;

  if (mode === "prepend") {
    tasks.unshift(newTask);
  } else {
    tasks.push(newTask);
  }

  saveData();
  renderTasks();
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskInput.value.trim();
  const category = categoryInput.value;

  if (title === "") {
    alert("Please enter a task title.");
    return;
  }

  addTask(title, category);

  taskInput.value = "";
  taskInput.focus();
});

taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) return;

  const card = button.closest(".task-card");

  if (!card) return;

  const id = Number(card.dataset.id);
  const action = button.dataset.action;

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) return;

  if (action === "complete") {
    tasks[taskIndex].status =
      tasks[taskIndex].status === "completed" ? "pending" : "completed";

    card.dataset.status = tasks[taskIndex].status;
    card.setAttribute("data-status", tasks[taskIndex].status);
    card.classList.toggle("completed");

    saveData();
    renderTasks();
  }

  if (action === "edit") {
    const newTitle = prompt("Edit task:", tasks[taskIndex].title);

    if (newTitle === null) return;

    const cleanTitle = newTitle.trim();

    if (cleanTitle === "") {
      alert("Task title cannot be empty.");
      return;
    }

    tasks[taskIndex].title = cleanTitle;

    saveData();

    const newCard = createTaskCard(tasks[taskIndex]);

    card.replaceWith(newCard);

    updateCounters();
  }

  if (action === "duplicate") {
    const originalTask = tasks[taskIndex];

    const duplicateTask = {
      id: taskId,
      title: `${originalTask.title} Copy`,
      category: originalTask.category,
      status: "pending"
    };

    taskId++;

    tasks.splice(taskIndex + 1, 0, duplicateTask);

    saveData();

    const message = document.createElement("div");
    message.className = "output-box";
    message.textContent = "before() and after() demo: duplicate task created.";

    card.before(message);

    const duplicateCard = createTaskCard(duplicateTask);

    card.after(duplicateCard);

    setTimeout(function () {
      message.remove();
      renderTasks();
    }, 1000);
  }

  if (action === "delete") {
    console.log("getAttribute data-id:", card.getAttribute("data-id"));
    console.log("hasAttribute data-category:", card.hasAttribute("data-category"));

    card.removeAttribute("data-category");
    console.log("removeAttribute data-category executed before card removal.");

    tasks.splice(taskIndex, 1);

    saveData();

    card.remove();

    renderTasks();
  }
});

searchInput.addEventListener("input", renderTasks);
filterCategory.addEventListener("change", renderTasks);

prependDemoBtn.addEventListener("click", function () {
  addTask("Prepended demo task", "DOM", "prepend");
});

clearAllBtn.addEventListener("click", function () {
  if (tasks.length === 0) return;

  const confirmDelete = confirm("Clear all tasks?");

  if (!confirmDelete) return;

  tasks = [];

  saveData();
  renderTasks();
});

checkAttributeBtn.addEventListener("click", function () {
  const propertyValue = attributeDemoInput.value;
  const attributeValue = attributeDemoInput.getAttribute("value");

  attributeOutput.innerHTML = `
    <strong>input.value property:</strong> ${propertyValue}<br>
    <strong>input.getAttribute("value") attribute:</strong> ${attributeValue}<br><br>
    <strong>Explanation:</strong> The property changes when the user types.
    The attribute remains the original HTML value unless changed using setAttribute().
  `;
});

function loadTheme() {
  const savedTheme = localStorage.getItem("domTaskTheme") || "dark";

  body.dataset.theme = savedTheme;
  html.setAttribute("data-theme", savedTheme);

  themeToggle.textContent =
    savedTheme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode";
}

themeToggle.addEventListener("click", function () {
  const currentTheme = body.dataset.theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  body.dataset.theme = nextTheme;
  html.setAttribute("data-theme", nextTheme);
  themeToggle.setAttribute("data-current-theme", nextTheme);
  body.classList.toggle("light-mode", nextTheme === "light");

  themeToggle.textContent =
    nextTheme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode";

  localStorage.setItem("domTaskTheme", nextTheme);
});

grandparent.addEventListener(
  "click",
  function () {
    console.log("Capturing: Grandparent");
  },
  true
);

parentBox.addEventListener(
  "click",
  function () {
    console.log("Capturing: Parent");
  },
  true
);

childBtn.addEventListener(
  "click",
  function () {
    console.log("Capturing: Child");
  },
  true
);

grandparent.addEventListener("click", function () {
  console.log("Bubbling: Grandparent");
});

parentBox.addEventListener("click", function () {
  console.log("Bubbling: Parent");
});

childBtn.addEventListener("click", function () {
  console.log("Bubbling: Child");
});

loadTheme();
renderTasks();