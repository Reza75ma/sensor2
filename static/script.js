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
    var circleDetected = false;
    var prevcircle = null;

    videoElement.addEventListener('loadedmetadata', function() {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
    });

    function dist(x1, y1, x2, y2) {
      return (x1 - x2) ** 2 + (y1 - y2) ** 2;
    }

    function processFrame() {
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      var src = cv.imread(canvas);
      var gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      var circles = new cv.Mat();
      cv.HoughCircles(gray, circles, cv.HOUGH_GRADIENT, 1.2, 100, 100, 40, 20, 150);

      if (circles.cols > 0 && !circleDetected) {
        var chosen = null;
        for (var i = 0; i < circles.cols; ++i) {
          var circle = circles.data32F;
          var x = circle[i * 3];
          var y = circle[i * 3 + 1];
          var radius = circle[i * 3 + 2];

          // Find the closest circle to the previous circle
          if (chosen === null) {
            chosen = circle;
          }
          if (prevcircle !== null) {
            if (dist(chosen[0], chosen[1], prevcircle[0], prevcircle[1]) <= dist(circle[0], circle[1], prevcircle[0], prevcircle[1])) {
              chosen = circle;
            }
          }

          context.beginPath();
          context.arc(x, y, radius, 0, 2 * Math.PI);
          context.lineWidth = 2;
          context.strokeStyle = 'red';
          context.stroke();
        }

        prevcircle = chosen;
        circleDetected = true;

        // Extract the region of interest (circle) from the frame
        var x = chosen[0];
        var y = chosen[1];
        var radius = chosen[2];
        var roi = context.getImageData(x - radius, y - radius, radius * 2, radius * 2);
        // Use the 'roi' for further processing or analysis
      }

      gray.delete();
      circles.delete();
      src.delete();

      if (!circleDetected) {
        requestAnimationFrame(processFrame);
      }
    }

    processFrame();
  }
});
