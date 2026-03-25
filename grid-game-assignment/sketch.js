// 2d Grid Game Assignment
// Carsen Waters
// April 13 2026
//
// Extras for Experts:
// - PLACEHOLDER


const FRAME_MOD = 10;

const CELL_SIZE = 50;
const MAP_SIZE = 11;
const EMPTY_CELL = {type: "empty"};

const STARTER_PLAYER = {x: 5, y: 5, direction: "N", length: 3, color: {r: 0, g: 0, b: 0}};

let grid = emptyGrid(MAP_SIZE);
let players = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  addPlayer();
}

function draw() {
  if (frameCount % FRAME_MOD === 0) {
    updateCells();
    movePlayers();
  }

  background(255);
  drawGrid();
}

function updateCells() {
  for (let row of grid) {
    for (let cell of row) {
      if (cell.type === "body") {
        if (millis() > cell.time) {
          cell = EMPTY_CELL;
        }
      }
    }
  }
}

function movePlayers() {
  for (let player of players) {
    grid[player.y][player.x] = {type: "body", player: player, time: millis() + player.length * 1000};

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

    grid[player.y][player.x] = {type: "head", player: player};
  }
}

function drawGrid() {
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      let gridCell = grid[y][x];
      if (gridCell.type === "head" || gridCell.type === "body") {
        fill(gridCell.player.color.r, gridCell.player.color.g, gridCell.player.color.b);
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