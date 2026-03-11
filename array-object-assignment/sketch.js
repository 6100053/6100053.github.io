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
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 0, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: 0, frontColor: 30}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 3000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: 0, frontColor: 30}},
    {x: 500, y: 0, capsuleW: 100, capsuleH: 100, time: 10000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: "rgb(0, 0, 30)", frontColor: "rgb(0, 0, 60)"}},
    {x: 500, y: -200, capsuleW: 100, capsuleH: 100, time: 14000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 360, backColor: "rgb(0, 0, 30)", frontColor: "rgb(0, 0, 60)"}},
    {x: 200, y: -200, capsuleW: 100, capsuleH: 100, time: 15500, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backColor: "rgb(0, 0, 30)", frontColor: "rgb(0, 0, 60)"}},
    {x: 200, y: -400, capsuleW: 200, capsuleH: 200, time: 20000, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backColor: "rgb(60, 0, 0)", frontColor: "rgb(30, 0, 0)"}},
    {x: 0, y: -200, capsuleW: 200, capsuleH: 200, time: 23000, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backColor: "rgb(60, 0, 0)", frontColor: "rgb(30, 0, 0)"}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 27000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: 0, frontColor: 30}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, time: 30000, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: 0, frontColor: 30}}
  ]
];

let levels = [
  {name: "Test name", nodes: allNodes[0]}
];

let worldPortals = [
  {x: 400, y: 100, size: 100, color: "hsb(120, 50%, 75%)", level: levels[0]}
];

//////// Variables for playing the game ////////
let gameState;

let player;
let backdrop;

// Holds the player's information for when the world state is switched (so they return to the same place when finished a level)
let lastWorldPlayer = {x: 0, y: 0, size: 10, speed: 5, color: 255};

// This object holds all the information for when a level is being played
let levelState = {};

// Size of the view that the drawing will be scaled to
let viewSize = 800;
let screenSize;

//////// Setup and running functions ////////

function setup() {
  // Make the canvas square, and set modes for drawing
  screenSize = min(windowWidth, windowHeight);
  createCanvas(screenSize, screenSize);
  rectMode(CENTER);
  angleMode(DEGREES);

  setGameState("world", 0);
}

function windowResized() {
  screenSize = min(windowWidth, windowHeight);
  resizeCanvas(screenSize, screenSize);
}

function setGameState(state, levelIndex) {
  // Changes the game state, setting up the new state
  gameState = state;

  if (state === "world") {
    player = lastWorldPlayer;
    backdrop = {shape: "circle", spacing: 100, size: 50, angle: 0, backColor: 0, frontColor: 30};

  } else if (state === "level") {
    lastWorldPlayer = structuredClone(player);

    levelState.levelObject = levels[levelIndex];
    levelState.startTime = millis();
    
    player = {x: 0, y: 0, size: 10, speed: 5, color: 255};
    backdrop = {};
    
    levelState.capsule = {border: 5, color: 100};
    levelState.path = {border: 5, color: 75};
  }
  
  // Restart the draw loop
  noLoop();
  loop();
}

function draw() {
  if (gameState === "world") {
    movePlayer();

    prepareDrawing();
    drawBackground();
    drawPortals();
    drawPlayer();
    
  } else if (gameState === "level") {
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

//////// Functions used in all game states ////////

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
  
  if (gameState === "world") {
    // Collide or interact with world features
    for (let portal of worldPortals) {
      if (mouseIsPressed && collideRectCircle(player.x - player.size/2, player.y - player.size/2, player.size, player.size, portal.x, portal.y, portal.size)) {
        setGameState("level", 0);
      }
    }

  } else if (gameState === "level") {
    // Keep the player in the capsule
    let currentCapsule = levelState.capsule;

    player.x = constrain(player.x, currentCapsule.x - (currentCapsule.width/2 - player.size/2), currentCapsule.x + (currentCapsule.width/2 - player.size/2));
    player.y = constrain(player.y, currentCapsule.y - (currentCapsule.height/2 - player.size/2), currentCapsule.y + (currentCapsule.height/2 - player.size/2));
  }
}

function prepareDrawing() {
  // Scale the scene so things take up the same space in the window regardless of how big it is
  scale(screenSize / viewSize);

  // Translate the scene so everything is centered on the player (in world state) or the capsule (in game state)
  if (gameState === "world") {
    translate(viewSize/2 - player.x, viewSize/2 - player.y);

  } else if (gameState === "level") {
    translate(viewSize/2 - levelState.capsule.x, viewSize/2 - levelState.capsule.y);

  }
}

function drawBackground() {
  // Center the drawing on the player (in world state) or the capsule (in game state)
  let focusX;
  let focusY;
  if (gameState === "world") {
    focusX = player.x;
    focusY = player.y;
  } else if (gameState === "level") {
    focusX = levelState.capsule.x;
    focusY = levelState.capsule.y;
  }

  let shapeSpacing = backdrop.spacing;

  background(backdrop.backColor);
  noStroke();
  fill(backdrop.frontColor);
  
  // Draw a grid of shapes, filling just the background of the canvas
  for (let shapeX = -viewSize/2 + viewSize/2 % (shapeSpacing/2) + floor(focusX / shapeSpacing) * shapeSpacing; shapeX <= viewSize/2 + ceil(focusX / shapeSpacing) * shapeSpacing; shapeX += shapeSpacing) {
    for (let shapeY = -viewSize/2 + viewSize/2 % (shapeSpacing/2) + floor(focusY / shapeSpacing) * shapeSpacing; shapeY <= viewSize/2 + ceil(focusY / shapeSpacing) * shapeSpacing; shapeY += shapeSpacing) {
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
  // Draw the player
  noStroke();
  fill(player.color);
  square(player.x, player.y, player.size);
}

//////// Funcitons used in the world game state ////////

function drawPortals() {
  // Draw the world's portals (I will likely be update this to include other world features eventually)
  for (let portal of worldPortals) {
    noStroke();
    fill(portal.color);
    circle(portal.x, portal.y, portal.size);
  }
}

//////// Functions used in the level game state ////////

function levelProgress() {
  // Gets the current progress through the level and through the paths

  levelState.currentNodeIndex = 0;
  levelState.lastNodeTime = levelState.startTime;
  
  // Check the level's nodes in order
  for (let nodeIndex = 0; nodeIndex < levelState.levelObject.nodes.length; nodeIndex += 1) {

    if (millis() - levelState.startTime >= levelState.levelObject.nodes[nodeIndex].time) {
      // If the time before the capsule reaches the node has passed, set the capsule's current node as that one
      levelState.currentNodeIndex = nodeIndex;
      levelState.lastNodeTime = levelState.startTime + levelState.levelObject.nodes[nodeIndex].time;

      if (nodeIndex >= levelState.levelObject.nodes.length - 1) {
        // If the last node in the level has been passed, exit to the world state
        setGameState("world", 0);
      }
    } else {
      // Exit the loop (with the current node still set as the previous node checked)
      break;
    }
  }
}

function moveCapsule() {
  // Move the capsule along the path by setting the position based on the current node and time
  let levelCapsule = levelState.capsule;

  let currentPath = levelState.levelObject.nodes[levelState.currentNodeIndex];
  let nextPath = levelState.levelObject.nodes[levelState.currentNodeIndex + 1];
  
  // Amount from the last node to the next one (0 to 1)
  let amountBetweenNodes = (millis() - levelState.lastNodeTime) / (nextPath.time - currentPath.time);

  // Set capsule and backdrop properties to values between those of the last and next node
  levelCapsule.x = lerp(currentPath.x, nextPath.x, amountBetweenNodes);
  levelCapsule.y = lerp(currentPath.y, nextPath.y, amountBetweenNodes);
  levelCapsule.width = lerp(currentPath.capsuleW, nextPath.capsuleW, amountBetweenNodes);
  levelCapsule.height = lerp(currentPath.capsuleH, nextPath.capsuleH, amountBetweenNodes);
  
  backdrop.shape = currentPath.backdropData.shape;
  backdrop.spacing = currentPath.backdropData.spacing;
  backdrop.size = lerp(currentPath.backdropData.size, nextPath.backdropData.size, amountBetweenNodes);
  backdrop.angle = lerp(currentPath.backdropData.angle, nextPath.backdropData.angle, amountBetweenNodes);
  backdrop.backColor = lerpColor(color(currentPath.backdropData.backColor), color(nextPath.backdropData.backColor), amountBetweenNodes);
  backdrop.frontColor = lerpColor(color(currentPath.backdropData.frontColor), color(nextPath.backdropData.frontColor), amountBetweenNodes);
}

function drawPaths() {
  // Draw the path of the capsule for the current level
  stroke(levelState.path.color);
  strokeWeight(levelState.path.border);
  
  let levelLines = levelState.levelObject.nodes;
  
  for (let lineIndex = 0; lineIndex < levelLines.length - 1; lineIndex += 1) {
    let startNode = levelLines[lineIndex];
    let endNode = levelLines[lineIndex + 1];  

    line(startNode.x, startNode.y, endNode.x, endNode.y);
  }
}

function drawCapsule() {
  // Draws the capsule so that the border is entirely on the outside
  let currentCapsule = levelState.capsule;
  
  noFill();
  stroke(currentCapsule.color);
  strokeWeight(currentCapsule.border);
  rect(currentCapsule.x, currentCapsule.y, currentCapsule.width + currentCapsule.border, currentCapsule.height + currentCapsule.border);
}