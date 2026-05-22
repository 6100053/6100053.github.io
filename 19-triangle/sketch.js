// Recursive Triangles Demo (Sierpinski Triangle)

let startTriangle;
let fractalDepth = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  startTriangle = [
    {x: width/2, y: 100},
    {x: 100, y: height-100},
    {x: width-100, y: height-100},
  ];

  background(0);
  fractalTriangle(startTriangle, fractalDepth);
}

function draw() {
}

function fractalTriangle(points, depth) {
  noStroke();
  colorMode(HSB);
  fill(depth*36, 75, 75);
  triangle(
    points[0].x, points[0].y,
    points[1].x, points[1].y,
    points[2].x, points[2].y
  );

  if (depth > 0) {
    fractalTriangle(
      [
        points[0],
        midpoint(points[0], points[1]),
        midpoint(points[0], points[2]),
      ],
      depth - 1
    );
    fractalTriangle(
      [
        midpoint(points[0], points[1]),
        points[1],
        midpoint(points[1], points[2]),
      ],
      depth - 1
    );
    fractalTriangle(
      [
        midpoint(points[0], points[2]),
        midpoint(points[1], points[2]),
        points[2],
      ],
      depth - 1
    );
  }
}

function midpoint(point1, point2) {
  let midX = (point1.x + point2.x) / 2;
  let midY = (point1.y + point2.y) / 2;

  return {x: midX, y: midY};
}

function mousePressed() {
  if (fractalDepth < 10) {
    fractalDepth++;
    background(0);
    fractalTriangle(startTriangle, fractalDepth);
  }
}