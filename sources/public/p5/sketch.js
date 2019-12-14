let cols = 10;
let rows = 10;
let matrix = new Array(cols);
let w, h;
let openSet = [];
let closedSet = [];
let start, end;

function Spot(i, j) {
  this.x = i;
  this.y = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.show = function(color) {
    fill(color);
    noStroke();
    rect(this.x * w, this.y * h, w - 1, h - 1);
  }
}

function setup() {
  createCanvas(400, 400);
  console.log('Creating canvas and init matrix');
  w = width / cols;
  h = height / rows;

  for (let index = 0; index < matrix.length; index++) {
    matrix[index] = new Array(rows);
  }

  for (let i = 0; i < cols; i++){
    for (let j = 0; j < cols; j++){
      matrix[i][j] = new Spot(i, j);
    }
  }

  start = matrix[0][0];
  end = matrix[cols - 1][rows - 1];
  openSet.push(start);


  console.log(matrix);
}

function draw() {
  if (openSet.length > 0) {

  }
  else {
    console.log('No solution');
  }
  background(0);
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      matrix[i][j].show(color(255));
    }
  }

  for (let i = 0; i < openSet.length; i++){
    openSet[i].show(color(255, 0, 0));
  }

  for (let i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(255, 0, 0));
  }
}
