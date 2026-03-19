// 2d Arrays Demo

// // Use to hard-code the grid
// let grid = [
//   [1, 0, 0, 0],
//   [1, 0, 1, 0],
//   [0, 1, 0, 0],
//   [0, 1, 1, 1]
// ];

// Use for random grid
const GRID_DIMENSIONS = 10;
let grid;

let gridSize;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = randomGrid(GRID_DIMENSIONS, GRID_DIMENSIONS);

  gridSize = grid.length;
  
  cellSize = min(width, height) / gridSize;
}

function draw() {
  background(255);
  noStroke();
  showGrid();
}

function showGrid() {
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x] === 0) {
        fill(255);
      }
      else if (grid[y][x] === 1) {
        fill(0);
      }

      square(x * cellSize, y * cellSize, cellSize);
    }
  }
}

function mousePressed() {
  let cellX = floor(mouseX / cellSize);
  let cellY = floor(mouseY / cellSize);

  toggleCell(cellX, cellY);

  
}

function toggleCell(x, y) {
  if (grid[y][x] === 0) {
    grid[y][x] = 1;
  }
  else if (grid[y][x] === 1) {
    grid[y][x] = 0;
  }
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