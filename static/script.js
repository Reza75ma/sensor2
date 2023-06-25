document.addEventListener('DOMContentLoaded', function() {
  var videoElement = document.getElementById('videoElement');

  // Get user media (camera) on page load
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
      videoElement.play(); // Start playing the video
      startDetection();
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  });

  function startDetection() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    videoElement.addEventListener('loadedmetadata', function() {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
    });

    function processFrame() {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      var src = cv.imread(canvas);
      var gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      var circles = new cv.Mat();
      cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT, 1, 100, 50, 30, 10, 100);

      if (circles.cols > 0) {
        for (var i = 0; i < circles.cols; ++i) {
          var circle = circles.data32F;
          var x = circle[i * 3];
          var y = circle[i * 3 + 1];
          var radius = circle[i * 3 + 2];

          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.lineWidth = 2;
          context.strokeStyle = 'red';
          context.stroke();
        }
      }

      gray.delete();
      circles.delete();
      src.delete();

      requestAnimationFrame(processFrame);
    }

    processFrame();
  }
});
