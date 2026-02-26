// Image demo

let pancakeImg;

function preLoad() {
  pancakeImg = loadImage("pancakes.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  image(CENTER);
}

function draw() {
  background(220);
  image(pancakeImg, pancakeImg.width / 2, mouseY, 100, 200);
}