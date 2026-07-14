"use strict";

const STORAGE = {
  todos: "productivity-todos",
  planner: "productivity-planner",
  goals: "productivity-goals",
  theme: "productivity-theme",
  sessions: "productivity-focus-sessions"
};

const FEATURES = {
  todoFeature: ["Todo List", "Create, prioritize, complete, and delete tasks."],
  plannerFeature: ["Daily Planner", "Assign tasks and notes to hourly time slots."],
  quoteFeature: ["Motivation Quote", "Fetch motivational quotes with loading and fallback handling."],
  pomodoroFeature: ["Pomodoro Timer", "Run focused sessions using setInterval and clearInterval."],
  weatherFeature: ["Weather Widget", "Search live weather by city or use your current location."],
  goalsFeature: ["Daily Goals", "Create goals and track their completion progress."]
};

const FALLBACK_QUOTES = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" }
];

const WEATHER_CODES = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"], 45: ["Fog", "🌫️"], 48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Dense drizzle", "🌧️"],
  61: ["Slight rain", "🌦️"], 63: ["Moderate rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  71: ["Slight snow", "🌨️"], 73: ["Snow", "🌨️"], 75: ["Heavy snow", "❄️"],
  80: ["Rain showers", "🌦️"], 81: ["Moderate showers", "🌧️"], 82: ["Heavy showers", "⛈️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm with hail", "⛈️"], 99: ["Heavy thunderstorm", "⛈️"]
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function load(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let todos = load(STORAGE.todos, []);
let planner = load(STORAGE.planner, {});
let goals = load(STORAGE.goals, []);
let sessions = load(STORAGE.sessions, {});

let timerInterval = null;
let timerDuration = 25 * 60;
let timerRemaining = timerDuration;
let timerLabel = "Work Session";
let quote = FALLBACK_QUOTES[0];
let toastTimer = null;

let weather = {
  location: "New Delhi",
  temperature: "--",
  condition: "Loading...",
  humidity: "--",
  wind: "--",
  feels: "--",
  precipitation: "--",
  icon: "☁️"
};

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function dateKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function updateClock() {
  const now = new Date();
  const hour = now.getHours();

  $("#currentDate").textContent = new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(now);

  $("#currentTime").textContent = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
  }).format(now);

  let period = "night";
  let greeting = "Good night";

  if (hour >= 5 && hour < 12) {
    period = "morning";
    greeting = "Good morning";
  } else if (hour >= 12 && hour < 17) {
    period = "afternoon";
    greeting = "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    period = "evening";
    greeting = "Good evening";
  }

  document.body.classList.remove("morning", "afternoon", "evening", "night");
  document.body.classList.add(period);
  $("#greeting").textContent = greeting;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("#themeIcon").textContent = theme === "dark" ? "☀️" : "🌙";
  $("#themeText").textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}

$("#themeToggle").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(STORAGE.theme, next);
});

function openFeature(id) {
  const panel = document.getElementById(id);
  if (!panel || !FEATURES[id]) return;

  $$(".feature-panel").forEach(section => section.classList.remove("active"));
  panel.classList.add("active");

  $("#featureTitle").textContent = FEATURES[id][0];
  $("#featureDescription").textContent = FEATURES[id][1];
  $("#dashboardView").classList.remove("active");
  $("#featureView").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function backToDashboard() {
  $("#featureView").classList.remove("active");
  $("#dashboardView").classList.add("active");
  updateStats();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$(".feature-card").forEach(card => {
  card.addEventListener("click", () => openFeature(card.dataset.feature));
});
$("#backButton").addEventListener("click", backToDashboard);

function renderTodos() {
  const list = $("#todoList");
  list.innerHTML = "";

  const ordered = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
    if (a.important !== b.important) return Number(b.important) - Number(a.important);
    return b.createdAt - a.createdAt;
  });

  const fragment = document.createDocumentFragment();

  ordered.forEach(todo => {
    const item = document.createElement("li");
    item.className = `list-item${todo.completed ? " completed" : ""}${todo.important ? " important" : ""}`;
    item.dataset.id = todo.id;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = todo.completed;
    check.className = "item-check";
    check.dataset.action = "toggle";

    const content = document.createElement("div");
    const text = document.createElement("p");
    text.className = "item-text";
    text.textContent = todo.text;

    const meta = document.createElement("small");
    meta.className = "item-meta";
    meta.textContent = todo.important ? "Important task" : "Standard task";
    content.append(text, meta);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const important = document.createElement("button");
    important.type = "button";
    important.className = "item-action";
    important.dataset.action = "important";
    important.textContent = todo.important ? "★" : "☆";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "item-action delete";
    remove.dataset.action = "delete";
    remove.textContent = "×";

    actions.append(important, remove);
    item.append(check, content, actions);
    fragment.append(item);
  });

  list.append(fragment);

  const completed = todos.filter(todo => todo.completed).length;
  const percentage = todos.length ? Math.round(completed / todos.length * 100) : 0;

  $("#todoEmpty").style.display = todos.length ? "none" : "block";
  $("#todoProgressText").textContent = `${completed} of ${todos.length} completed`;
  $("#todoProgressBar").style.width = `${percentage}%`;
  updateStats();
}

$("#todoForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#todoInput");
  const text = input.value.trim();

  if (!text) {
    $("#todoError").textContent = "Enter a task before adding it.";
    return;
  }

  $("#todoError").textContent = "";
  todos.push({ id: createId("todo"), text, important: false, completed: false, createdAt: Date.now() });
  save(STORAGE.todos, todos);
  input.value = "";
  renderTodos();
});

$("#todoList").addEventListener("click", event => {
  const item = event.target.closest(".list-item");
  const action = event.target.dataset.action;
  if (!item || !action) return;

  const todo = todos.find(entry => entry.id === item.dataset.id);
  if (!todo) return;

  if (action === "toggle") todo.completed = event.target.checked;
  if (action === "important") todo.important = !todo.important;
  if (action === "delete") todos = todos.filter(entry => entry.id !== todo.id);

  save(STORAGE.todos, todos);
  renderTodos();
});

$("#clearCompletedTodos").addEventListener("click", () => {
  todos = todos.filter(todo => !todo.completed);
  save(STORAGE.todos, todos);
  renderTodos();
});

const plannerHours = Array.from({ length: 15 }, (_, index) => index + 7);

function formatHour(hour) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
}

function renderPlanner() {
  const list = $("#plannerList");
  list.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const currentHour = new Date().getHours();

  plannerHours.forEach(hour => {
    const slot = document.createElement("div");
    slot.className = `planner-slot${hour === currentHour ? " current" : ""}`;
    slot.dataset.hour = String(hour);

    const label = document.createElement("strong");
    label.textContent = formatHour(hour);

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 120;
    input.placeholder = "Add a task or note...";
    input.value = planner[hour] || "";
    input.dataset.hour = String(hour);

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "slot-clear";
    clear.dataset.action = "clear";
    clear.textContent = "×";

    slot.append(label, input, clear);
    fragment.append(slot);
  });

  list.append(fragment);
}

$("#plannerList").addEventListener("input", event => {
  if (!event.target.matches("input[data-hour]")) return;
  const hour = event.target.dataset.hour;
  const value = event.target.value;

  if (value.trim()) planner[hour] = value;
  else delete planner[hour];

  save(STORAGE.planner, planner);
  updateStats();
});

$("#plannerList").addEventListener("click", event => {
  if (event.target.dataset.action !== "clear") return;
  const slot = event.target.closest(".planner-slot");
  delete planner[slot.dataset.hour];
  save(STORAGE.planner, planner);
  renderPlanner();
  updateStats();
});

$("#clearPlanner").addEventListener("click", () => {
  if (!confirm("Clear all planner entries?")) return;
  planner = {};
  save(STORAGE.planner, planner);
  renderPlanner();
  updateStats();
});

function renderGoals() {
  const list = $("#goalList");
  list.innerHTML = "";
  const fragment = document.createDocumentFragment();

  goals.forEach(goal => {
    const item = document.createElement("li");
    item.className = `list-item${goal.completed ? " completed" : ""}`;
    item.dataset.id = goal.id;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = goal.completed;
    check.className = "item-check";
    check.dataset.action = "toggle";

    const content = document.createElement("div");
    const text = document.createElement("p");
    text.className = "item-text";
    text.textContent = goal.text;

    const meta = document.createElement("small");
    meta.className = "item-meta";
    meta.textContent = goal.completed ? "Completed" : "Pending";
    content.append(text, meta);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "item-action delete";
    remove.dataset.action = "delete";
    remove.textContent = "×";

    actions.append(remove);
    item.append(check, content, actions);
    fragment.append(item);
  });

  list.append(fragment);

  const completed = goals.filter(goal => goal.completed).length;
  const percentage = goals.length ? Math.round(completed / goals.length * 100) : 0;

  $("#goalEmpty").style.display = goals.length ? "none" : "block";
  $("#goalPercent").textContent = `${percentage}%`;
  $("#goalProgressText").textContent = `${completed} of ${goals.length} completed`;
  $("#goalCircle").style.setProperty("--progress", `${percentage * 3.6}deg`);
  updateStats();
}

$("#goalForm").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#goalInput");
  const text = input.value.trim();

  if (!text) {
    $("#goalError").textContent = "Enter a goal before adding it.";
    return;
  }

  $("#goalError").textContent = "";
  goals.push({ id: createId("goal"), text, completed: false, createdAt: Date.now() });
  save(STORAGE.goals, goals);
  input.value = "";
  renderGoals();
});

$("#goalList").addEventListener("click", event => {
  const item = event.target.closest(".list-item");
  const action = event.target.dataset.action;
  if (!item || !action) return;

  const goal = goals.find(entry => entry.id === item.dataset.id);
  if (!goal) return;

  if (action === "toggle") goal.completed = event.target.checked;
  if (action === "delete") goals = goals.filter(entry => entry.id !== goal.id);

  save(STORAGE.goals, goals);
  renderGoals();
});

$("#clearCompletedGoals").addEventListener("click", () => {
  goals = goals.filter(goal => !goal.completed);
  save(STORAGE.goals, goals);
  renderGoals();
});

function formatTimer(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function updateTimerUI() {
  const formatted = formatTimer(timerRemaining);
  $("#timerDisplay").textContent = formatted;
  $("#timerCardStat").textContent = formatted;
  $("#sessionLabel").textContent = timerLabel;
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

$("#startTimer").addEventListener("click", () => {
  if (timerInterval !== null) {
    $("#timerStatus").textContent = "Timer is already running.";
    return;
  }

  $("#timerStatus").textContent = `${timerLabel} running.`;

  timerInterval = setInterval(() => {
    timerRemaining -= 1;
    updateTimerUI();

    if (timerRemaining <= 0) {
      stopTimer();
      timerRemaining = 0;
      updateTimerUI();

      if (timerLabel === "Work Session") {
        const today = dateKey();
        sessions[today] = (sessions[today] || 0) + 1;
        save(STORAGE.sessions, sessions);
        updateStats();
      }

      $("#timerStatus").textContent = `${timerLabel} finished.`;
      alert(`${timerLabel} finished.`);
    }
  }, 1000);
});

$("#pauseTimer").addEventListener("click", () => {
  if (timerInterval === null) {
    $("#timerStatus").textContent = "Timer is not running.";
    return;
  }

  stopTimer();
  $("#timerStatus").textContent = "Timer paused.";
});

$("#resetTimer").addEventListener("click", () => {
  stopTimer();
  timerRemaining = timerDuration;
  $("#timerStatus").textContent = "Timer reset.";
  updateTimerUI();
});

$$(".preset").forEach(button => {
  button.addEventListener("click", () => {
    stopTimer();
    $$(".preset").forEach(item => item.classList.remove("active"));
    button.classList.add("active");

    timerDuration = Number(button.dataset.minutes) * 60;
    timerRemaining = timerDuration;
    timerLabel = button.dataset.label;
    $("#timerStatus").textContent = `${timerLabel} selected.`;
    updateTimerUI();
  });
});

function syncQuote() {
  $("#dashboardQuote").textContent = quote.quote;
  $("#dashboardQuoteAuthor").textContent = `— ${quote.author}`;
  $("#featureQuote").textContent = quote.quote;
  $("#featureQuoteAuthor").textContent = `— ${quote.author}`;
}

async function fetchQuote() {
  $("#quoteStatus").textContent = "Loading a new quote...";
  $("#dashboardQuoteBtn").disabled = true;
  $("#featureQuoteBtn").disabled = true;

  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) throw new Error("Quote request failed.");

    const data = await response.json();
    if (!data.quote || !data.author) throw new Error("Invalid quote response.");

    quote = { quote: data.quote, author: data.author };
    $("#quoteStatus").textContent = "Quote loaded from the API.";
  } catch {
    quote = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
    $("#quoteStatus").textContent = "API unavailable. Showing a local fallback quote.";
  } finally {
    $("#dashboardQuoteBtn").disabled = false;
    $("#featureQuoteBtn").disabled = false;
    syncQuote();
  }
}

$("#dashboardQuoteBtn").addEventListener("click", fetchQuote);
$("#featureQuoteBtn").addEventListener("click", fetchQuote);

function syncWeather() {
  $("#dashboardWeatherLocation").textContent = weather.location;
  $("#dashboardWeatherIcon").textContent = weather.icon;
  $("#dashboardWeatherTemp").textContent = `${weather.temperature}°C`;
  $("#dashboardWeatherCondition").textContent = weather.condition;
  $("#dashboardHumidity").textContent = `${weather.humidity}%`;
  $("#dashboardWind").textContent = `${weather.wind} km/h`;
  $("#dashboardFeels").textContent = `${weather.feels}°C`;
  $("#weatherCardStat").textContent = `${weather.temperature}°C`;

  $("#featureWeatherLocation").textContent = weather.location;
  $("#featureWeatherIcon").textContent = weather.icon;
  $("#featureWeatherTemp").textContent = `${weather.temperature}°C`;
  $("#featureWeatherCondition").textContent = weather.condition;
  $("#featureHumidity").textContent = `${weather.humidity}%`;
  $("#featureWind").textContent = `${weather.wind} km/h`;
  $("#featureFeels").textContent = `${weather.feels}°C`;
  $("#featurePrecipitation").textContent = `${weather.precipitation} mm`;
}

async function fetchWeatherByCoordinates(latitude, longitude, locationName) {
  $("#weatherStatus").textContent = "Loading weather...";
  $("#weatherError").textContent = "";

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto";

    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather request failed.");

    const data = await response.json();
    const current = data.current;
    const condition = WEATHER_CODES[current.weather_code] || ["Current conditions", "🌤️"];

    weather = {
      location: locationName,
      temperature: Math.round(current.temperature_2m),
      condition: condition[0],
      humidity: Math.round(current.relative_humidity_2m),
      wind: Math.round(current.wind_speed_10m),
      feels: Math.round(current.apparent_temperature),
      precipitation: current.precipitation,
      icon: condition[1]
    };

    syncWeather();
    $("#weatherStatus").textContent = "Live weather updated.";
  } catch {
    $("#weatherStatus").textContent = "Weather service unavailable. Try again.";
  }
}

async function searchCity(city) {
  $("#weatherStatus").textContent = "Searching for city...";

  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    if (!response.ok) throw new Error("City search failed.");
    const data = await response.json();
    const result = data.results?.[0];

    if (!result) {
      $("#weatherError").textContent = "City not found.";
      return;
    }

    const name = `${result.name}${result.admin1 ? `, ${result.admin1}` : ""}`;
    await fetchWeatherByCoordinates(result.latitude, result.longitude, name);
  } catch {
    $("#weatherError").textContent = "Unable to search this city.";
  }
}

$("#weatherForm").addEventListener("submit", event => {
  event.preventDefault();
  const city = $("#cityInput").value.trim();

  if (!city) {
    $("#weatherError").textContent = "Enter a city name.";
    return;
  }

  searchCity(city);
});

$("#currentLocationBtn").addEventListener("click", () => {
  $("#weatherStatus").textContent = "Requesting location permission...";

  if (!navigator.geolocation) {
    $("#weatherStatus").textContent = "Geolocation is not supported.";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      fetchWeatherByCoordinates(
        position.coords.latitude,
        position.coords.longitude,
        "Current Location"
      );
    },
    () => {
      $("#weatherStatus").textContent = "Location denied. Search by city instead.";
    },
    { timeout: 10000, maximumAge: 600000 }
  );
});

function updateStats() {
  const pendingTasks = todos.filter(todo => !todo.completed).length;
  const plannerEntries = Object.values(planner).filter(value => String(value).trim()).length;
  const completedGoals = goals.filter(goal => goal.completed).length;
  const goalPercent = goals.length ? Math.round(completedGoals / goals.length * 100) : 0;
  const todaySessions = sessions[dateKey()] || 0;

  $("#summaryTasks").textContent = pendingTasks;
  $("#summaryPlanner").textContent = plannerEntries;
  $("#summaryGoals").textContent = `${goalPercent}%`;
  $("#summarySessions").textContent = todaySessions;

  $("#todoCardStat").textContent = `${pendingTasks} pending`;
  $("#plannerCardStat").textContent = `${plannerEntries} planned`;
  $("#goalsCardStat").textContent = `${goalPercent}% complete`;
  $("#focusSessionCount").textContent = todaySessions;
}

function initialize() {
  applyTheme(localStorage.getItem(STORAGE.theme) || "dark");
  updateClock();
  setInterval(updateClock, 1000);

  renderTodos();
  renderPlanner();
  renderGoals();
  updateTimerUI();
  updateStats();
  syncQuote();
  syncWeather();

  fetchQuote();
  searchCity("New Delhi");
}

initialize();
