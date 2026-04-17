// OOP Ball Collision Demo

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.rad = random(20, 50);
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, this.rad*2);
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.y - this.rad < 0 || this.y + this.rad > height) {
      this.dy *= -1;
    }

    if (this.x - this.rad < 0 || this.x + this.rad > width) {
      this.dx *= -1;
    }
  }

  collide(otherBall) {
    let radiiSum = this.rad + otherBall.rad;
    let distApart = dist(this.x, this.y, otherBall.x, otherBall.y);

    if (radiiSum > distApart) {
      let oldDX = this.dx;
      let oldDY = this.dy;

      this.dx = otherBall.dx;
      this.dy = otherBall.dy;

      otherBall.dx = oldDX;
      otherBall.dy = oldDY;
    }
  }
}

let allBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  for (let ball of allBalls) {
    ball.move();
    for (let otherBall of allBalls) {
      if (ball !== otherBall) {
        ball.collide(otherBall);
      }
    }
    ball.display();
  }
}

function mousePressed() {
  let newBall = new Ball(mouseX, mouseY);
  allBalls.push(newBall);
}