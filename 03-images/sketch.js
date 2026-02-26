// Image demo

let pancakeImg;

function preload() {
  pancakeImg = loadImage("pancakes.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background(220);
  image(pancakeImg, mouseX, mouseY, pancakeImg.width/2, pancakeImg.height/2);
}