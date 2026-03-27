// 2d Grid Game Assignment
// Carsen Waters
// April 13 2026
//
// Extras for Experts:
// - PLACEHOLDER

//COMMENTS

//MUST FIX why the Tail is not disspeairng???

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_A = 65;
const KEY_D = 68;
const KEY_S = 83;
const KEY_W = 87;

const FRAME_MOD = 10;

let cellSize;
const MAP_SIZE = 11;
const VIEW_SIZE = 11;

const EMPTY_CELL = {type: "empty"};
const STARTER_PLAYER = {x: 0, y: 0, xSpeed: 0, ySpeed: -1, length: 3, color: {r: 0, g: 0, b: 0}};

let grid = emptyGrid(MAP_SIZE);
let player;

function setup() {
  let windowSize = min(windowWidth, windowHeight);
  cellSize = windowSize / VIEW_SIZE;
  createCanvas(windowSize, windowSize);
  noStroke();

  addPlayer();
}

function windowResized() {
  let windowSize = min(windowWidth, windowHeight);
  cellSize = windowSize / VIEW_SIZE;
  resizeCanvas(windowSize, windowSize);
}

function draw() {
  playerDirection();
  if (frameCount % FRAME_MOD === 0) {
    updateCells();
    movePlayers();
  }

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
  for (let row of grid) {
    for (let cell of row) {
      if (cell.type === "body") {
        cell.age += 1;
        if (cell.age > cell.player.length) {
          cell = EMPTY_CELL;//clone???
        }
      }
    }
  }
}

function movePlayers() {
  grid[player.y][player.x] = {type: "body", player: player, age: 0};

  player.x = (player.x + player.xSpeed + MAP_SIZE) % MAP_SIZE;
  player.y = (player.y + player.ySpeed + MAP_SIZE) % MAP_SIZE;

  //Collision/interaction placeholder

  grid[player.y][player.x] = {type: "head", player: player};
}

function drawGrid() {
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      let gridCell = grid[y][x];
      if (gridCell.type === "head" || gridCell.type === "body") {
        fill(gridCell.player.color.r, gridCell.player.color.g, gridCell.player.color.b);
      }
      else if (gridCell.type === "empty") {
        if ((x + y) % 2 === 0) {
          fill(220);
        }
        else {
          fill(240);
        }
      }
      square(x * cellSize, y * cellSize, cellSize);
      if (gridCell.type === "head") {
        fill(255);
        circle(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, cellSize / 2);//change
      }
    }
  }
}

function emptyGrid() {
  let newGrid = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    newGrid.push([]);
    for (let x = 0; x < MAP_SIZE; x++) {
      newGrid[y].push(EMPTY_CELL);
    }
  }
  return newGrid;
}

function addPlayer() {
  let newPlayer = structuredClone(STARTER_PLAYER);
  newPlayer.x = floor(random(MAP_SIZE));
  newPlayer.y = floor(random(MAP_SIZE));
  newPlayer.color.r = random(200);
  newPlayer.color.g = random(200);
  newPlayer.color.b = random(200);
  player = newPlayer;

  grid[player.y][player.x] = {type: "head", player: player};
}