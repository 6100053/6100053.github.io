// OOP Walker Demo

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.diameter = 5;
    this.speed = 5;
    this.color = "red";
  }

  display() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.diameter);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.x += this.speed;
    }
    else if (choice < 50) {
      this.x -= this.speed;
    }
    else if (choice < 75) {
      this.y += this.speed;
    }
    else {
      this.y -= this.speed;
    }
  }
}

let berry;
let herb;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
  berry = new Walker(width/2, height/2);
  herb = new Walker(width/4, height/2);
  herb.color = "blue";
}

function draw() {
  berry.move();
  herb.move();

  background(100, 10);
  berry.display();
  herb.display();
}
