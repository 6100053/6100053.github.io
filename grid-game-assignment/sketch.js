// 2d Grid Game Assignment
// Carsen Waters
// April 13 2026
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
let playerMoveFrame = 0;

let cellSize;
const MAP_SIZE = 30;
const VIEW_SIZE = 15;
const CAMERA_SPEED = 0.02;

const EMPTY_CELL = {type: "empty"};

let grid;
let player;
let camera;

function setup() {
  let windowSize = min(windowWidth, windowHeight);
  cellSize = windowSize / VIEW_SIZE;
  createCanvas(windowSize, windowSize);
  noStroke();

  grid = emptyGrid(MAP_SIZE);
  player = newPlayer();
  camera = {x: player.x, y: player.y, speed: CAMERA_SPEED};
}

function windowResized() {
  let windowSize = min(windowWidth, windowHeight);
  cellSize = windowSize / VIEW_SIZE;
  resizeCanvas(windowSize, windowSize);
}

function draw() {
  playerDirection();
  if (millis() > playerMoveFrame * PLAYER_MOVE_TIME) {
    movePlayer();
    updateCells();
    playerMoveFrame += 1;
  }
  
  moveCamera();
  drawGrid();
}

function playerDirection() {
  if (keyIsDown(KEY_UP) || keyIsDown(KEY_W)) {
    player.xSpeed = 0;
    player.ySpeed = -1;
  }
  else if (keyIsDown(KEY_DOWN) || keyIsDown(KEY_S)) {
    player.xSpeed = 0;
    player.ySpeed = 1;
  }
  else if (keyIsDown(KEY_RIGHT) || keyIsDown(KEY_D)) {
    player.xSpeed = 1;
    player.ySpeed = 0;
  }
  else if (keyIsDown(KEY_LEFT) || keyIsDown(KEY_A)) {
    player.xSpeed = -1;
    player.ySpeed = 0;
  }
}

function updateCells() {
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      let gridCell = grid[y][x];
      if (gridCell.type === "body") {
        if (playerMoveFrame >= gridCell.emptyFrame) {
          grid[y][x] = EMPTY_CELL;
        }
      }
    }
  }
}

function movePlayer() {
  grid[player.y][player.x] = {type: "body", player: player, emptyFrame: playerMoveFrame + player.length - 1};

  player.x += player.xSpeed;
  player.y += player.ySpeed;

  //Collision/interaction placeholder

  grid[player.y][player.x] = {type: "head", player: player};
}

function moveCamera() {
  camera.x += (player.x - camera.x) * camera.speed;
  camera.y += (player.y - camera.y) * camera.speed;
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
            lerpAmount = abs((gridCell.player.length - (gridCell.emptyFrame - playerMoveFrame)) % (gridCell.player.colorLength * 2) / gridCell.player.colorLength - 1);
          }
          else {
            lerpAmount = abs((gridCell.player.length - (playerMoveFrame + gridCell.player.length - playerMoveFrame)) % (gridCell.player.colorLength * 2) / gridCell.player.colorLength - 1);
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

function emptyGrid(size) {
  let newGrid = [];
  for (let y = 0; y < size; y++) {
    newGrid.push([]);
    for (let x = 0; x < size; x++) {
      newGrid[y].push(EMPTY_CELL);
    }
  }
  return newGrid;
}

function newPlayer() {
  let startPlayer = {x: 0, y: 0, xSpeed: 0, ySpeed: 0, length: 10, color1: {r: 200, g: 0, b: 0}, color2: {r: 0, g: 200, b: 0}, colorLength: 3};
  startPlayer.x = floor(random(MAP_SIZE));
  startPlayer.y = floor(random(MAP_SIZE));
  // startPlayer.color1.r = random(200);
  // startPlayer.color1.g = random(200);
  // startPlayer.color1.b = random(200);
  // startPlayer.color2.r = random(200);
  // startPlayer.color2.g = random(200);
  // startPlayer.color2.b = random(200);

  return startPlayer;
}