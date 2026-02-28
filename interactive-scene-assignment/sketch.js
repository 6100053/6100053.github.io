// Interactive Scene Assignment
// Carsen Waters
// March 3, 2026
//
// Extras for Experts:
// - Resizing based on window size
// - Objects for organizing information about player, capsule, backdrop, and level nodes (Added before in-class object demo)
// - Additional p5js functions such as rectMode, angleMode, translate, scale, lerp, and push/pop


let level = 0;

let levelStage = {
  playing: false,
  startTime: 0,

  player: {x: 0, y: 0, size: 10, speed: 5, col: 255},
  capsule: {x: 0, y: 0, w: 100, h: 100, border: 5, col: 100},
  backdrop: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 0},
  path: {border: 5, col: 75},

  nodes: {},
  currentNodeIndex: 0,
  lastNodeTime: 0
};

// The points on the path of the capsule through the level
let allNodes = [
  [{x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 0, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 30}},
    {x: 500, y: 0, capsuleW: 100, capsuleH: 100, time: 10000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: "rgb(0, 0, 30)", frontCol: "rgb(0, 0, 60)"}},
    {x: 500, y: -200, capsuleW: 100, capsuleH: 100, time: 14000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 360, backCol: "rgb(0, 0, 30)", frontCol: "rgb(0, 0, 60)"}},
    {x: 200, y: -200, capsuleW: 100, capsuleH: 100, time: 15500, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backCol: "rgb(0, 0, 30)", frontCol: "rgb(0, 0, 60)"}},
    {x: 200, y: -400, capsuleW: 200, capsuleH: 200, time: 20000, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backCol: "rgb(60, 0, 0)", frontCol: "rgb(30, 0, 0)"}},
    {x: 0, y: -200, capsuleW: 200, capsuleH: 200, time: 23000, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backCol: "rgb(60, 0, 0)", frontCol: "rgb(30, 0, 0)"}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 27000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 30}}]
];

let viewSize = 800;
let screenSize;

function setup() {
  screenSize = min(windowWidth, windowHeight);
  createCanvas(screenSize, screenSize);
  rectMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  levelProgress();
  moveCapsule();
  movePlayer();
  
  // Scale the scene so things take up the same space in the window regardless of how big it is
  scale(screenSize / viewSize, screenSize / viewSize);
  
  // Translate the scene so everything is centered on the capsule
  translate(viewSize/2 - levelStage.capsule.x, viewSize/2 - levelStage.capsule.y);
  
  drawBackground();
  drawPaths();
  drawCapsule();
  drawPlayer();
}

function drawBackground() {
  let currentBackdrop = levelStage.backdrop;
  let shapeSpacing = currentBackdrop.spacing;

  background(currentBackdrop.backCol);
  noStroke();
  fill(currentBackdrop.frontCol);
  
  // Draw a grid of shapes, filling the background of the canvas (centered on the capsule)
  for (shapeX = -viewSize/2 + viewSize/2 % (shapeSpacing/2) + floor(levelStage.capsule.x / shapeSpacing) * shapeSpacing; shapeX <= viewSize/2 + ceil(levelStage.capsule.x / shapeSpacing) * shapeSpacing; shapeX += shapeSpacing) {
    for (shapeY = -viewSize/2 + viewSize/2 % (shapeSpacing/2) + floor(levelStage.capsule.y / shapeSpacing) * shapeSpacing; shapeY <= viewSize/2 + ceil(levelStage.capsule.y / shapeSpacing) * shapeSpacing; shapeY += shapeSpacing) {
    
      push();
      translate(shapeX, shapeY);
      rotate(currentBackdrop.angle);

      if (currentBackdrop.shape === "square") {
        square(0, 0, currentBackdrop.size);
      } else if (currentBackdrop.shape === "circle") {
        circle(0, 0, currentBackdrop.size);
      }
      pop();
    }
  }
}

function drawPaths() {
  // Draw the path of the capsule for the current level
  stroke(levelStage.path.col);
  strokeWeight(levelStage.path.border);
  
  let levelLines = allNodes[level];
  
  for (let lineIndex = 0; lineIndex < levelLines.length - 1; lineIndex += 1) {
    let startNode = levelLines[lineIndex];
    let endNode = levelLines[lineIndex + 1];  

    line(startNode.x, startNode.y, endNode.x, endNode.y);
  }
}

function drawCapsule() {
  // Draws the capsule so that the border is entirely on the outside
  let currentCapsule = levelStage.capsule;
  
  noFill();
  stroke(currentCapsule.col);
  strokeWeight(currentCapsule.border);
  rect(currentCapsule.x, currentCapsule.y, currentCapsule.w + currentCapsule.border, currentCapsule.h + currentCapsule.border);
}

function drawPlayer() {
  let currentPlayer = levelStage.player;

  noStroke();
  fill(currentPlayer.col);
  square(currentPlayer.x, currentPlayer.y, currentPlayer.size);
}

function levelProgress() {
  // Gets the current progress through the level and through the paths
  levelStage.nodes = allNodes[level];
  levelStage.currentNodeIndex = 0;
  levelStage.lastNodeTime = levelStage.startTime;
  
  if (levelStage.playing) { 
    for (let nodeIndex = 0; nodeIndex < levelStage.nodes.length; nodeIndex += 1) {

      if (millis() - levelStage.startTime >= levelStage.nodes[nodeIndex].time) {
        levelStage.currentNodeIndex = nodeIndex;
        levelStage.lastNodeTime = levelStage.startTime + levelStage.nodes[nodeIndex].time;

        if (nodeIndex >= levelStage.nodes.length - 1) {
          levelStage.playing = false;
        }
      } else {
        break;
      }

    }
  }
}

function moveCapsule() {
  // Move the capsule along the path, or keep it at the start
  let levelCapsule = levelStage.capsule;
  let levelBackdrop = levelStage.backdrop;

  let currentPath = levelStage.nodes[levelStage.currentNodeIndex];
  let nextPath = levelStage.nodes[levelStage.currentNodeIndex + 1];
  
  if (levelStage.playing) {
    // Time since the last node divided by the time between the last and next node
    let amountBetweenNodes = (millis() - levelStage.lastNodeTime) / (nextPath.time - currentPath.time);

    levelCapsule.x = lerp(currentPath.x, nextPath.x, amountBetweenNodes);
    levelCapsule.y = lerp(currentPath.y, nextPath.y, amountBetweenNodes);
    levelCapsule.w = lerp(currentPath.capsuleW, nextPath.capsuleW, amountBetweenNodes);
    levelCapsule.h = lerp(currentPath.capsuleH, nextPath.capsuleH, amountBetweenNodes);
  
    levelBackdrop.shape = currentPath.backdropData.shape;
    levelBackdrop.spacing = currentPath.backdropData.spacing;
    levelBackdrop.size = lerp(currentPath.backdropData.size, nextPath.backdropData.size, amountBetweenNodes);
    levelBackdrop.angle = lerp(currentPath.backdropData.angle, nextPath.backdropData.angle, amountBetweenNodes);
    levelBackdrop.backCol = lerpColor(color(currentPath.backdropData.backCol), color(nextPath.backdropData.backCol), amountBetweenNodes);
    levelBackdrop.frontCol = lerpColor(color(currentPath.backdropData.frontCol), color(nextPath.backdropData.frontCol), amountBetweenNodes);
    
  } else {
    levelCapsule.x = currentPath.x;
    levelCapsule.y = currentPath.y;
    levelCapsule.w = currentPath.capsuleW;
    levelCapsule.h = currentPath.capsuleH;
    
    levelBackdrop.shape = currentPath.backdropData.shape;
    levelBackdrop.spacing = currentPath.backdropData.spacing;
    levelBackdrop.size = currentPath.backdropData.size;
    levelBackdrop.angle = currentPath.backdropData.angle;
    levelBackdrop.backCol = color(currentPath.backdropData.backCol);
    levelBackdrop.frontCol = color(currentPath.backdropData.frontCol);
  }
}

function movePlayer() {
  let levelPlayer = levelStage.player;
  let currentCapsule = levelStage.capsule;

  if (keyIsDown(39) || keyIsDown(68)) { // Right arrow or D key
    levelPlayer.x += levelPlayer.speed;
  }
  if (keyIsDown(37) || keyIsDown(65)) { // Left arrow or A key
    levelPlayer.x -= levelPlayer.speed;
  }
  if (keyIsDown(40) || keyIsDown(83)) { // Down arrow or S key
    levelPlayer.y += levelPlayer.speed;
  }
  if (keyIsDown(38) || keyIsDown(87)) { // Up arrow or W key
    levelPlayer.y -= levelPlayer.speed;
  }
  
  // Keep the player in the capsule
  levelPlayer.x = constrain(levelPlayer.x, currentCapsule.x - (currentCapsule.w/2 - levelPlayer.size/2), currentCapsule.x + (currentCapsule.w/2 - levelPlayer.size/2));
  levelPlayer.y = constrain(levelPlayer.y, currentCapsule.y - (currentCapsule.h/2 - levelPlayer.size/2), currentCapsule.y + (currentCapsule.h/2 - levelPlayer.size/2));
}

function mousePressed() {
  // Toggle if the level is playing (capsule is moving)
  if (!levelStage.playing) {
    levelStage.playing = true;
    levelStage.startTime = millis();
    
  } else {
    levelStage.playing = false;
    levelStage.player.x = 0;
    levelStage.player.y = 0;
  }
}