// Tiles array object demo

let allTiles = [];
const THE_SIZE = 25;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(0);
  strokeWeight(5);

  for (x = THE_SIZE/2; x <= width; x += THE_SIZE) {
    for (y = THE_SIZE/2; y <= height; y += THE_SIZE) {
      let someTile = spawnTile(x, y, THE_SIZE);
      allTiles.push(someTile);
    }
  }
}

function draw() {
  background(150);

  for (let tile of allTiles) {
    line(tile.x1, tile.y1, tile.x2, tile.y2);
  }
}

function spawnTile(x, y, tileSize) {
  let choice = random(100);
  let tile;
  if (choice < 50) {
    tile = {
      x1: x - tileSize/2,
      y1: y + tileSize/2,
      x2: x + tileSize/2,
      y2: y - tileSize/2,
    };
  }
  else {
    tile = {
      x1: x - tileSize/2,
      y1: y - tileSize/2,
      x2: x + tileSize/2,
      y2: y + tileSize/2,
    };
  }
  return tile;
}