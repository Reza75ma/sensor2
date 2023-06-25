// HTML elements
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const context = canvasElement.getContext('2d');

// Get user media (camera) on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
});

// Draw video frames on canvas
function drawFrame() {
  context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  requestAnimationFrame(drawFrame);
}

// Start drawing frames when video is playing
videoElement.addEventListener('play', () => {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  drawFrame();
});
