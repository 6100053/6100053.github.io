// OOP Walker Demo

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.color = "blue";
  }

  display() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.speed);
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

let allWalkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(100);
}

function draw() {
  background(100, 10);
  for (let walker of allWalkers) {
    walker.move();
    walker.display();
  }
}

function mousePressed() {
  let walker = new Walker(mouseX, mouseY);
  walker.color = color(random(255), random(255), random(255));
  walker.speed = random(5, 10);
  allWalkers.push(walker);
}

// Version with 2 walkers

// let berry;
// let herb;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   background(100);
//   berry = new Walker(width/2, height/2);
//   herb = new Walker(width/4, height/2);
//   herb.color = "blue";
// }

// function draw() {
//   berry.move();
//   herb.move();

//   background(100, 10);
//   berry.display();
//   herb.display();
// }