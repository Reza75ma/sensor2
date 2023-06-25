// HTML elements
const videoElement = document.getElementById('video');

// Get user media (camera) on page load
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.play(); // Start playing the video
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
});
