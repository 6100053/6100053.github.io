// Collide2d Library demo

let hit;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  hit = collideRectCircle(200, 200, 100, 150, mouseX, mouseY, 100);
  
  if (hit) {
    fill(100, 100, 200);
  }
  else {
    fill(100);
  }
  
  background(50);
  stroke(255);
  rect(200, 200, 100, 150);
  circle(mouseX, mouseY, 100);
}