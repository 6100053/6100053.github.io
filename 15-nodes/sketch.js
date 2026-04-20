// Connected Nodes OOP Demo

let allNodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  for (let node of allNodes) {
    node.update();
    node.connectTo(allNodes);
  }
  for (let node of allNodes) {
    node.display();
  }
}

function mousePressed() {
  let newNode = new movingNode(mouseX, mouseY);
  allNodes.push(newNode);
}

class movingNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.maxRadius = 35;
    this.minRadius = 15;
    this.color = color(random(225), random(225), random(225));
    this.xTime = random(1000);
    this.yTime = random(1000, 2000);
    this.speed = 10;
    this.deltaTime = 0.05;
    this.reach = 200;
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius*2);
  }

  update() {
    this.move();
    this.screenWrap();
    this.sizeMouse();
  }

  move() {
    let dx = noise(this.xTime);
    let dy = noise(this.yTime);

    dx = map(dx, 0, 1, -this.speed, this.speed);
    dy = map(dy, 0, 1, -this.speed, this.speed);

    this.x += dx;
    this.y += dy;

    this.xTime += this.deltaTime;
    this.yTime += this.deltaTime;
  }

  screenWrap() {
    if (this.x + this.radius < 0) {
      this.x += width + this.radius*2;
    }
    if (this.x - this.radius > width) {
      this.x -= width + this.radius*2;
    }
    if (this.y + this.radius < 0) {
      this.y += height + this.radius*2;
    }
    if (this.y - this.radius> height) {
      this.y -= height + this.radius*2;
    }
  }

  connectTo(nodeArray) {
    for (let otherNode of nodeArray) {
      if (this !== otherNode) {
        let distApart = dist(this.x, this.y, otherNode.x, otherNode.y);
        if (distApart < this.reach) {
          stroke(0);
          strokeWeight((this.reach - distApart) / 10);
          line(this.x, this.y, otherNode.x, otherNode.y);
        }
      }
    }
  }

  sizeMouse() {
    let mouseDist = dist(this.x, this.y, mouseX, mouseY);
    if (mouseDist < this.reach) {
      let newSize = map(mouseDist, 0, this.reach, this.maxRadius, this.minRadius);
      this.radius = newSize;
    }
    else {
      this.radius = this.minRadius;
    }
  }
}