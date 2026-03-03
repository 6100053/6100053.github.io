// Object Array Demo

let gravity = 0.5;

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  noStroke();
  fill(255);

  for (let ball of ballArray) {
    // Move and Bounce
    ball.dy += gravity;

    if (ball.x - ball.radius < 0 || ball.x + ball.radius > width) {
      ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > height) {
      ball.dy *= -1;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Display
    circle(ball.x, ball.y, ball.radius*2);
  }
}

function mousePressed() {
  spawnBall();
}

function spawnBall() {
  let theBall = {
    x: random(100, width - 100),
    y: random(100, height - 100),
    dx: random(-20, 20),
    dy: random(-5, 5),
    radius: random(10, 40),
  };
  ballArray.push(theBall);
}