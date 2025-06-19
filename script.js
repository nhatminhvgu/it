let isAuthenticated = false;
let authToken = localStorage.getItem("token");

let timeLeft = 1500;
let timer = null;
let isRunning = false;
let isPaused = false;
let timerPaused = false;

const timerDisplay = document.getElementById("timer");

const timerEndSound = new Audio("sound/(1).mp3");

const API_URL = "http://localhost:3000/api";

async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }

    localStorage.setItem("token", data.token);
    authToken = data.token;
    isAuthenticated = true;

    updateAuthUI();
    closeLogin();
    showToast("Successfully registered!", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function register(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register");
    }

    localStorage.setItem("token", data.token);
    authToken = data.token;
    isAuthenticated = true;

    updateAuthUI();
    closeLogin();
    showToast("Successfully registered!", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

function logout() {
  localStorage.removeItem("token");
  authToken = null;
  isAuthenticated = false;
  updateAuthUI();
  showToast("Log out", "info");
}

function updateAuthUI() {
  const loginBtn = document.querySelector(".header-buttons button:first-child");
  if (isAuthenticated) {
    loginBtn.textContent = "Log out";
    loginBtn.onclick = logout;
  } else {
    loginBtn.textContent = "Login";
    loginBtn.onclick = showLogin;
  }
}

function startTimer() {
  if (isRunning) return;

  if (!isAuthenticated) {
    showToast("Please login before starting the timer !", "error");
    showLogin();
    return;
  }

  isRunning = true;
  isPaused = false;
  timerPaused = false;
  window.isRunning = isRunning;
  window.isPaused = isPaused;
  window.timerPaused = timerPaused;
  startDetection();

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();

      if (isAuthenticated && authToken) {
        saveSession();
      }
    } else {
      completeTimer();
    }
  }, 1000);

  const actionBtn = document.getElementById("actionBtn");
  actionBtn.textContent = "Stopped";
  document.getElementById("status").textContent = "Running";
}

function pauseTimer() {
  if (!isRunning || isPaused) return;

  clearInterval(timer);
  timer = null;
  isPaused = true;
  timerPaused = true;
  window.isPaused = isPaused;
  window.timerPaused = timerPaused;

  const actionBtn = document.getElementById("actionBtn");
  actionBtn.textContent = "Continue";
  document.getElementById("status").textContent = "Stopped";
}

function resumeTimer() {
  if (!isRunning || !isPaused) return;
  isPaused = false;
  timerPaused = false;
  isRunning = false;
  window.isPaused = isPaused;
  window.timerPaused = timerPaused;
  window.isRunning = isRunning;
  const actionBtn = document.getElementById("actionBtn");
  actionBtn.textContent = "Stopped";
  document.getElementById("status").textContent = "Running";
  startTimer();
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = true;
  isPaused = false;
  timerPaused = false;
  window.isPaused = isPaused;
  window.timerPaused = timerPaused;
  window.isRunning = isRunning;

  timeLeft = 1500;
  updateTimerDisplay();

  const actionBtn = document.getElementById("actionBtn");
  actionBtn.textContent = "Start";
  document.getElementById("status").textContent = "Ready to start";
}

function completeTimer() {
  clearInterval(timer);
  timer = null;
  isRunning = false;
  isPaused = false;
  timerPaused = false;
  window.isRunning = isRunning;
  window.isPaused = isPaused;
  window.timerPaused = timerPaused;
  timerEndSound.play();

  const actionBtn = document.getElementById("actionBtn");
  actionBtn.textContent = "Start";
  document.getElementById("status").textContent = "Accomplished";
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  document.getElementById("timer").textContent = display;
}

function handleMainAction() {
  if (!isRunning) {
    if (!isAuthenticated) {
      showToast("Please login before starting the timer", "error");
      showLogin();
      return;
    }
    startTimer();
  } else if (isPaused) {
    resumeTimer();
  } else {
    pauseTimer();
  }
}

async function saveSession() {
  if (!authToken) return;

  try {
    const response = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        duration: 1,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save session");
    }
  } catch (error) {
    console.error("Error saving session:", error);
  }
}

function showLogin() {
  document.getElementById("loginModal").style.display = "flex";
  document.getElementById("authForm").reset();
}

function closeLogin() {
  document.getElementById("loginModal").style.display = "none";
}

function showNotes() {
  document.getElementById("notesModal").style.display = "flex";
  document.getElementById("noteContent").value = "";
}

function closeNotes() {
  document.getElementById("notesModal").style.display = "none";
}

function toggleAuthMode(event) {
  event.preventDefault();
  const form = document.getElementById("authForm");
  const title = document.getElementById("authTitle");
  const submitBtn = document.getElementById("authSubmit").querySelector("span");
  const switchText = document.getElementById("authSwitch");

  if (title.textContent === "Login") {
    title.textContent = "Register";
    submitBtn.textContent = "Register";
    switchText.innerHTML =
      'Already have an account ? <a href="#" onclick="toggleAuthMode(event)">Login</a>';
    form.onsubmit = (e) => handleAuth(e, false);
  } else {
    title.textContent = "Login";
    submitBtn.textContent = "Login";
    switchText.innerHTML =
      'Chưa có tài khoản? <a href="#" onclick="toggleAuthMode(event)">Register now</a>';
    form.onsubmit = (e) => handleAuth(e, true);
  }
}

async function handleAuth(event, isLogin) {
  event.preventDefault();
  const form = event.target;
  const email = form.email.value;
  const password = form.password.value;

  if (isLogin) {
    await login(email, password);
  } else {
    await register(email, password);
  }
}

function saveNoteAs() {
  const content = document.getElementById("noteContent").value;
  if (!content) return;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const a = document.createElement("a");
  a.href = url;
  a.download = `note-${timestamp}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  closeNotes();
  showToast("Note has been saved !", "success");
}

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.getElementById("toastContainer").appendChild(toast);
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

async function checkAuthOnLoad() {
  if (authToken) {
    try {
      const response = await fetch(`${API_URL}/sessions/stats`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem("token");
        authToken = null;
        isAuthenticated = false;
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      localStorage.removeItem("token");
      authToken = null;
      isAuthenticated = false;
    }
  } else {
    isAuthenticated = false;
  }
  updateAuthUI();
}

checkAuthOnLoad();

window.pauseTimer = pauseTimer;
window.resumeTimer = resumeTimer;
window.isRunning = isRunning;
window.isPaused = isPaused;
window.timerPaused = timerPaused;
window.startTimer = startTimer;
window.resetTimer = resetTimer;
window.handleMainAction = handleMainAction;
