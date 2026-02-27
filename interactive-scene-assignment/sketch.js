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
  let levelBackdrop = levelStage.backdrop;

  background(levelBackdrop.backCol);
  noStroke();
  fill(levelBackdrop.frontCol);
  
  // Draw a grid of shapes, filling the background of the canvas (centered on the capsule)
  for (shapeX = -viewSize/2 + viewSize/2 % (levelBackdrop.spacing/2) + floor(levelStage.capsule.x / levelBackdrop.spacing) * levelBackdrop.spacing; shapeX <= viewSize/2 + ceil(levelStage.capsule.x / levelBackdrop.spacing) * levelBackdrop.spacing; shapeX += levelBackdrop.spacing) {
    for (shapeY = -viewSize/2 + viewSize/2 % (levelBackdrop.spacing/2) + floor(levelStage.capsule.y / levelBackdrop.spacing) * levelBackdrop.spacing; shapeY <= viewSize/2 + ceil(levelStage.capsule.y / levelBackdrop.spacing) * levelBackdrop.spacing; shapeY += levelBackdrop.spacing) {
    
      push();
      translate(shapeX, shapeY);
      rotate(levelBackdrop.angle);
      if (levelBackdrop.shape === "square") {
        square(0, 0, levelBackdrop.size);
      }
      else if (levelBackdrop.shape === "circle") {
        circle(0, 0, levelBackdrop.size);
      }
      pop();
    }
  }
}

function drawPaths() {
  // Draw the path for the capsule for the current level
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
  noFill();
  stroke(levelStage.capsule.col);
  strokeWeight(levelStage.capsule.border);
  rect(levelStage.capsule.x, levelStage.capsule.y, levelStage.capsule.w + levelStage.capsule.border, levelStage.capsule.h + levelStage.capsule.border);
}

function drawPlayer() {
  noStroke();
  fill(levelStage.player.col);
  square(levelStage.player.x, levelStage.player.y, levelStage.player.size);
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
      }
      else {
        break;
      }
    }
  }
}

function moveCapsule() {
  // Move the capsule along the path, or keep it at the start
  if (levelStage.playing) {
    let currentPath = levelStage.nodes[levelStage.currentNodeIndex];
    let nextPath = levelStage.nodes[levelStage.currentNodeIndex + 1];
    let timeBetweenNodes = nextPath.time - currentPath.time;
    let timeSinceLastNode = millis() - levelStage.lastNodeTime;

    levelStage.capsule.x = lerp(currentPath.x, nextPath.x, timeSinceLastNode / timeBetweenNodes);
    levelStage.capsule.y = lerp(currentPath.y, nextPath.y, timeSinceLastNode / timeBetweenNodes);
    levelStage.capsule.w = lerp(currentPath.capsuleW, nextPath.capsuleW, timeSinceLastNode / timeBetweenNodes);
    levelStage.capsule.h = lerp(currentPath.capsuleH, nextPath.capsuleH, timeSinceLastNode / timeBetweenNodes);
  
    levelStage.backdrop.shape = currentPath.backdropData.shape;
    levelStage.backdrop.spacing = currentPath.backdropData.spacing;
    levelStage.backdrop.size = lerp(currentPath.backdropData.size, nextPath.backdropData.size, timeSinceLastNode / timeBetweenNodes);
    levelStage.backdrop.angle = lerp(currentPath.backdropData.angle, nextPath.backdropData.angle, timeSinceLastNode / timeBetweenNodes);
    levelStage.backdrop.backCol = lerpColor(color(currentPath.backdropData.backCol), color(nextPath.backdropData.backCol), timeSinceLastNode / timeBetweenNodes);
    levelStage.backdrop.frontCol = lerpColor(color(currentPath.backdropData.frontCol), color(nextPath.backdropData.frontCol), timeSinceLastNode / timeBetweenNodes);
  }
  else {
    let currentPath = levelStage.nodes[levelStage.currentNodeIndex];

    levelStage.capsule.x = currentPath.x;
    levelStage.capsule.y = currentPath.y;
    levelStage.capsule.w = currentPath.capsuleW;
    levelStage.capsule.h = currentPath.capsuleH;
    
    levelStage.backdrop.shape = currentPath.backdropData.shape;
    levelStage.backdrop.spacing = currentPath.backdropData.spacing;
    levelStage.backdrop.size = currentPath.backdropData.size;
    levelStage.backdrop.angle = currentPath.backdropData.angle;
    levelStage.backdrop.backCol = color(currentPath.backdropData.backCol);
    levelStage.backdrop.frontCol = color(currentPath.backdropData.frontCol);
  }
}

function movePlayer() {
  if (keyIsDown(39) || keyIsDown(68)) { // Right arrow or D key
    levelStage.player.x += levelStage.player.speed;
  }
  if (keyIsDown(37) || keyIsDown(65)) { // Left arrow or A key
    levelStage.player.x -= levelStage.player.speed;
  }
  if (keyIsDown(40) || keyIsDown(83)) { // Down arrow or S key
    levelStage.player.y += levelStage.player.speed;
  }
  if (keyIsDown(38) || keyIsDown(87)) { // Up arrow or W key
    levelStage.player.y -= levelStage.player.speed;
  }
  
  // Keep the player in the capsule
  levelStage.player.x = constrain(levelStage.player.x, levelStage.capsule.x - (levelStage.capsule.w/2 - levelStage.player.size/2), levelStage.capsule.x + (levelStage.capsule.w/2 - levelStage.player.size/2));
  levelStage.player.y = constrain(levelStage.player.y, levelStage.capsule.y - (levelStage.capsule.h/2 - levelStage.player.size/2), levelStage.capsule.y + (levelStage.capsule.h/2 - levelStage.player.size/2));
}

function mousePressed() {
  // Toggle if the level is playing (capsule is moving)
  if (!levelStage.playing) {
    levelStage.playing = true;
    levelStage.startTime = millis();
  }
  else {
    levelStage.playing = false;
    levelStage.player.x = 0;
    levelStage.player.y = 0;
  }
}