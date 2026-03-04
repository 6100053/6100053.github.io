// Object Array Demo

let gravity = 0.5;
let bounce = 0.5;
let friction = 0.99;

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  noStroke();

  for (let ball of ballArray) {
    // Move and Bounce
    ball.dy += gravity;

    if (ball.y + ball.radius > height) {
      ball.y += ball.dy * (-1 + bounce);
      ball.dy *= -bounce;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    ball.dx *= friction;

    // Teleport if needed
    if (ball.x < 0 - ball.radius) {
      ball.x = width + ball.radius;
    }
    else if (ball.x > width + ball.radius) {
      ball.x = 0 - ball.radius;
    }

    // Display
    fill(ball.r, ball.g, ball.b);
    circle(ball.x, ball.y, ball.radius*2);
  }
}

function mousePressed() {
  for (i = 0; i <= 10; i++) {
    spawnBall(mouseX, mouseY);
  }
}

function spawnBall(_x, _y) {
  let theBall = {
    x: _x,
    y: _y,
    dx: random(-20, 20),
    dy: random(-20, 20),
    radius: random(5, 25),
    r: random(255),
    g: random(255),
    b: random(255),
  };
  ballArray.push(theBall);
}