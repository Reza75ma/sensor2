document.addEventListener('DOMContentLoaded', function() {
  var videoElement = document.getElementById('videoElement');

  function startDetection() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    // Dynamically set canvas size based on the screen dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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

  // Check if getUserMedia is supported and wait for user interaction
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    document.addEventListener('click', function() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          videoElement.srcObject = stream;
          videoElement.play(); // Start playing the video
          startDetection();
        })
        .catch(function(error) {
          console.error('Error accessing the webcam:', error);
        });
    });
  } else {
    console.error('getUserMedia is not supported by this browser.');
  }
});
