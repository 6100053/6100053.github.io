// 2d Grid With Character Demo

const CELL_SIZE = 50;
const EMPTY_TILE = 0;
const WALL_TILE = 1;
const PLAYER_TILE = 5;
let gridRows;
let gridCols;
let grid;
let player = {
  x: 0,
  y: 0,
};
let pathImg;
let wallImg;

function preload() {
  pathImg = loadImage("path.jpg");
  wallImg = loadImage("wall.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  gridRows = floor(height / CELL_SIZE);
  gridCols = floor(width / CELL_SIZE);

  grid = randomGrid(gridCols, gridRows);

  grid[player.y][player.x] = PLAYER_TILE;
}

function draw() {
  background(255);
  drawGrid();
}

function randomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      if (random(100) < 25) {
        newGrid[y].push(WALL_TILE);
      }
      else {
        newGrid[y].push(EMPTY_TILE);
      }
    }
  }
  return newGrid;
}

function emptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(EMPTY_TILE);
    }
  }
  return newGrid;
}

function drawGrid() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let cell = grid[y][x];

      if (cell === EMPTY_TILE) {
        //fill(255);
        image(pathImg, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (cell === WALL_TILE) {
        //fill(0);
        image(wallImg, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === PLAYER_TILE) {
        fill(200, 0, 0);
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function mousePressed() {
  let cellX = floor(mouseX / CELL_SIZE);
  let cellY = floor(mouseY / CELL_SIZE);

  toggleCell(cellX, cellY);
}

function toggleCell(x, y) {
  if (y >= 0 && y < gridRows && x >= 0 && x < gridCols) {
    if (grid[y][x] === EMPTY_TILE) {
      grid[y][x] = WALL_TILE;
    }
    else if (grid[y][x] === WALL_TILE) {
      grid[y][x] = EMPTY_TILE;
    }
  }
}

function keyPressed() {
  if (key === "r") {
    grid = randomGrid(gridCols, gridRows);
    grid[player.y][player.x] = PLAYER_TILE;
  }
  else if (key === "e") {
    grid = emptyGrid(gridCols, gridRows);
    grid[player.y][player.x] = PLAYER_TILE;
  }
  else if (key === "s") {
    movePlayer(player.x, player.y + 1);
  }
  else if (key === "w") {
    movePlayer(player.x, player.y - 1);
  }
  else if (key === "d") {
    movePlayer(player.x + 1, player.y);
  }
  else if (key === "a") {
    movePlayer(player.x - 1, player.y);
  }
}

function movePlayer(x, y) {
  if (y >= 0 && y < gridRows && x >= 0 && x < gridCols && grid[y][x] === EMPTY_TILE) {
    grid[player.y][player.x] = EMPTY_TILE;

    player.x = x;
    player.y = y;
  
    grid[player.y][player.x] = PLAYER_TILE;
  }
}