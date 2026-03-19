// 2d Arrays Demo

let grid = [
  [1, 0, 0, 0],
  [1, 0, 1, 0],
  [0, 1, 0, 0],
  [0, 1, 1, 1]];

const GRID_SIZE = grid.length;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cellSize = min(width, height) / GRID_SIZE;
}

function draw() {
  background(255);
  noStroke();
  showGrid();
}

function showGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
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

  let clickedCell = grid[cellY][cellX];

  if (clickedCell === 0) {
    clickedCell = 1;
  }
  else if (clickedCell === 1) {
    clickedCell = 0;
  }
}