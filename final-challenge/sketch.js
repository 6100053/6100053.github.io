// CSC30 Final Programming Challenge
// Carsen Waters
// June 18 2026
//
// Extras for Experts:
// checkIfPointInsideBall method in Ball class
// When a ball is spawned with a key press, the name of the key is displayed on the ball
// Balls fall with gravity, and lose speed on edge bounces


const START_BALLS = 5;
const START_BALL_NAMES = ["Ball", "Type", "Keys", "Press", "Bounce"];
const BALL_SPEED = 5;
const BALL_RADIUS = 30;
const BALL_STROKE = 3;
const Y_GRAVITY = 0.025;
const BALL_BOUNCINESS = 0.9;

let allBalls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Spawn 5 starting balls
  for (let i = 0; i < START_BALLS; i++) {
    addBall(START_BALL_NAMES[i]);
  }
}

function draw() {
  background(0);

  // Move and display all the balls
  for (let ball of allBalls) {
    ball.move();
    ball.display();
  }
}

function keyPressed() {
  // Add a ball with the name of the key that was pressed
  addBall(key);
}

function mousePressed() {
  // When the mouse is clicked, delete any balls that are touching it
  for (let i = allBalls.length - 1; i >= 0; i--) {
    if (allBalls[i].checkIfPointInsideBall(mouseX, mouseY)) {
      allBalls.splice(i, 1);
    }
  }
}

function addBall(name) {
  // Add a new ball at a random location
  let newBall = new Ball(random(0 + BALL_RADIUS, width - BALL_RADIUS), random(0 + BALL_RADIUS, height - BALL_RADIUS), name);
  allBalls.push(newBall);
}

class Ball {
  constructor(x, y, name) {
    this.x = x;
    this.y = y;
    this.dx = random(-BALL_SPEED, BALL_SPEED);
    this.dy = random(-BALL_SPEED, BALL_SPEED);
    this.radius = BALL_RADIUS;
    this.name = name;
  }

  move() {
    // Move the ball according to its speed
    this.x += this.dx;
    this.y += this.dy;

    // Add gravity influence to y speed
    this.dy += Y_GRAVITY;

    // Bounce off edges
    if (this.x - this.radius < 0 || this.x + this.radius > width) {
      this.x -= this.dx;
      this.dx *= -BALL_BOUNCINESS;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > height) {
      this.y -= this.dy;
      this.dy *= -BALL_BOUNCINESS;
    }
  }

  display() {
    // Draw the ball as a circle
    strokeWeight(BALL_STROKE);
    stroke(255);
    fill(0);
    circle(this.x, this.y, this.radius * 2 - BALL_STROKE);
    
    // Draw the name of the ball as text
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(this.radius / sqrt(this.name.length));
    text(this.name, this.x, this.y);
  }

  checkIfPointInsideBall(x, y) {
    // Return true if the point is inside the ball
    return dist(this.x, this.y, x, y) < this.radius;
  }
}