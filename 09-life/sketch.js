// Conway's Game of Life Demo

const CELL_SIZE = 10;
const FRAME_MULTIPLE = 5;
let gridRows;
let gridCols;
let grid;
let autoPlay = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  gridRows = floor(height / CELL_SIZE);
  gridCols = floor(width / CELL_SIZE);

  grid = randomGrid(gridCols, gridRows);
}

function draw() {
  background(255);
  
  if (autoPlay && frameCount % FRAME_MULTIPLE === 0) {
    grid = updateGrid();
  }

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
      newGrid[y].push(0);
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
  else if (key === " ") {
    autoPlay = !autoPlay;
  }
}

function updateGrid() {
  let nextGrid = emptyGrid(gridCols, gridRows);

  for (let x = 0; x < gridCols; x++) {
    for (let y = 0; y < gridRows; y++) {

      let neighbours = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (x + i >= 0 && x + i < gridCols && y + j >= 0 && y + j < gridRows) {
            neighbours += grid[y + j][x + i];
          }
        }
      }
      neighbours -= grid[y][x];

      if (grid[y][x] === 0) {
        if (neighbours === 3) {
          nextGrid[y][x] = 1;
        } 
      }
      else if (grid[y][x] === 1) {
        if (neighbours === 2 || neighbours === 3) {
          nextGrid[y][x] = 1;
        }
      }
    }
  }

  return nextGrid;
}