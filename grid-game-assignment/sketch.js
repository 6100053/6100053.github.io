// 2d Grid Game Assignment
// Carsen Waters
// April 15 2026
//
// Extras for Experts:
// - PLACEHOLDERp5 party
// - Use of touches array for mobile controls

//ask how many constants to make
//frame buildup bug?
//fix writing conflicts (have host move all snakes? use myshared objects/list of snakes)
//not all players adding food?

// Key code/player input constants
const KEYS = {
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  a: 65,
  d: 68,
  s: 83,
  w: 87,
};
const SIDE_TOUCH_THRESHOLD = 0.25;

// Colors for drawing the game
const COLORS = {
  empty1: 220,
  empty2: 240,
  wall1: 0,
  wall2: 20,
  snakeMin: 50,
  snakeMax: 200,
  eye1: 255,
  eye2: 0,
  lobbyBack: [255, 100],
  lobbyText: 0,
};

// Game map generation constants
const MAP_SIZE = 30;
const MAP_GENERATION_THRESHOLD = 0.15;
const MAP_GENERATION_SCALE = 10;

// Canvas display information such as size
let cellSize;
const VIEW_SIZE = 20;
const VIEW_LOBBY_SIZE = 40;
const LOBBY_TEXT_SCALE = 0.0425;
const CAMERA_SPEED = 0.03;

// Grid cell constants
const CELL_EMPTY = {type: "empty"};
const CELL_WALL = {type: "wall"};

// Food spawning constants
const START_FOOD = 25;
const FOOD_CHANCE_SPAWN = 0.2;
const FOOD_CHANCE_DEATH = 0.5;

// Snake length and best score
const SNAKE_START_LENGTH = 3;
let bestLength = 0;

// Speed and counter of snake movement frames
const SNAKE_MOVE_TIME = 250;
let snakeMoveFrame;
let serverStartTime;

// Variables for the game grid, current snake, and display focus
let grid;
let snake;
let camera;

function preload() {
  // Connect to server using p5.party library
  partyConnect("wss://demoserver.p5party.org", "6100053-grid-game-assignment");

  // Initialize the shared game grid and movement frame
  grid = partyLoadShared("grid");
  snakeMoveFrame = partyLoadShared("snakeMoveFrame");
  serverStartTime = partyLoadShared("serverStartTime");
}

function setup() {
  // Make a square canvas based on window size
  let windowSize = min(windowWidth, windowHeight);
  createCanvas(windowSize, windowSize);
  noStroke();

  // If the client is the first to join an empty room, generate a new game map, reset the movement frame and store the start time
  if (partyIsHost()) {
    partySetShared(grid, {value: generateGrid(MAP_SIZE)});
    partySetShared(snakeMoveFrame, {value: 0});
    partySetShared(serverStartTime, {value: Date.now()});
  }

  // Set up a placeholder snake, the camera, and some starting food
  snake = {alive: false, x: MAP_SIZE / 2, y: MAP_SIZE / 2, bodyLength: 0};
  camera = {x: snake.x, y: snake.y, size: VIEW_SIZE, sizeTarget: VIEW_SIZE, speed: CAMERA_SPEED};
  addRandomFood(START_FOOD);
}

function windowResized() {
  // Resize the square canvas based on window size
  let windowSize = min(windowWidth, windowHeight);
  resizeCanvas(windowSize, windowSize);
}

function draw() {
  playerDirection();
  // If on the lobby screen and space is pressed/screen touched, spawn a snake for the player
  if (!snake.alive && (keyIsDown(KEYS.space) || touches.length > 0)) {
    newSnake();
  }
  // If it's time for the next snake movement frame, run it and increment the current frame
  if (Date.now() - serverStartTime.value > snakeMoveFrame.value * SNAKE_MOVE_TIME) {
    moveSnake();
    updateCells();
    if (random() < FOOD_CHANCE_SPAWN) {
      addRandomFood(1);
    }
    snakeMoveFrame.value += 1;
  }
  
  moveCamera();
  drawGrid();
  drawInfo();
}

function playerDirection() {
  let screenTouched = touches.length > 0;
  // If there is no active snake don't move anything
  if (!snake.alive) {
    snake.xSpeed = 0;
    snake.ySpeed = 0;
  }
  // Otherwise take movement input for the player's active snake
  else if ((keyIsDown(KEYS.up) || keyIsDown(KEYS.w) || screenTouched && touches[0].y < height * SIDE_TOUCH_THRESHOLD) && snake.lastYSpeed < 1) {
    snake.xSpeed = 0;
    snake.ySpeed = -1;
  }
  else if ((keyIsDown(KEYS.down) || keyIsDown(KEYS.s) || screenTouched && touches[0].y > height * (1 - SIDE_TOUCH_THRESHOLD)) && snake.lastYSpeed > -1) {
    snake.xSpeed = 0;
    snake.ySpeed = 1;
  }
  else if ((keyIsDown(KEYS.left) || keyIsDown(KEYS.a) || screenTouched && touches[0].x < width * SIDE_TOUCH_THRESHOLD) && snake.lastXSpeed < 1) {
    snake.xSpeed = -1;
    snake.ySpeed = 0;
  }
  else if ((keyIsDown(KEYS.right) || keyIsDown(KEYS.d) || screenTouched && touches[0].x > width * (1 - SIDE_TOUCH_THRESHOLD)) && snake.lastXSpeed > -1) {
    snake.xSpeed = 1;
    snake.ySpeed = 0;
  }
}

function updateCells() {
  // Check each cell of the grid
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      let gridCell = grid.value[y][x];
      if (gridCell.type === "body") {
        // Check snake body segments for if the snake has moved off or if they have died
        if (snakeMoveFrame.value >= gridCell.emptyFrame || !snake.alive) {
          grid.value[y][x] = CELL_EMPTY;

          if (!snake.alive && random() < FOOD_CHANCE_DEATH) {
            grid.value[y][x] = {
              type: "food",
              color: {r: random(COLORS.snakeMin, COLORS.snakeMax), g: random(COLORS.snakeMin, COLORS.snakeMax), b: random(COLORS.snakeMin, COLORS.snakeMax)}
            };
          }
        }
      }
    }
  }
}

function moveSnake() {
  // Only move the snake if it is alive
  if (snake.alive) {
    // Set the old location to a body segment
    grid.value[snake.y][snake.x] = {
      type: "body",
      snake: structuredClone(snake),
      emptyFrame: snakeMoveFrame.value + snake.bodyLength,
      currentBodyLength: structuredClone(snake.bodyLength),
      hasFood: grid.value[snake.y][snake.x].hasFood
    };

    // Move the snake
    snake.x += snake.xSpeed;
    snake.y += snake.ySpeed;

    snake.lastXSpeed = snake.xSpeed;
    snake.lastYSpeed = snake.ySpeed;

    // If the snake moved to a new square
    if (snake.xSpeed !== 0 || snake.ySpeed !== 0) {
      // Check for collisions with map border, walls, other snakes
      if (snake.y < 0 || snake.y >= grid.value.length || snake.x < 0 || snake.x >= grid.value[snake.y].length || grid.value[snake.y][snake.x].type === "wall" || grid.value[snake.y][snake.x].type === "body" && grid.value[snake.y][snake.x].emptyFrame > snakeMoveFrame.value) {
        snake.alive = false;
        if (snake.bodyLength > bestLength) {
          bestLength = snake.bodyLength;
        }
      }
      else {
      // If there was no collision add the head in the new spot
        let bodyHasFood = false;
        if (grid.value[snake.y][snake.x].type === "food") {
          bodyHasFood = true;
          snake.bodyLength += 1;
        }

        grid.value[snake.y][snake.x] = {
          type: "head",
          snake: structuredClone(snake),
          hasFood: bodyHasFood
        };
      }
    }
  }
}

function moveCamera() {
  // Move/scale the camera smoothly towards the player, considering if the snake is active or not
  if (snake.alive) {
    camera.sizeTarget = VIEW_SIZE;
  }
  else {
    camera.sizeTarget = VIEW_LOBBY_SIZE;
  }

  camera.x += (snake.x - camera.x) * camera.speed;
  camera.y += (snake.y - camera.y) * camera.speed;
  camera.size += (camera.sizeTarget - camera.size) * camera.speed;

  cellSize = width / camera.size;
}

function drawGrid() {
  // Align the drawing with the camera
  push();
  translate((-camera.x - 1/2 + camera.size / 2) * cellSize, (-camera.y - 1/2 + camera.size / 2) * cellSize);

  // Draw every cell within the canvas
  for (let y = round(camera.y) - ceil(camera.size / 2); y <= round(camera.y) + ceil(camera.size / 2); y++) {
    for (let x = round(camera.x) - ceil(camera.size / 2); x <= round(camera.x) + ceil(camera.size / 2); x++) {

      if (x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
        // If the cell exists in the map, check its type
        let gridCell = grid.value[y][x];

        if (gridCell.type === "head" || gridCell.type === "body") {
          // If the cell is part of a snake, find its color to draw it
          let playerColor1 = color(gridCell.snake.color1.r, gridCell.snake.color1.g, gridCell.snake.color1.b);
          let playerColor2 = color(gridCell.snake.color2.r, gridCell.snake.color2.g, gridCell.snake.color2.b);

          let lerpAmount;
          if (gridCell.type === "body") {
            lerpAmount = 1 - abs((gridCell.currentBodyLength - (gridCell.emptyFrame - snakeMoveFrame.value)) % (gridCell.snake.colorLength * 2) / gridCell.snake.colorLength - 1);
          }
          else {
            lerpAmount = 0;
          }

          let fillColor = lerpColor(playerColor1, playerColor2, lerpAmount);

          fill(fillColor);
          square(x * cellSize, y * cellSize, cellSize);

          if (gridCell.hasFood) {
            // Food digestion shadow
            fill(lerpColor(fillColor, color(0), 0.2));
            circle(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 2);
          }
  
          if (gridCell.type === "head") {
            // The snake's eyes
            let headX = x * cellSize + cellSize / 2;
            let headY = y * cellSize + cellSize / 2;
            let eyeSize = cellSize / 4;
  
            for (let eyeX = -1; eyeX <= 1; eyeX += 2) {
              for (let eyeY = -1; eyeY <= 1; eyeY += 2) {
                if (eyeX === gridCell.snake.xSpeed || eyeY === gridCell.snake.ySpeed) {
                  fill(COLORS.eye1);
                  circle(headX + eyeX * eyeSize, headY + eyeY * eyeSize, eyeSize);
                  fill(COLORS.eye2);
                  circle(headX + eyeX * eyeSize, headY + eyeY * eyeSize, eyeSize / 2);
                }
              }
            }
          }
        }
        else if (gridCell.type === "empty" || gridCell.type === "food") {
          // For an open cell, draw it with the empty cell colors, based on a checkerboard pattern
          if ((x + y) % 2 === 0) {
            fill(COLORS.empty1);
          }
          else {
            fill(COLORS.empty2);
          }
          square(x * cellSize, y * cellSize, cellSize);

          if (gridCell.type === "food") {
            // If there's food draw it as a circle
            fill(gridCell.color.r, gridCell.color.g, gridCell.color.b);
            circle(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 2);
          }
        }
        else if (gridCell.type === "wall") {
          // Color the wall cells using a checkerboard pattern
          if ((x + y) % 2 === 0) {
            fill(COLORS.wall1);
          }
          else {
            fill(COLORS.wall2);
          }
          square(x * cellSize, y * cellSize, cellSize);
        }
      }
      else {
        // Draw squares outside the map the same way as walls
        if ((x + y) % 2 === 0) {
          fill(COLORS.wall1);
        }
        else {
          fill(COLORS.wall2);
        }
        square(x * cellSize, y * cellSize, cellSize);
      }

    }
  }
  pop();
}

function drawInfo() {
  // Only draw the lobby screen if there's no active snake
  if (!snake.alive) {
    background(COLORS.lobbyBack);

    // Show the last and high scores if the dead snake isn't the initial placeholder one
    let infoText = "";
    if (snake.bodyLength === 0) {
      infoText = "Multiplayer Snake\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nPress SPACE or touch to join\nUse ↑←↓→ or WASD or touch sides to move";
    }
    else {
      infoText = "Multiplayer Snake\n\n\nYou died!\n\nLength: " + str(snake.bodyLength + 1) + "\nBest: " + str(bestLength + 1) + "\n\n\n\n\n\n\n\n\nPress SPACE or touch to join\nUse ↑←↓→ or WASD or touch sides to move";
    }
    
    // Draw the message centered in the canvas
    textAlign(CENTER, CENTER);
    textSize(width / camera.size * VIEW_LOBBY_SIZE * LOBBY_TEXT_SCALE);
    fill(COLORS.lobbyText);
    text(infoText, width / 2, height / 2);
  }
}

function generateGrid(size) {
  // Set noise settings for generating the walls
  noiseDetail(1, 0);

  // Make a new random grid the size of the map
  let newGrid = [];
  for (let y = 0; y < size; y++) {
    newGrid.push([]);
    for (let x = 0; x < size; x++) {
      // Add walls at both the lowest and highest noise values
      if (noise(x / MAP_GENERATION_SCALE, y / MAP_GENERATION_SCALE) < MAP_GENERATION_THRESHOLD || noise(x / MAP_GENERATION_SCALE, y / MAP_GENERATION_SCALE) > 1 - MAP_GENERATION_THRESHOLD) {
        newGrid[y].push(CELL_WALL);
      }
      else {
        newGrid[y].push(CELL_EMPTY);
      }
    }
  }
  return newGrid;
}

function newSnake() {
  // Prepare a new snake with random colors
  let startSnake = {
    alive: true,
    x: undefined,
    y: undefined,
    xSpeed: 0,
    ySpeed: 0,
    lastXSpeed: 0,
    lastYSpeed: 0,
    bodyLength: SNAKE_START_LENGTH,
    color1: {r: random(COLORS.snakeMin, COLORS.snakeMax), g: random(COLORS.snakeMin, COLORS.snakeMax), b: random(COLORS.snakeMin, COLORS.snakeMax)},
    color2: {r: random(COLORS.snakeMin, COLORS.snakeMax), g: random(COLORS.snakeMin, COLORS.snakeMax), b: random(COLORS.snakeMin, COLORS.snakeMax)},
    colorLength: floor(random(1, 5))
  };

  // Try to set the snake's spawn position, if no empty cell is found after most of the map is checked, don't start the new snake
  let attempts = 0;
  while (startSnake.x === undefined || startSnake.y === undefined || grid.value[startSnake.y][startSnake.x].type !== "empty") {
    startSnake.x = floor(random(MAP_SIZE));
    startSnake.y = floor(random(MAP_SIZE));

    attempts++;
    if (attempts >= MAP_SIZE * MAP_SIZE) {
      return;
    }
  }
  snake = startSnake;
}

function addRandomFood(amount) {
  // Add random food to the map based on amount parameter
  for (let i = 0; i < amount; i ++) {
    let foodX = undefined;
    let foodY = undefined;

    // Try to set the food position, if no empty cell is found after multiple locations are checked, don't add it
    let attempts = 0;
    while (foodX === undefined || foodY === undefined || grid.value[foodY][foodX].type !== "empty") {
      foodX = floor(random(MAP_SIZE));
      foodY = floor(random(MAP_SIZE));

      attempts++;
      if (attempts >= MAP_SIZE) {
        return;
      }
    }

    // Add a random food at the empty location
    grid.value[foodY][foodX] = {
      type: "food",
      color: {r: random(COLORS.snakeMin, COLORS.snakeMax), g: random(COLORS.snakeMin, COLORS.snakeMax), b: random(COLORS.snakeMin, COLORS.snakeMax)}
    };
  }
}