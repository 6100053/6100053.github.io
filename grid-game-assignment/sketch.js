// 2d Grid Game Assignment
// Carsen Waters
// April ++ 2026
//
// Extras for Experts:
// - PLACEHOLDER

//COMMENTS

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_A = 65;
const KEY_D = 68;
const KEY_S = 83;
const KEY_W = 87;

const PLAYER_MOVE_TIME = 500;
let snakeMoveFrame = 0;

let cellSize;
const MAP_SIZE = 50;
const MAP_GENERATION_THRESHOLD = 0.15;
const MAP_GENERATION_SCALE = 10;
const VIEW_SIZE = 20;
const CAMERA_SPEED = 0.02;

const CELL_EMPTY = {type: "empty"};
const CELL_WALL = {type: "wall"};

const PLAYER_START_LENGTH = 10;

let grid;
let playerSnakes = [];
let snake;
let camera;

function setup() {
  let windowSize = min(windowWidth, windowHeight);
  cellSize = windowSize / VIEW_SIZE;
  createCanvas(windowSize, windowSize);
  noStroke();
  noiseDetail(1, 0);

  grid = generateGrid(MAP_SIZE);
  newPlayer();
  camera = {x: snake.x, y: snake.y, speed: CAMERA_SPEED};
}

function windowResized() {
  let windowSize = min(windowWidth, windowHeight);
  cellSize = windowSize / VIEW_SIZE;
  resizeCanvas(windowSize, windowSize);
}

function draw() {
  playerDirection();
  if (millis() > snakeMoveFrame * PLAYER_MOVE_TIME) {
    moveSnake();
    updateCells();
    snakeMoveFrame += 1;
  }
  
  moveCamera();
  drawGrid();
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
        if (snakeMoveFrame >= gridCell.emptyFrame || !gridCell.player.alive) {
          grid[y][x] = CELL_EMPTY;
        }
      }
    }
  }
}

function moveSnake() {
  if (snake.alive) {
    grid[snake.y][snake.x] = {type: "body", player: snake, emptyFrame: snakeMoveFrame + snake.length - 1};

    snake.x += snake.xSpeed;
    snake.y += snake.ySpeed;

    snake.lastXSpeed = snake.xSpeed;
    snake.lastYSpeed = snake.ySpeed;

    if (snake.xSpeed !== 0 || snake.ySpeed !== 0) {
      if (snake.y < 0 || snake.y >= grid.length || snake.x < 0 || snake.x >= grid[snake.y].length || grid[snake.y][snake.x].type === "wall" || grid[snake.y][snake.x].type === "body" && grid[snake.y][snake.x].emptyFrame > snakeMoveFrame) {
        snake.alive = false;
        newPlayer();
      }
      else {
        grid[snake.y][snake.x] = {type: "head", player: snake};
      }
    }
  }
}

function moveCamera() {
  camera.x += (snake.x - camera.x) * camera.speed;
  camera.y += (snake.y - camera.y) * camera.speed;
}

function drawGrid() {
  translate((-camera.x - 1/2 + VIEW_SIZE / 2) * cellSize, (-camera.y - 1/2 + VIEW_SIZE / 2) * cellSize);

  for (let y = round(camera.y) - ceil(VIEW_SIZE / 2); y <= round(camera.y) + ceil(VIEW_SIZE / 2); y++) {
    for (let x = round(camera.x) - ceil(VIEW_SIZE / 2); x <= round(camera.x) + ceil(VIEW_SIZE / 2); x++) {

      if (x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
        let gridCell = grid[y][x];

        if (gridCell.type === "head" || gridCell.type === "body") {
          let playerColor1 = color(gridCell.player.color1.r, gridCell.player.color1.g, gridCell.player.color1.b);
          let playerColor2 = color(gridCell.player.color2.r, gridCell.player.color2.g, gridCell.player.color2.b);

          let lerpAmount;
          if (gridCell.type === "body") {
            lerpAmount = 1 - abs((gridCell.player.length - (gridCell.emptyFrame - snakeMoveFrame) - 1) % (gridCell.player.colorLength * 2) / gridCell.player.colorLength - 1);
          }
          else {
            lerpAmount = 0;
          }

          let fillColor = lerpColor(playerColor1, playerColor2, lerpAmount);

          fill(fillColor);
          square(x * cellSize, y * cellSize, cellSize);
  
          if (gridCell.type === "head") {
            let headX = x * cellSize + cellSize / 2;
            let headY = y * cellSize + cellSize / 2;
            let eyeSize = cellSize / 4;
  
            for (let eyeX = -1; eyeX <= 1; eyeX += 2) {
              for (let eyeY = -1; eyeY <= 1; eyeY += 2) {
                if (eyeX === gridCell.player.xSpeed || eyeY === gridCell.player.ySpeed) {
                  fill(255);
                  circle(headX + eyeX * eyeSize, headY + eyeY * eyeSize, eyeSize);
                  fill(0);
                  circle(headX + eyeX * eyeSize, headY + eyeY * eyeSize, eyeSize / 2);
                }
              }
            }
          }
        }
        else if (gridCell.type === "wall") {
          if ((x + y) % 2 === 0) {
            fill(0);
          }
          else {
            fill(20);
          }
          square(x * cellSize, y * cellSize, cellSize);
        }
        else if (gridCell.type === "empty") {
          if ((x + y) % 2 === 0) {
            fill(220);
          }
          else {
            fill(240);
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

function newPlayer() {
  let startPlayer = {
    alive: true,
    name: undefined,
    x: undefined,
    y: undefined,
    xSpeed: 0,
    ySpeed: 0,
    lastXSpeed: 0,
    lastYSpeed: 0,
    length: PLAYER_START_LENGTH,
    color1: {r: random(200), g: random(200), b: random(200)},
    color2: {r: random(200), g: random(200), b: random(200)},
    colorLength: floor(random(1, 5))
  };
  startPlayer.name = "P" + str(floor(random(1000)));

  while (startPlayer.x === undefined || startPlayer.y === undefined || grid[startPlayer.y][startPlayer.x] !== CELL_EMPTY) {
    startPlayer.x = floor(random(MAP_SIZE));
    startPlayer.y = floor(random(MAP_SIZE));
  }

  playerSnakes.push(startPlayer);
  snake = startPlayer;
}