// 2d Grid Game Assignment
// Carsen Waters
// April 13 2026
//
// Extras for Experts:
// - PLACEHOLDER


const CELL_SIZE = 50;
const MAP_SIZE = 10;
const EMPTY_CELL = {type: "empty"};

const STARTER_PLAYER = {x: 0, y: 0, direction: "N", length: 3, color: {r: 0, g: 0, b: 0}};

let grid = emptyGrid(MAP_SIZE);
let players = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  addPlayer();
}

function draw() {
  updateCells();
  movePlayers();

  background(255);
  drawGrid();
}

function updateCells() {
  for (let row of grid) {
    for (let cell of row) {
      if (cell.type !== "empty") {
        if (millis() > cell.content.time) {
          cell = EMPTY_CELL;
        }
      }
    }
  }
}

function movePlayers() {
  for (let player of players) {
    if (player.direction === "N") {
      player.y -= 1;
    }
    else if (player.direction === "S") {
      player.y += 1;
    }
    else if (player.direction === "E") {
      player.x += 1;
    }
    else if (player.direction === "W") {
      player.x -= 1;
    }

    //Collision/interaction placeholder

    grid[player.y][player.x] = {type: "body", time: millis() + player.length * 1000};//add plyer reference
  }
}

function drawGrid() {
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      gridContent = grid[y][x].content;
      if (grid[y][x].type === "player") {
        //fill(.r, .g, .b);
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
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
  let newPlayer = STARTER_PLAYER;//CLONE???????????????????
  newPlayer.color.r = random(255);
  newPlayer.color.g = random(255);
  newPlayer.color.b = random(255);
  players.push(newPlayer);
}