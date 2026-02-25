// Interactive Scene Assignment
// Carsen Waters
// March 3, 2026
//
// Extras for Experts:
// - Resizing based on window size
// - Objects for organizing information about player, capsule, backdrop, and level paths
// - Additional p5js functions such as rectMode, angleMode, translate, scale, lerp, and push/pop

let player = {x: 0, y: 0, size: 10, speed: 5, col: 255};

let capsule = {x: 0, y: 0, w: 100, h: 100, border: 5, col: 100};

let backdrop = {shape: "square", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 0};

let pathBorder = 5;

let level = 0;

let playingLevel = false;
let levelStartTime = 0;

let levelPaths;
let currentNodeIndex;
let lastNodeTime;

// [PLACEHOLDER]
let paths = [
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
  translate(viewSize/2 - capsule.x, viewSize/2 - capsule.y);
  
  drawBackground();
  drawPaths();
  drawCapsule();
  drawPlayer();
}

function drawBackground() {
  background(backdrop.backCol);
  noStroke();
  fill(backdrop.frontCol);
  
  // Draw a grid of shapes, filling the background of the canvas (centered on the capsule)
  for (shapeX = -viewSize/2 + viewSize/2 % (backdrop.spacing/2) + floor(capsule.x / backdrop.spacing) * backdrop.spacing; shapeX <= viewSize/2 + ceil(capsule.x / backdrop.spacing) * backdrop.spacing; shapeX += backdrop.spacing) {
    for (shapeY = -viewSize/2 + viewSize/2 % (backdrop.spacing/2) + floor(capsule.y / backdrop.spacing) * backdrop.spacing; shapeY <= viewSize/2 + ceil(capsule.y / backdrop.spacing) * backdrop.spacing; shapeY += backdrop.spacing) {
    
      push();
      translate(shapeX, shapeY);
      rotate(backdrop.angle);
      if (backdrop.shape === "square") {
        square(0, 0, backdrop.size);
      }
      else if (backdrop.shape === "circle") {
        circle(0, 0, backdrop.size);
      }
      pop();
    }
  }
}

function drawPaths() {
  // Draw the path for the capsule for the current level
  stroke(75);
  strokeWeight(pathBorder);
  
  let levelLines = paths[level];
  
  for (let lineIndex = 0; lineIndex < levelLines.length - 1; lineIndex += 1) {
    let startNode = levelLines[lineIndex];
    let endNode = levelLines[lineIndex + 1];  
    line(startNode.x, startNode.y, endNode.x, endNode.y);
  }
}

function drawCapsule() {
  // Draws the capsule so that the border is entirely on the outside
  noFill();
  stroke(capsule.col);
  strokeWeight(capsule.border);
  rect(capsule.x, capsule.y, capsule.w + capsule.border, capsule.h + capsule.border);
}

function drawPlayer() {
  noStroke();
  fill(player.col);
  square(player.x, player.y, player.size);
}

function levelProgress() {
  // Gets the current progress through the level and through the paths
  levelPaths = paths[level];
  currentNodeIndex = 0;
  lastNodeTime = levelStartTime;
  
  if (playingLevel) { 
    for (let nodeIndex = 0; nodeIndex < levelPaths.length; nodeIndex += 1) {
      if (millis() - levelStartTime >= levelPaths[nodeIndex].time) {
        currentNodeIndex = nodeIndex;
        lastNodeTime = levelStartTime + levelPaths[nodeIndex].time;  
        if (nodeIndex >= levelPaths.length - 1) {
          playingLevel = false;
        }
      }
      else {
        break;
      }
    }
  }
}

function moveCapsule() {
  // Move the capsule along the path, or keep it at the start
  if (playingLevel) {
    let currentPath = levelPaths[currentNodeIndex];
    let nextPath = levelPaths[currentNodeIndex + 1];
    let timeBetweenNodes = nextPath.time - currentPath.time;
    let timeSinceLastNode = millis() - lastNodeTime;

    capsule.x = lerp(currentPath.x, nextPath.x, timeSinceLastNode / timeBetweenNodes);
    capsule.y = lerp(currentPath.y, nextPath.y, timeSinceLastNode / timeBetweenNodes);
    capsule.w = lerp(currentPath.capsuleW, nextPath.capsuleW, timeSinceLastNode / timeBetweenNodes);
    capsule.h = lerp(currentPath.capsuleH, nextPath.capsuleH, timeSinceLastNode / timeBetweenNodes);
  
    backdrop.shape = currentPath.backdropData.shape;
    backdrop.spacing = currentPath.backdropData.spacing;
    backdrop.size = lerp(currentPath.backdropData.size, nextPath.backdropData.size, timeSinceLastNode / timeBetweenNodes);
    backdrop.angle = lerp(currentPath.backdropData.angle, nextPath.backdropData.angle, timeSinceLastNode / timeBetweenNodes);
    backdrop.backCol = lerpColor(color(currentPath.backdropData.backCol), color(nextPath.backdropData.backCol), timeSinceLastNode / timeBetweenNodes);
    backdrop.frontCol = lerpColor(color(currentPath.backdropData.frontCol), color(nextPath.backdropData.frontCol), timeSinceLastNode / timeBetweenNodes);
  }
  else {
    let currentPath = levelPaths[currentNodeIndex];

    capsule.x = currentPath.x;
    capsule.y = currentPath.y;
    capsule.w = currentPath.capsuleW;
    capsule.h = currentPath.capsuleH;
    
    backdrop.shape = currentPath.backdropData.shape;
    backdrop.spacing = currentPath.backdropData.spacing;
    backdrop.size = currentPath.backdropData.size;
    backdrop.angle = currentPath.backdropData.angle;
    backdrop.backCol = color(currentPath.backdropData.backCol);
    backdrop.frontCol = color(currentPath.backdropData.frontCol);
  }
}

function movePlayer() {
  if (keyIsDown(39) || keyIsDown(68)) { // Right arrow or D key
    player.x += player.speed;
  }
  if (keyIsDown(37) || keyIsDown(65)) { // Left arrow or A key
    player.x -= player.speed;
  }
  if (keyIsDown(40) || keyIsDown(83)) { // Down arrow or S key
    player.y += player.speed;
  }
  if (keyIsDown(38) || keyIsDown(87)) { // Up arrow or W key
    player.y -= player.speed;
  }
  
  // Keep the player in the capsule
  player.x = constrain(player.x, capsule.x - (capsule.w/2 - player.size/2), capsule.x + (capsule.w/2 - player.size/2));
  player.y = constrain(player.y, capsule.y - (capsule.h/2 - player.size/2), capsule.y + (capsule.h/2 - player.size/2));
}

function mousePressed() {
  // Toggle if the level is playing (capsule is moving)
  if (!playingLevel) {
    playingLevel = true;
    levelStartTime = millis();
  }
  else {
    playingLevel = false;
    player.x = 0;
    player.y = 0;
  }
}