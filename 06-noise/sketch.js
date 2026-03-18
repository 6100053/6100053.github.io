// Perlin Noise Demo

let time = 0;

let px;
let py;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255, 255, 255, 2);

  stroke(0);
  strokeWeight(5);

  

  let x = noise(time) * width;
  let y = noise(time + 1000) * height;

  line(x, y, px, py);

  px = structuredClone(x);
  py = structuredClone(y);

  time += 0.01;
}