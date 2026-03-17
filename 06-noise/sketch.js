// Perlin Noise Demo

let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255, 255, 255, 2);

  fill(0);

  let x = noise(time) * width;
  let y = noise(time + 1000) * height;

  circle(x, y, 5);

  time += 0.01;
}