// OOP Fireworks Demo

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 2;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.a = 255;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.a);
    circle(this.x, this.y, this.radius*2);
  }

  update() {
    this.dy += 0.2;

    this.x += this.dx;
    this.y += this.dy;

    this.a -= 1;
  }
}

let allFireworks = [];
const CLICK_PARTICLES = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  for (let firework of allFireworks) {
    firework.update();
    firework.display();
  }
}

function mousePressed() {
  for (let i = 0; i < CLICK_PARTICLES; i++) {
    let newFirework = new Particle(mouseX, mouseY);
    allFireworks.push(newFirework);
  }
}