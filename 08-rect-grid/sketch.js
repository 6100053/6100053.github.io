// 2d Rectangular Grid Demo

const CELL_SIZE = 50;
let gridRows;
let gridCols;
let grid;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  gridRows = floor(height / CELL_SIZE);
  gridCols = floor(width / CELL_SIZE);

  grid = randomGrid(gridCols, gridRows);
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
      if (random(100) < 50) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
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
      newGrid[y].push(1);
    }
  }
  return newGrid;
}

function drawGrid() {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let cell = grid[y][x];

      if (cell === 0) {
        fill(0);
      }
      else if (cell === 1) {
        fill(255);
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function mousePressed() {
  let cellX = floor(mouseX / CELL_SIZE);
  let cellY = floor(mouseY / CELL_SIZE);

  toggleCell(cellX, cellY);
  toggleCell(cellX + 1, cellY);
  toggleCell(cellX - 1, cellY);
  toggleCell(cellX, cellY + 1);
  toggleCell(cellX, cellY - 1);
}

function toggleCell(x, y) {
  if (y >= 0 && y < gridRows && x >= 0 && x < gridCols) {
    if (grid[y][x] === 0) {
      grid[y][x] = 1;
    }
    else if (grid[y][x] === 1) {
      grid[y][x] = 0;
    }
  }
}

function keyPressed() {
  if (key === "r") {
    grid = randomGrid(gridCols, gridRows);
  }
  else if (key === "e") {
    grid = emptyGrid(gridCols, gridRows);
  }
}