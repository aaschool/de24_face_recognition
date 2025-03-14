let detections = [];
let video;
let canvas;
let faceapiLoaded = false;
let bearImage;

function setup() {
  canvas = createCanvas(480, 360);
  canvas.id("canvas");

  video = createCapture(VIDEO);// Create the video: 
  video.id("video");
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5
  };

  // Initialize faceapi
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function faceReady() {
  faceapi.detect(gotFaces); // Start detecting faces:
}

// Got faces: 
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result;

  clear(); // Draw transparent background
  drawBoxs(detections); // Draw detection box
  drawLandmarks(detections); // Draw all the face points
  drawExpressions(detections, 20, 250, 14); // Draw face expression

  // Check if happiness is above 80% to load bear.jpg
  if (detections.length > 0 && detections[0].expressions.happy > 0.8) {
    if (!bearImage) {
      bearImage = loadImage('bear.jpeg', () => {
        image(bearImage, 10, 10, width, height);
      });
    } else {
      image(bearImage, 0, 0, width, height);
    }
  }

  // Call the function again
  faceapi.detect(gotFaces);
}

function drawBoxs(detections) {
  if (detections.length > 0) {
    for (f = 0; f < detections.length; f++) {
      let { _x, _y, _width, _height } = detections[f].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections) {
  if (detections.length > 0) {
    for (f = 0; f < detections.length; f++) {
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace) {
  if (detections.length > 0) {
    let { neutral, happy, angry, sad, disgusted, surprised, fearful } = detections[0].expressions;
    textFont('Helvetica Neue');
    textSize(14);
    noStroke();
    fill(44, 169, 225);

    text("neutral:       " + nf(neutral * 100, 2, 2) + "%", x, y);
    text("happiness: " + nf(happy * 100, 2, 2) + "%", x, y + textYSpace);
    text("anger:      " + nf(angry * 100, 2, 2) + "%", x, y + textYSpace * 2);
    text("sad:            " + nf(sad * 100, 2, 2) + "%", x, y + textYSpace * 3);
    text("disgusted: " + nf(disgusted * 100, 2, 2) + "%", x, y + textYSpace * 4);
    text("surprised:  " + nf(surprised * 100, 2, 2) + "%", x, y + textYSpace * 5);
    text("fear:           " + nf(fearful * 100, 2, 2) + "%", x, y + textYSpace * 6);
  } else {
    text("neutral: ", x, y);
    text("happiness: ", x, y + textYSpace);
    text("anger: ", x, y + textYSpace * 2);
    text("sad: ", x, y + textYSpace * 3);
    text("disgusted: ", x, y + textYSpace * 4);
    text("surprised: ", x, y + textYSpace * 5);
    text("fear: ", x, y + textYSpace * 6);
  }
}
