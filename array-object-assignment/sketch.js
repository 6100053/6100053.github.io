// Arrays and Object Notation Assignment
// Carsen Waters
// March 18, 2026
//
// Extras for Experts:
// - Handling of window resizing while the project is running
// - p5.collide2d library for collision between shapes
//


//////// Data for the game's levels (There's only one level currently) //////// (maybe make constants?)

// The points on the path of the capsule through each level
let allNodes = [
  [
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 0, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 30}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 3000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 30}},
    {x: 500, y: 0, capsuleW: 100, capsuleH: 100, time: 10000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: "rgb(0, 0, 30)", frontCol: "rgb(0, 0, 60)"}},
    {x: 500, y: -200, capsuleW: 100, capsuleH: 100, time: 14000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 360, backCol: "rgb(0, 0, 30)", frontCol: "rgb(0, 0, 60)"}},
    {x: 200, y: -200, capsuleW: 100, capsuleH: 100, time: 15500, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backCol: "rgb(0, 0, 30)", frontCol: "rgb(0, 0, 60)"}},
    {x: 200, y: -400, capsuleW: 200, capsuleH: 200, time: 20000, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backCol: "rgb(60, 0, 0)", frontCol: "rgb(30, 0, 0)"}},
    {x: 0, y: -200, capsuleW: 200, capsuleH: 200, time: 23000, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backCol: "rgb(60, 0, 0)", frontCol: "rgb(30, 0, 0)"}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 27000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 30}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 30000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 30}}
  ]
];

let levels = [
  {name: "Test name", nodes: allNodes[0]}
];

let worldPortals = [
  {x: 400, y: 100, size: 100, col: "hsb(120, 50%, 75%)", level: levels[0]}
];

//////// Variables for playing the game ////////
let gameStage;

let player;
let backdrop;

let lastWorldPlayer = {x: 0, y: 0, size: 10, speed: 5, col: 255};

// This object holds all the information for when a level is being played
let levelStage = {};

let viewSize = 800;
let screenSize;

function setup() {
  // Make the canvas square, and set modes for drawing
  screenSize = min(windowWidth, windowHeight);
  createCanvas(screenSize, screenSize);
  rectMode(CENTER);
  angleMode(DEGREES);

  setGameStage("world", 0);
}

function windowResized() {
  screenSize = min(windowWidth, windowHeight);
  resizeCanvas(screenSize, screenSize);
}

function setGameStage(stage, levelIndex) {
  gameStage = stage;

  if (stage === "world") {
    player = lastWorldPlayer;
    backdrop = {shape: "circle", spacing: 100, size: 50, angle: 0, backCol: 0, frontCol: 30};

  } else if (stage === "level") {
    lastWorldPlayer = structuredClone(player);

    levelStage.levelObject = levels[levelIndex];
    levelStage.startTime = millis();
    
    player = {x: 0, y: 0, size: 10, speed: 5, col: 255};
    backdrop = {};
    
    levelStage.capsule = {border: 5, col: 100};
    levelStage.path = {border: 5, col: 75};
  }
  
  // Restart the draw loop
  noLoop();
  loop();
}

function draw() {
  if (gameStage === "world") {
    movePlayer();

    prepareDrawing();
    drawBackground();
    drawPortals();
    drawPlayer();
    
  } else if (gameStage === "level") {
    levelProgress();
    moveCapsule();
    movePlayer();
    
    prepareDrawing();
    drawBackground();
    drawPaths();
    drawCapsule();
    drawPlayer();
  }
}

// (Organize these functions according to draw loop I think)

// (always called, if/else for game state if needed)
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
  
  if (gameStage === "world") {
    // (Interactions with world walls etc.)
    for (let portal of worldPortals) {
      if (mouseIsPressed && collideRectCircle(player.x - player.size/2, player.y - player.size/2, player.size, player.size, portal.x, portal.y, portal.size)) {
        setGameStage("level", 0);
      }
    }

  } else if (gameStage === "level") {
    // Keep the player in the capsule
    let currentCapsule = levelStage.capsule;

    player.x = constrain(player.x, currentCapsule.x - (currentCapsule.w/2 - player.size/2), currentCapsule.x + (currentCapsule.w/2 - player.size/2));
    player.y = constrain(player.y, currentCapsule.y - (currentCapsule.h/2 - player.size/2), currentCapsule.y + (currentCapsule.h/2 - player.size/2));
  }
}

function prepareDrawing() {
  // Scale the scene so things take up the same space in the window regardless of how big it is
  scale(screenSize / viewSize);

  // Translate the scene so everything is centered on the player (in world state) or the capsule (in game state)
  if (gameStage === "world") {
    translate(viewSize/2 - player.x, viewSize/2 - player.y);

  } else if (gameStage === "level") {
    translate(viewSize/2 - levelStage.capsule.x, viewSize/2 - levelStage.capsule.y);

  }
}

function drawBackground() {
  // Center the drawing on the player (in world state) or the capsule (in game state)
  let focusX;
  let focusY;
  if (gameStage === "world") {
    focusX = player.x;
    focusY = player.y;
  } else if (gameStage === "level") {
    focusX = levelStage.capsule.x;
    focusY = levelStage.capsule.y;
  }

  let shapeSpacing = backdrop.spacing;

  background(backdrop.backCol);
  noStroke();
  fill(backdrop.frontCol);
  
  // Draw a grid of shapes, filling the background of the canvas
  for (shapeX = -viewSize/2 + viewSize/2 % (shapeSpacing/2) + floor(focusX / shapeSpacing) * shapeSpacing; shapeX <= viewSize/2 + ceil(focusX / shapeSpacing) * shapeSpacing; shapeX += shapeSpacing) {
    for (shapeY = -viewSize/2 + viewSize/2 % (shapeSpacing/2) + floor(focusY / shapeSpacing) * shapeSpacing; shapeY <= viewSize/2 + ceil(focusY / shapeSpacing) * shapeSpacing; shapeY += shapeSpacing) {
      push();
      translate(shapeX, shapeY);
      rotate(backdrop.angle);

      if (backdrop.shape === "square") {
        square(0, 0, backdrop.size);
      } else if (backdrop.shape === "circle") {
        circle(0, 0, backdrop.size);
      }
      pop();
    }
  }
}

function drawPlayer() {
  noStroke();
  fill(player.col);
  square(player.x, player.y, player.size);
}

// (in world stage only)
function drawPortals() {
  for (let portal of worldPortals) {
    noStroke();
    fill(portal.col);
    circle(portal.x, portal.y, portal.size);
  }
}

// (in-level only)
function levelProgress() {
  // Gets the current progress through the level and through the paths
  levelStage.currentNodeIndex = 0;
  levelStage.lastNodeTime = levelStage.startTime;
  
  for (let nodeIndex = 0; nodeIndex < levelStage.levelObject.nodes.length; nodeIndex += 1) {

    if (millis() - levelStage.startTime >= levelStage.levelObject.nodes[nodeIndex].time) {
      levelStage.currentNodeIndex = nodeIndex;
      levelStage.lastNodeTime = levelStage.startTime + levelStage.levelObject.nodes[nodeIndex].time;

      if (nodeIndex >= levelStage.levelObject.nodes.length - 1) {
        setGameStage("world", 0);
      }
    } else {
      break;
    }
  }
}

function moveCapsule() {
  // Move the capsule along the path, or keep it at the start
  let levelCapsule = levelStage.capsule;

  let currentPath = levelStage.levelObject.nodes[levelStage.currentNodeIndex];
  let nextPath = levelStage.levelObject.nodes[levelStage.currentNodeIndex + 1];
  
  // Time since the last node divided by the time between the last and next node
  let amountBetweenNodes = (millis() - levelStage.lastNodeTime) / (nextPath.time - currentPath.time);

  levelCapsule.x = lerp(currentPath.x, nextPath.x, amountBetweenNodes);
  levelCapsule.y = lerp(currentPath.y, nextPath.y, amountBetweenNodes);
  levelCapsule.w = lerp(currentPath.capsuleW, nextPath.capsuleW, amountBetweenNodes);
  levelCapsule.h = lerp(currentPath.capsuleH, nextPath.capsuleH, amountBetweenNodes);
  
  backdrop.shape = currentPath.backdropData.shape;
  backdrop.spacing = currentPath.backdropData.spacing;
  backdrop.size = lerp(currentPath.backdropData.size, nextPath.backdropData.size, amountBetweenNodes);
  backdrop.angle = lerp(currentPath.backdropData.angle, nextPath.backdropData.angle, amountBetweenNodes);
  backdrop.backCol = lerpColor(color(currentPath.backdropData.backCol), color(nextPath.backdropData.backCol), amountBetweenNodes);
  backdrop.frontCol = lerpColor(color(currentPath.backdropData.frontCol), color(nextPath.backdropData.frontCol), amountBetweenNodes);
}

function drawPaths() {
  // Draw the path of the capsule for the current level
  stroke(levelStage.path.col);
  strokeWeight(levelStage.path.border);
  
  let levelLines = levelStage.levelObject.nodes;
  
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