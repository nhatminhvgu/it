// URL của model từ Teachable Machine Export Panel
const URL = "https://teachablemachine.withgoogle.com/models/XNBWt3vTF/";

let model, webcam, labelContainer, maxPredictions;
let isModelReady = false;
let modelStatus = document.querySelector(".model-status");

// Load and setup
async function init() {
  try {
    if (modelStatus) modelStatus.textContent = "downloading model...";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();

    const webcamContainer = document.querySelector(".camera-container");
    webcamContainer.appendChild(webcam.canvas);

    isModelReady = true;
    if (modelStatus) modelStatus.textContent = "Model is ready";
  } catch (error) {
    console.error("glitch in starting model:", error);
    if (modelStatus) modelStatus.textContent = "glicth in starting model";
  }
}

window.addEventListener("load", init);

async function predict() {
  if (!isModelReady) {
    console.log("Model ois not ready ");
    return;
  }
  const prediction = await model.predict(webcam.canvas);
  let maxClass = prediction[0];
  for (let p of prediction) {
    if (p.probability > maxClass.probability) {
      maxClass = p;
    }
  }

  console.log("Detected class:", maxClass.className);

  const isPersonPresent = maxClass.className == "no person";
  console.log(isPersonPresent);

  if (isPersonPresent && window.isRunning) {
    window.pauseTimer();
    window.timerEndSound.play();
  }
  // check and update the status
  const detectionStatus = document.querySelector(".detection-status");
  if (detectionStatus) {
    if (!isPersonPresent) {
      detectionStatus.textContent = `detected: ${maxClass.className}`;
      detectionStatus.classList.add("active");
      detectionStatus.classList.remove("inactive", "no-person");
      detectionStatus.style.backgroundColor = "#22c55e";
    }
  }
}

function startDetection() {
  if (!isModelReady) {
    console.log("Model is not ready yet");
    return;
  }

  webcam.play();
  const cameraStatus = document.querySelector(".camera-status");
  if (cameraStatus) {
    cameraStatus.textContent = "Camera is working";
    cameraStatus.classList.add("active");
    cameraStatus.classList.remove("inactive");
  }

  // start detect
  const detectionStatus = document.querySelector(".detection-status");
  if (detectionStatus) {
    detectionStatus.textContent = "working on process...";
    detectionStatus.classList.remove("active", "inactive");
  }

  window.requestAnimationFrame(loop);
}

function stopDetection() {
  webcam.stop();
  const cameraStatus = document.querySelector(".camera-status");
  const detectionStatus = document.querySelector(".detection-status");

  if (cameraStatus) {
    cameraStatus.textContent = "Camera is off";
    cameraStatus.classList.remove("active");
    cameraStatus.classList.add("inactive");
  }

  if (detectionStatus) {
    detectionStatus.textContent = "undetectected";
    detectionStatus.classList.remove("active");
    detectionStatus.classList.add("inactive");
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}
