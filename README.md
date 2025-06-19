# Pomodoro Focus

## Introduction

**Pomodoro Focus** is a web application that helps you stay productive using the Pomodoro technique, enhanced with AI-powered presence detection via your webcam. The app supports time management, progress tracking, and note-taking.

---

## File Descriptions

- **index.html**  
  The main UI of the web app. It displays the Pomodoro timer, camera/model status, work progress, statistics, login and note modals.

- **style.css**  
  The CSS stylesheet for the application's layout and appearance.

- **script.js**  
  Handles the Pomodoro timer logic, UI state management, user authentication, notes, and event handling.

- **camera.js**  
  Manages webcam initialization and stopping, integrates the AI model to detect the user's presence, and automatically pauses or resumes the timer based on detection.

- **detection.js**  
  Loads the AI model from Teachable Machine, processes webcam images for presence detection, updates UI status, and triggers timer pause/resume or alert sounds.

- **.env**  
  Environment configuration for the backend (if used), containing variables like PORT, JWT_SECRET, and MONGODB_URI.

- **package.json**  
  Manages project dependencies and Node.js configuration.

- **package-lock.json**  
  Locks exact package versions for consistent installs.

---

## How to Run the Project

### 1. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) (>= 18) installed.

From your project folder, install dependencies:

```bash
npm install
```

### 2. Configure Environment Variables

- Copy or edit the `.env` file:
  - `PORT`: The server port (default is 3000)
  - `JWT_SECRET`: Secret key for JWT authentication
  - `MONGODB_URI`: MongoDB connection string (default uses local MongoDB)

### 3. Start the Server (if using backend)

```bash
node script.js
```

Or, add a `start` script in `package.json` for easier running.

### 4. Run the Web UI

- You can open `index.html` directly in your browser (for frontend only).
- If using the backend, make sure the Node.js server is running, then visit `http://localhost:3000` (or your configured PORT) in your browser.

---

## Notes

- The application uses an AI model from Teachable Machine to detect the user's presence via webcam. You must grant camera access in your browser.
- Security: Do not share the `.env` file publicly, especially sensitive information like `JWT_SECRET`.

---

## Contribution

For suggestions, bug reports, or feature requests, please open an issue or pull request on the project's GitHub repository.

---
