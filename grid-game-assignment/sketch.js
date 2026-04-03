// 2d Grid Game Assignment
// Carsen Waters
// April 15 2026
//
// Extras for Experts:
// - PLACEHOLDER

//COMMENTS
//mobile support
//ask how many constants to make
//big foods?

const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_A = 65;
const KEY_D = 68;
const KEY_S = 83;
const KEY_W = 87;

const COLORS = {
  empty1: 220,
  empty2: 240,
  wall1: 0,
  wall2: 20,
  snakeMin: 50,
  snakeMax: 200,
  eye1: 255,
  eye2: 0,
};

const SNAKE_MOVE_TIME = 250;
let snakeMoveFrame = 0;

let cellSize;
const MAP_SIZE = 50;
const MAP_GENERATION_THRESHOLD = 0.15;
const MAP_GENERATION_SCALE = 10;
const VIEW_SIZE = 20;
const CAMERA_SPEED = 0.03;

const CELL_EMPTY = {type: "empty"};
const CELL_WALL = {type: "wall"};

const SNAKE_START_LENGTH = 3;

const START_FOOD = 25;
const FOOD_CHANCE_SPAWN = 0.2;
const FOOD_CHANCE_DEATH = 0.5;

let grid;
let playerSnakes = [];
let snake;
let camera;

function setup() {
  let windowSize = min(windowWidth, windowHeight);
  createCanvas(windowSize, windowSize);
  noStroke();
  noiseDetail(1, 0);

  grid = generateGrid(MAP_SIZE);
  snake = {alive: false, x: MAP_SIZE / 2, y: MAP_SIZE / 2};
  camera = {x: snake.x, y: snake.y, size: VIEW_SIZE, sizeTarget: VIEW_SIZE, speed: CAMERA_SPEED};
  addRandomFood(START_FOOD);
}

function windowResized() {
  let windowSize = min(windowWidth, windowHeight);
  resizeCanvas(windowSize, windowSize);
}

function draw() {
  playerDirection();
  if (!snake.alive && keyIsDown(KEY_SPACE)) {
    newSnake();
  }
  if (millis() > snakeMoveFrame * SNAKE_MOVE_TIME) {
    moveSnake();
    updateCells();
    if (random() < FOOD_CHANCE_SPAWN) {
      addRandomFood(1);
    }
    snakeMoveFrame += 1;
  }
  
  moveCamera();
  drawGrid();
  drawInfo();
}

function playerDirection() {
  if (!snake.alive) {
    snake.xSpeed = 0;
    snake.ySpeed = 0;
  }
  else if ((keyIsDown(KEY_UP) || keyIsDown(KEY_W)) && snake.lastYSpeed < 1) {
    snake.xSpeed = 0;
    snake.ySpeed = -1;
  }
  else if ((keyIsDown(KEY_DOWN) || keyIsDown(KEY_S)) && snake.lastYSpeed > -1) {
    snake.xSpeed = 0;
    snake.ySpeed = 1;
  }
  else if ((keyIsDown(KEY_LEFT) || keyIsDown(KEY_A)) && snake.lastXSpeed < 1) {
    snake.xSpeed = -1;
    snake.ySpeed = 0;
  }
  else if ((keyIsDown(KEY_RIGHT) || keyIsDown(KEY_D)) && snake.lastXSpeed > -1) {
    snake.xSpeed = 1;
    snake.ySpeed = 0;
  }
}

function updateCells() {
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      let gridCell = grid[y][x];
      if (gridCell.type === "body") {
        if (snakeMoveFrame >= gridCell.emptyFrame || !gridCell.snake.alive) {
          grid[y][x] = CELL_EMPTY;

          if (!gridCell.snake.alive && random() < FOOD_CHANCE_DEATH) {
            grid[y][x] = {type: "food", color: {r: random(COLORS.snakeMin, COLORS.snakeMax), g: random(COLORS.snakeMin, COLORS.snakeMax), b: random(COLORS.snakeMin, COLORS.snakeMax)}};
          }
        }
      }
    }
  }
}

function moveSnake() {
  if (snake.alive) {
    grid[snake.y][snake.x] = {type: "body", snake: snake, emptyFrame: snakeMoveFrame + snake.bodyLength, currentBodyLength: structuredClone(snake.bodyLength), hasFood: grid[snake.y][snake.x].hasFood};

    snake.x += snake.xSpeed;
    snake.y += snake.ySpeed;

    snake.lastXSpeed = snake.xSpeed;
    snake.lastYSpeed = snake.ySpeed;

    if (snake.xSpeed !== 0 || snake.ySpeed !== 0) {
      if (snake.y < 0 || snake.y >= grid.length || snake.x < 0 || snake.x >= grid[snake.y].length || grid[snake.y][snake.x].type === "wall" || grid[snake.y][snake.x].type === "body" && grid[snake.y][snake.x].emptyFrame > snakeMoveFrame) {
        snake.alive = false;
      }
      else {
        let bodyHasFood = false;
        if (grid[snake.y][snake.x].type === "food") {
          bodyHasFood = true;
          snake.bodyLength += 1;
        }

        grid[snake.y][snake.x] = {type: "head", snake: snake, hasFood: bodyHasFood};
      }
    }
  }
}

function moveCamera() {
  if (snake.alive) {
    camera.sizeTarget = VIEW_SIZE;
  }
  else {
    camera.sizeTarget = VIEW_SIZE * 1.5;
  }

  camera.x += (snake.x - camera.x) * camera.speed;
  camera.y += (snake.y - camera.y) * camera.speed;
  camera.size += (camera.sizeTarget - camera.size) * camera.speed;

  cellSize = width / camera.size;
}

function drawGrid() {
  push();
  translate((-camera.x - 1/2 + camera.size / 2) * cellSize, (-camera.y - 1/2 + camera.size / 2) * cellSize);

  for (let y = round(camera.y) - ceil(camera.size / 2); y <= round(camera.y) + ceil(camera.size / 2); y++) {
    for (let x = round(camera.x) - ceil(camera.size / 2); x <= round(camera.x) + ceil(camera.size / 2); x++) {

      if (x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
        let gridCell = grid[y][x];

        if (gridCell.type === "head" || gridCell.type === "body") {
          let playerColor1 = color(gridCell.snake.color1.r, gridCell.snake.color1.g, gridCell.snake.color1.b);
          let playerColor2 = color(gridCell.snake.color2.r, gridCell.snake.color2.g, gridCell.snake.color2.b);

          let lerpAmount;
          if (gridCell.type === "body") {
            lerpAmount = 1 - abs((gridCell.currentBodyLength - (gridCell.emptyFrame - snakeMoveFrame)) % (gridCell.snake.colorLength * 2) / gridCell.snake.colorLength - 1);
          }
          else {
            lerpAmount = 0;
          }

          let fillColor = lerpColor(playerColor1, playerColor2, lerpAmount);

          fill(fillColor);
          square(x * cellSize, y * cellSize, cellSize);

          if (gridCell.hasFood) {
            fill(lerpColor(fillColor, color(0), 0.2));
            circle(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 2);
          }
  
          if (gridCell.type === "head") {
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
        else if (gridCell.type === "food") {
          if ((x + y) % 2 === 0) {
            fill(COLORS.empty1);
          }
          else {
            fill(COLORS.empty2);
          }
          square(x * cellSize, y * cellSize, cellSize);

          fill(gridCell.color.r, gridCell.color.g, gridCell.color.b);
          circle(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 2);
        }
        else if (gridCell.type === "wall") {
          if ((x + y) % 2 === 0) {
            fill(COLORS.wall1);
          }
          else {
            fill(COLORS.wall2);
          }
          square(x * cellSize, y * cellSize, cellSize);
        }
        else if (gridCell.type === "empty") {
          if ((x + y) % 2 === 0) {
            fill(COLORS.empty1);
          }
          else {
            fill(COLORS.empty2);
          }
          square(x * cellSize, y * cellSize, cellSize);
        }

      }
      else {
        fill(50);
        square(x * cellSize, y * cellSize, cellSize);
      }

    }
  }
  pop();
}

function drawInfo() {
  if (!snake.alive) {
    background(255, 255, 255, 100);
    textAlign(CENTER, CENTER);
    textSize(cellSize * 1.75);
    fill(0);
    text("Multiplayer Snake\n\n\n\n\n\n\n\n\n\nPress SPACE to join\nUse ↑←↓→ or WASD to move", width / 2, height / 2);
  }
}

function generateGrid(size) {
  let newGrid = [];
  for (let y = 0; y < size; y++) {
    newGrid.push([]);
    for (let x = 0; x < size; x++) {
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

  let attempts = 0;
  while (startSnake.x === undefined || startSnake.y === undefined || grid[startSnake.y][startSnake.x] !== CELL_EMPTY) {
    startSnake.x = floor(random(MAP_SIZE));
    startSnake.y = floor(random(MAP_SIZE));

    attempts++;
    if (attempts >= MAP_SIZE * MAP_SIZE) {
      return;
    }
  }
  
  playerSnakes.push(startSnake);
  snake = startSnake;
}

function addRandomFood(amount) {
  for (let i = 0; i < amount; i ++) {
    let foodX = undefined;
    let foodY = undefined;
    
    let attempts = 0;
    while (foodX === undefined || foodY === undefined || grid[foodY][foodX] !== CELL_EMPTY) {
      foodX = floor(random(MAP_SIZE));
      foodY = floor(random(MAP_SIZE));

      attempts++;
      if (attempts >= MAP_SIZE) {
        return;
      }
    }

    grid[foodY][foodX] = {type: "food", color: {r: random(COLORS.snakeMin, COLORS.snakeMax), g: random(COLORS.snakeMin, COLORS.snakeMax), b: random(COLORS.snakeMin, COLORS.snakeMax)}};
  }
}