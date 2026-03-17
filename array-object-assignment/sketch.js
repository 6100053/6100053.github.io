// Arrays and Object Notation Assignment
// Carsen Waters
// March 18, 2026
//
// Extras for Experts:
// - Handling of window resizing while the project is running (windowResized function)
// - p5.collide2d library for collision between shapes

//////// Data for the game's levels ////////

// The points on the path of the capsule through each level
let allNodes = [
  [
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, timeBeats: 0, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {h: 240, s: 0, b: 0}, frontColor: {h: 240, s: 0, b: 10}}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, timeBeats: 4, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {h: 240, s: 0, b: 0}, frontColor: {h: 240, s: 0, b: 10}}},
    {x: 400, y: 0, capsuleW: 100, capsuleH: 100, timeBeats: 8, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {h: 240, s: 50, b: 10}, frontColor: {h: 240, s: 50, b: 20}}},
    {x: 400, y: -200, capsuleW: 200, capsuleH: 100, timeBeats: 12, backdropData: {shape: "square", spacing: 100, size: 50, angle: 360, backColor: {h: 240, s: 50, b: 10}, frontColor: {h: 240, s: 50, b: 20}}},
    {x: -400, y: -200, capsuleW: 200, capsuleH: 100, timeBeats: 20, backdropData: {shape: "square", spacing: 100, size: 50, angle: 360, backColor: {h: 240, s: 50, b: 10}, frontColor: {h: 240, s: 50, b: 20}}},
    {x: -400, y: 0, capsuleW: 200, capsuleH: 200, timeBeats: 24, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backColor: {h: 240, s: 50, b: 10}, frontColor: {h: 240, s: 50, b: 20}}},
    {x: 0, y: 400, capsuleW: 200, capsuleH: 200, timeBeats: 30, backdropData: {shape: "square", spacing: 100, size: 75, angle: 360, backColor: {h: 240, s: 100, b: 20}, frontColor: {h: 240, s: 100, b: 5}}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, timeBeats: 34, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {h: 240, s: 0, b: 0}, frontColor: {h: 240, s: 0, b: 10}}},
    {x: 0, y: 0, capsuleW: 100, capsuleH: 100, timeBeats: 36, backdropData: {shape: "square", spacing: 100, size: 50, angle: 0, backColor: {h: 240, s: 0, b: 0}, frontColor: {h: 240, s: 0, b: 10}}},
  ],
  [
    {x: 0, y: 0, capsuleW: 150, capsuleH: 150, timeBeats: 0, backdropData: {shape: "square", spacing: 75, size: 60, angle: 0, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
    {x: 0, y: 0, capsuleW: 150, capsuleH: 150, timeBeats: 8, backdropData: {shape: "square", spacing: 75, size: 60, angle: 0, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
    {x: -300, y: 150, capsuleW: 150, capsuleH: 100, timeBeats: 16, backdropData: {shape: "square", spacing: 75, size: 60, angle: 45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
    {x: -300, y: 450, capsuleW: 250, capsuleH: 100, timeBeats: 24, backdropData: {shape: "square", spacing: 75, size: 60, angle: 45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 75, b: 15}}},
    {x: -150, y: 600, capsuleW: 250, capsuleH: 100, timeBeats: 28, backdropData: {shape: "square", spacing: 75, size: 60, angle: -45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 75, b: 15}}},
    {x: 0, y: 450, capsuleW: 250, capsuleH: 100, timeBeats: 32, backdropData: {shape: "square", spacing: 75, size: 60, angle: 45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 75, b: 15}}},
    {x: 150, y: 600, capsuleW: 250, capsuleH: 100, timeBeats: 36, backdropData: {shape: "square", spacing: 75, size: 60, angle: -45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 75, b: 15}}},
    {x: 300, y: 450, capsuleW: 250, capsuleH: 100, timeBeats: 40, backdropData: {shape: "square", spacing: 75, size: 60, angle: 45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 75, b: 15}}},
    {x: 450, y: 150, capsuleW: 50, capsuleH: 50, timeBeats: 48, backdropData: {shape: "square", spacing: 75, size: 30, angle: 45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
    {x: 450, y: 150, capsuleW: 50, capsuleH: 50, timeBeats: 52, backdropData: {shape: "square", spacing: 75, size: 30, angle: 45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
    {x: 300, y: 150, capsuleW: 50, capsuleH: 50, timeBeats: 53, backdropData: {shape: "square", spacing: 75, size: 30, angle: 45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
    {x: 300, y: 0, capsuleW: 50, capsuleH: 50, timeBeats: 54, backdropData: {shape: "square", spacing: 75, size: 30, angle: 45, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
    {x: 0, y: 0, capsuleW: 150, capsuleH: 150, timeBeats: 60, backdropData: {shape: "square", spacing: 75, size: 60, angle: 0, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
    {x: 0, y: 0, capsuleW: 150, capsuleH: 150, timeBeats: 64, backdropData: {shape: "square", spacing: 75, size: 60, angle: 0, backColor: {h: 120, s: 0, b: 0}, frontColor: {h: 120, s: 25, b: 15}}},
  ]
];

let levels = [
  {name: "Test name", tempo: 120, nodes: allNodes[0]},
  {name: "Another level", tempo: 168, nodes: allNodes[1]}
];

let worldPortals = [
  {x: 400, y: 100, size: 100, sizeHover: 150, color: {h: 240, s: 50, b: 40}, level: levels[0], playerHover: false},
  {x: -200, y: -300, size: 50, sizeHover: 100, color: {h: 120, s: 50, b: 40}, level: levels[1], playerHover: false}
];

//////// Variables for playing the game ////////
let gameState;

let player;
let backdrop;

// Holds the player's information for when the world state is switched (so they return to the same place when finished a level)
let lastWorldPlayer = {x: 0, y: 0, size: 10, speed: 5, color: {h: 0, s: 0, b: 100}};

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
  colorMode(HSB);

  setGameState("world");
}

function windowResized() {
  screenSize = min(windowWidth, windowHeight);
  resizeCanvas(screenSize, screenSize);
}

function draw() {
  if (gameState === "world") {
    movePlayer();
    checkPortals();

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

function setGameState(state, level = []) {
  // Changes the game state, setting up the new state
  gameState = state;

  if (state === "world") {
    player = lastWorldPlayer;
    backdrop = {shape: "circle", spacing: 100, size: 50, angle: 0, backColor: {h: 0, s: 0, b: 0}, frontColor: {h: 0, s: 0, b: 10}};

  } else if (state === "level") {
    lastWorldPlayer = structuredClone(player);

    levelState.levelObject = level;
    levelState.startTime = millis();
    
    player = {x: 0, y: 0, size: 10, speed: 5, color: {h: 0, s: 0, b: 100}};
    backdrop = {};
    
    levelState.capsule = {border: 5, color: {h: 0, s: 0, b: 40}};
    levelState.path = {border: 5, color: {h: 0, s: 0, b: 30}};
  }
  
  // Restart the draw loop from the start (so that functions in the old game state don't run)
  noLoop();
  loop();
}

function beatsToMillis(beats, bpm) {
  // Calculates the number of milliseconds that the given number of beats at the given tempo take
  return beats * (60000 / bpm);
}

//////// Draw loop functions used in all game states ////////

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
    // Collide with world features (when things like world walls are added)

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

  background(backdrop.backColor.h, backdrop.backColor.s, backdrop.backColor.b);
  noStroke();
  fill(backdrop.frontColor.h, backdrop.frontColor.s, backdrop.frontColor.b);
  
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
  fill(player.color.h, player.color.s, player.color.b);
  square(player.x, player.y, player.size);
}

//////// Draw loop funcitons used in the world game state ////////

function checkPortals() {
  // Check all the portals for player collision
  for (let portal of worldPortals) {
    if (collideRectCircle(player.x - player.size/2, player.y - player.size/2, player.size, player.size, portal.x, portal.y, portal.size)) {
      portal.playerHover = true;

      if (mouseIsPressed) {
        setGameState("level", portal.level);
      }
    } else {
      portal.playerHover = false;
    }
  }
}

function drawPortals() {
  // Draw the world's portals (This will include other world features eventually)
  for (let portal of worldPortals) {
    // Draw them brighter if player is touching
    let portalColorB;

    if (portal.playerHover) {
      portalColorB = portal.color.b * 2;
    } else { 
      portalColorB = portal.color.b;
    }

    noStroke();
    fill(portal.color.h, portal.color.s, portalColorB);
    circle(portal.x, portal.y, portal.size);
  }
}

//////// Draw loop functions used in the level game state ////////

function levelProgress() {
  // Gets the current progress through the level and through the paths

  levelState.currentNodeIndex = 0;
  levelState.lastNodeTime = levelState.startTime;
  
  // Check the level's nodes in order
  for (let nodeIndex = 0; nodeIndex < levelState.levelObject.nodes.length; nodeIndex += 1) {

    if (millis() - levelState.startTime >= beatsToMillis(levelState.levelObject.nodes[nodeIndex].timeBeats, levelState.levelObject.tempo)) {
      // If the time before the capsule reaches the node has passed, set the capsule's current node as that one
      levelState.currentNodeIndex = nodeIndex;
      levelState.lastNodeTime = levelState.startTime + beatsToMillis(levelState.levelObject.nodes[nodeIndex].timeBeats, levelState.levelObject.tempo);

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
  let amountBetweenNodes = (millis() - levelState.lastNodeTime) / (beatsToMillis(nextPath.timeBeats, levelState.levelObject.tempo) - beatsToMillis(currentPath.timeBeats, levelState.levelObject.tempo));

  // Set capsule and backdrop properties to values between those of the last and next node
  levelCapsule.x = lerp(currentPath.x, nextPath.x, amountBetweenNodes);
  levelCapsule.y = lerp(currentPath.y, nextPath.y, amountBetweenNodes);
  levelCapsule.width = lerp(currentPath.capsuleW, nextPath.capsuleW, amountBetweenNodes);
  levelCapsule.height = lerp(currentPath.capsuleH, nextPath.capsuleH, amountBetweenNodes);
  
  backdrop.shape = currentPath.backdropData.shape;
  backdrop.spacing = currentPath.backdropData.spacing;
  backdrop.size = lerp(currentPath.backdropData.size, nextPath.backdropData.size, amountBetweenNodes);
  backdrop.angle = lerp(currentPath.backdropData.angle, nextPath.backdropData.angle, amountBetweenNodes);
  
  let newBackColor = {};
  let newFrontColor = {};

  newBackColor.h = lerp(currentPath.backdropData.backColor.h, nextPath.backdropData.backColor.h, amountBetweenNodes); 
  newBackColor.s = lerp(currentPath.backdropData.backColor.s, nextPath.backdropData.backColor.s, amountBetweenNodes);
  newBackColor.b = lerp(currentPath.backdropData.backColor.b, nextPath.backdropData.backColor.b, amountBetweenNodes);
  
  newFrontColor.h = lerp(currentPath.backdropData.frontColor.h, nextPath.backdropData.frontColor.h, amountBetweenNodes); 
  newFrontColor.s = lerp(currentPath.backdropData.frontColor.s, nextPath.backdropData.frontColor.s, amountBetweenNodes);
  newFrontColor.b = lerp(currentPath.backdropData.frontColor.b, nextPath.backdropData.frontColor.b, amountBetweenNodes);

  backdrop.backColor = newBackColor;
  backdrop.frontColor = newFrontColor;
}

function drawPaths() {
  // Draw the path of the capsule for the current level
  stroke(levelState.path.color.h, levelState.path.color.s, levelState.path.color.b);
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
  stroke(currentCapsule.color.h, currentCapsule.color.s, currentCapsule.color.b);
  strokeWeight(currentCapsule.border);
  rect(currentCapsule.x, currentCapsule.y, currentCapsule.width + currentCapsule.border, currentCapsule.height + currentCapsule.border);
}