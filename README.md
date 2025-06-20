# Pomodoro Focus

## Introduction

**Pomodoro Focus** is a web application that helps you stay productive using the Pomodoro technique, enhanced with AI-powered presence detection via webcam. The app supports time management, progress tracking, and note-taking.

## Key Features

- **AI-Powered Focus Tracking**: Automatically pauses timer when user leaves webcam view.
- **Pomodoro Timer**: 25minutes focus sessions with customizable breaks.
- **Progress Tracking**: Monitor your daily, weekly, monthly, and yearly focus time.
- **Note Taking**: Built-in note functionality for task management.
- **User Authentication**: Secure login system for personal progress tracking.
- **Alert System**: Audio alerts when user presence is not detected.

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **AI Model**: TensorFlow.js with Teachable Machine
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MongoDB
- **Backend**: Node.js with Express

## File Descriptions

- **index.html**  
  The main UI of the web app. It displays the Pomodoro timer, camera and real-time model status, work progress, statistics, login and note modals.

- **style.css**  
  The CSS stylesheet for the application's layout and appearance.

- **script.js**  
  Handles the Pomodoro timer logic, UI state management, user authentication, notes, and event handling.

- **camera.js**  
  Manages webcam initialization and stopping, integrates the AI model to detect the user's presence, and automatically pauses or resumes the timer based on detection.

- **detection.js**  
  Loads the AI model from Teachable Machine, processes webcam images for presence detection, updates UI status, and triggers timer pause/resume or alert sounds.

- **sound/(1).mp3**  
  Audio alert file played when timer acrossing 25 minutes

- **.env**  
  Environment configuration for the backend, containing variables like PORT, JWT_SECRET, and MONGODB_URI.

- **package.json**  
  Manages project dependencies and Node.js configuration.

- **package-lock.json**  
  Locks exact package versions for consistent installs.

---

## How to Run the Project

### Frontend Only (Quickstart)

1. Clone the repository.
2. Open `index.html` directly in your browser.
3. Grant camera permissions when prompted.

### Fullstack Deployment

#### 1. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) (>= 18) installed.

From your project folder, install dependencies:

```bash
npm install
```

#### 2. Configure Environment Variables

- Copy or edit the `.env` file:
  - `PORT`: The server port (default is 3000)
  - `JWT_SECRET`: Secret key for JWT authentication
  - `MONGODB_URI`: MongoDB connection string (default uses local MongoDB)

#### 3. Start the Server

```bash
node server.js
```

Or, add a `start` script in `package.json` for easier running.

#### 4. Run the Web UI

- Visit `http://localhost:3000` (or your configured PORT) in your browser.

---

## Browser Requirements

- Modern browser with webcam support
- JavaScript enabled
- Recommended browsers: Chrome, Firefox, Edge

## Notes

- The application uses an AI model from Teachable Machine to detect the user's presence via webcam. You must grant camera access in your browser.

## Contribution

For suggestions, bug reports, or feature requests, please open an issue or pull request on the project's GitHub repository.

---
