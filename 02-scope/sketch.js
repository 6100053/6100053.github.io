// In-class scope demo

// Global variable
let number = 80;

function setup() {
  createCanvas(700, 400);
  background(0);
  stroke(255);
  noLoop();
}

function draw() {
  // number = 50;
  line(number, 0, number, height);
  
  for (let number = 120; number < 200; number += 5) {
    line(number, 0, number, height);
    // console.log(number);
  }

  drawAnotherLine();
  drawYetOneMoreLine();
}

function drawAnotherLine() {
  let number = 320;
  line(number, 0, number, height);
}

function drawYetOneMoreLine() {
  line(number + 5, 0, number + 5, height);
}