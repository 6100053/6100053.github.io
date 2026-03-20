// 2d Grid Game Assignment
// Carsen Waters
// April 13 2026
//
// Extras for Experts:
// - PLACEHOLDER


const CELL_SIZE = 50;
const MAP_SIZE = 10;
let grid = emptyGrid(MAP_SIZE);

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);
}

function emptyGrid() {
  let newGrid = [];
  for (let y = 0; y < MAP_SIZE; y++) {
    newGrid.push([]);
    for (let x = 0; x < MAP_SIZE; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}