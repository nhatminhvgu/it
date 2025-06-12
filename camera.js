// Camera handling
let cameraStream = null;

async function initializeCamera() {
  const video = document.getElementById("webcam");
  const badge = document.querySelector(".camera-container .badge");

  try {
    // Request camera with specific constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 320 },
        height: { ideal: 240 },
        facingMode: "user",
        frameRate: { ideal: 30 },
      },
    });

    video.srcObject = stream;
    cameraStream = stream;

    // Make sure video plays
    await video.play();

    // Update badge status
    badge.textContent = "Camerais working";
    badge.style.backgroundColor = "#10b981";

    return true;
  } catch (err) {
    console.error("Camera error:", err);
    badge.textContent = "error in camera";
    badge.style.backgroundColor = "#ef4444";
    return false;
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;

    const video = document.getElementById("webcam");
    video.srcObject = null;

    const badge = document.querySelector(".camera-container .badge");
    badge.textContent = "Camera is off";
    badge.style.backgroundColor = "#6b7280";
  }
}

// Model integration
let model;
let webcam;
let canvas;
let ctx;
let modelStatus;
let predictionInterval;
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/XNBWt3vTF/";

async function initModel() {
  const modelURL = MODEL_URL + "model.json";
  const metadataURL = MODEL_URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
}

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    canvas = document.getElementById("webcam-canvas");
    ctx = canvas.getContext("2d");

    //setup webcam
    webcam = new tmImage.Webcam(400, 400, true);
    await webcam.setup({ deviceId: stream.getVideoTracks()[0].getDeviceId() });
    await webcam.play();

    canvas.width = webcam.canvas.width;
    canvas.height = webcam.canvas.height;

    document.querySelector(".badge").textContent = "Camera is working";
    document.querySelector(".badge").style.background = "#10b981";

    // Start prediction loop
    startPrediction();
  } catch (error) {
    console.error("Error accessing camera:", error);
    document.querySelector(".badge").textContent = "error in camera";
    document.querySelector(".badge").style.background = "#ef4444";
  }
}

async function startPrediction() {
  if (!model) {
    try {
      await initModel();
      document.querySelector(".model-status").textContent = "Model is ready";
      document.querySelector(".model-status").style.background = "#10b981";
    } catch (error) {
      console.error("Error loading model:", error);
      document.querySelector(".model-status").textContent = "Lỗi model";
      document.querySelector(".model-status").style.background = "#ef4444";
      return;
    }
  }

  predictionInterval = setInterval(async () => {
    ctx.drawImage(webcam.canvas, 0, 0);

    const prediction = await model.predict(webcam.canvas);

    // prediction[0] is "person", prediction[1] is "no person"
    const isPerson = prediction[0].probability > prediction[1].probability;

    if (isPerson) {
      if (window.timerPaused) {
        window.resumeTimer();
      }
    } else {
      if (!window.timerPaused) {
        window.pauseTimer();
        playAlert();
      }
    }
  }, 1500); // Check every 1,5s
}

function stopCamera() {
  if (webcam) {
    webcam.stop();
  }
  if (predictionInterval) {
    clearInterval(predictionInterval);
  }
  document.querySelector(".badge").textContent = "Camera is off";
  document.querySelector(".badge").style.background = "#6b7280";
  document.querySelector(".model-status").textContent = "Model is stopped";
  document.querySelector(".model-status").style.background = "#6b7280";
}

function playAlert() {
  const audio = new Audio("sound/(1).mp3");
  audio.play();
}
