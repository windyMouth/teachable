const URL = "./";


let model, capture, topPrediction, numClasses, poseData, context;
let videoWidth = 480;
let videoHeight = 360;


async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmPose.load(modelURL, metadataURL);
  numClasses = model.getTotalClasses();
}

async function predict() {
  const {
    pose,
    posenetOutput
  } = await model.estimatePose(capture.elt);

  const predictions = await model.predict(posenetOutput);
  let highestProbability = 0;
  let highestIndex;
  predictions.forEach((item, index) => {
    if (item.probability > highestProbability) {
      highestProbability = item.probability;
      highestIndex = index;
    }
  })

  poseData = pose;
  topPrediction = predictions[highestIndex].className;

}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  context = canvas.elt.getContext('2d');
  capture = createCapture(VIDEO);
  capture.size(videoWidth, videoHeight);
  capture.hide();
  textSize(20);
  

  init();
}
let time= 0;
async function draw() {
  background(20,20,20,0);

  imageMode(CORNER);
  push();
  translate(videoWidth, 0);
  scale(-1, 1);
  image(capture, 0, 0, videoWidth, videoHeight);
  if (poseData) {
   const minPartConfidence = 0.5;
      tmPose.drawKeypoints(poseData.keypoints, minPartConfidence, context);
      tmPose.drawSkeleton(poseData.keypoints, minPartConfidence, context); 
  }
  pop();
  
  /************************
    Add class logic here
  ************************/
  strokeWeight(4);
  stroke(0);
  fill(255);
  text(topPrediction, 20, 30);
  let x = noise(0,time)*width;
  let y = noise(time)*height;
 
  if(topPrediction=="Class 3"){
    flower(x,y,0,153,153);
  }
  else if(topPrediction=="Class 5"){
    flower(x,y,120,120,100);
  }
  else if(topPrediction=="Class 7"){
    flower(x,y,51,255,153);

  }
  else if(topPrediction=="Class 9"){
  
  }
 time = time+0.01;
 
  await predict();
}


function flower(x,y,r,g,b){
  push();
  translate(x,y);
  fill(r,g,b)
    stroke(255);
    strokeWeight(1);
    for (let i = 0; i < 10; i ++) {
      ellipse(0, 30, 20, 80);
      rotate(PI/5);
      
    }
      pop();
      
    
          
    
  }