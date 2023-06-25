document.addEventListener('DOMContentLoaded', function() {
  var videoElement = document.getElementById('videoElement');
  var startButton = document.getElementById('startButton'); // Add a button element to your HTML with id="startButton"

  // Add click event listener to the start button
  startButton.addEventListener('click', function() {
    // Request camera permission
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          videoElement.srcObject = stream;
          startButton.style.display = 'none'; // Hide the start button
          startDetection();
        })
        .catch(function(error) {
          console.error('Error accessing the webcam:', error);
        });
    } else {
      console.error('getUserMedia is not supported by this browser.');
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
        var circle = circles.data32F;
        var x = circle[0];
        var y = circle[1];
        var radius = circle[2];

        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.lineWidth = 2;
        context.strokeStyle = 'red';
        context.stroke();
      }

      gray.delete();
      circles.delete();
      src.delete();

      requestAnimationFrame(processFrame);
    }

    processFrame();
  }
});
