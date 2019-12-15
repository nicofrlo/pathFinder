let cols = 30;
let rows = 30;

let matrix = new Array(cols);
let w, h;
let openSet = [];
let closedSet = [];
let start, end;
let path = [];

let started = false;

function removeFromArray(arr, el) {
  for (let index = arr.length - 1; index >= 0; index--) {
    if (arr[index] === el){
      arr.splice(index, 1);
      return;
    }
  }
}

function coordsToString(x, y){
  return `${x},${y}`;
}
function addToMaze(x, y, matrix) {
  matrix[x][y] = false;
  return coordsToString(x, y);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function isDiag(x, y, destX, destY) {
  return ((abs(destX - x) + abs(destY - y) ) > 1);
}

function validDiag(x, y, destX, destY, matrix) {
  // Check this is a diagonal move first, if not then return true
  if (!isDiag(x, y, destX, destY)) {
    return true;
  }
  let deltaX = destX - x;
  let deltaY = destY - y;
  return !(matrix[x + deltaX][y].block && matrix[x][y + deltaY].block);
}

function addWalls(x, y, cols, rows, partMaze, wallList, wallsVisited) {
    if (x < cols - 1) {
      let coord = coordsToString(x + 1, y);
      if (!partMaze.includes(coord) && !wallsVisited.includes(coord)){
        wallList.push(coord);
        wallsVisited.push(coord);
      }
    }
    if (x > 0) {
      let coord = coordsToString(x - 1, y);
      if (!partMaze.includes(coord) && !wallsVisited.includes(coord)){
        wallList.push(coord);
        wallsVisited.push(coord);
      }
    }
    if (y < rows - 1) {
      let coord = coordsToString(x, y + 1);
      if (!partMaze.includes(coord) && !wallsVisited.includes(coord)){
        wallList.push(coord);
        wallsVisited.push(coord);
      }
    }
    if (y > 0) {
      let coord = coordsToString(x, y - 1);
      if (!partMaze.includes(coord) && !wallsVisited.includes(coord)){
        wallList.push(coord);
        wallsVisited.push(coord);
      }
    }
}

function onlyOneConnexion(x, y, cols, rows, partMaze) {
  let nb = 0;
  if (x < cols - 1) {
    let coord = coordsToString(x + 1, y);
    if (partMaze.includes(coord)){
      nb++;
    }
  }
  if (x > 0) {
    let coord = coordsToString(x - 1, y);
    if (partMaze.includes(coord)){
      nb++;
    }
  }
  if (y < rows - 1) {
    let coord = coordsToString(x, y + 1);
    if (partMaze.includes(coord)){
      nb++;
    }
  }
  if (y > 0) {
    let coord = coordsToString(x, y - 1);
    if (partMaze.includes(coord)){
      nb++;
    }
  }

  return nb > 1 ? false : true;
}

function maze(x, y) {
  console.log('entering maze function');
  let wallList = [];
  let partMaze = [];
  let wallsVisited = [];
  let matrix = new Array(x);
  for (let index = 0; index < matrix.length; index++) {
    matrix[index] = new Array(y);
  }
  for (let i = 0; i < x; i++){
    for (let j = 0; j < y; j++){
      matrix[i][j] = true;
    }
  }

  let curX = 0;
  let curY = 0;
  //Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
  partMaze.push(addToMaze(curX, curY, matrix));
  addWalls(curX, curY, x, y, partMaze, wallList, wallsVisited);
  while (wallList.length) {
    let curWall = wallList[getRandomInt(wallList.length - 1)];
    let parsed = curWall.split(',');
    curX = parseInt(parsed[0], 10);
    curY = parseInt(parsed[1], 10);
    if (onlyOneConnexion(curX, curY, x, y, partMaze)){
      partMaze.push(addToMaze(curX, curY, matrix));
      addWalls(curX, curY, x, y, partMaze, wallList, wallsVisited);
    }
    removeFromArray(wallList, curWall);
  }



  return matrix;
}



let randomMaze = new Array(cols);
for (let index = 0; index < randomMaze.length; index++) {
  randomMaze[index] = new Array(rows);
  for (let j = 0; j < rows; j++){
    randomMaze[index][j] = false;
  }
}
function generateMaze() {
  if (started) {
     matrix = new Array(cols);
 openSet = [];
 closedSet = [];
 path = [];
 started = false;
    setup();
    loop();

  }
  randomMaze = maze(cols, rows);
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < cols; j++){
      matrix[i][j].block = randomMaze[i][j];
    }
  }
  // If the last case is a block regenerate the maze
  if (randomMaze[cols - 1][rows - 1]) {
    generateMaze();
  }
}




function starto() {
  if (started) {
  }
  else {
  loop();
  started = true;
  }
}

function heuristic(a, b) {
  // return dist(a.x, a.y, b.x, b.y);
  return abs(a.x - b.x) + abs(a.y - b.y);
}

function Spot(i, j) {
  this.x = i;
  this.y = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbors = [];
  this.previous = undefined;
  this.block = false;
  // if (random(1) < 0.2) {
  //   this.block = true;
  // }
  this.show = function(color) {
    fill(color);
    if (this.block) {
      fill(0);
    }
    noStroke();
    rect(this.x * w, this.y * h, w - 1, h - 1);
  }
  this.addNeighbors = function() {
    let x = this.x;
    let y = this.y;
    if (x < cols - 1) {
    this.neighbors.push(matrix[x + 1][y])
    }
    if (x > 0) {
    this.neighbors.push(matrix[x - 1][y])
    }
    if (y < rows - 1) {
    this.neighbors.push(matrix[x][y + 1])
    }
    if (y > 0) {
    this.neighbors.push(matrix[x][y - 1])
    }

    // Diagonals
    // top left
    if (x > 0 && y > 0) {
      this.neighbors.push(matrix[x - 1][y - 1])
    }
    // top right
    if (x < cols - 1 && y > 0) {
      this.neighbors.push(matrix[x + 1][y - 1])
    }
    // down right
    if (x < cols - 1 && y < rows - 1) {
      this.neighbors.push(matrix[x + 1][y + 1])
    }
    // down left
    if (x > 0 && y < rows - 1) {
      this.neighbors.push(matrix[x - 1][y + 1])
    }
  }
}
function mouseDragged() {
  const xb = Math.floor(mouseX / w);
  const yb = Math.floor(mouseY / h);
  matrix[xb][yb].block = true;
  return false;
}
function mouseClicked() { mouseDragged();}


function setup() {
  createCanvas(displayHeight, displayHeight);
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

  for (let i = 0; i < cols; i++){
    for (let j = 0; j < cols; j++){
      matrix[i][j].addNeighbors();
    }
  }

  start = matrix[0][0];
  end = matrix[cols - 1][rows - 1];
  start.block = false;
  end.block = false;
  openSet.push(start);

}

function draw() {
  if (started) {
  let current;
  if (openSet.length > 0) {

    let winner = 0;
    for (let i = 0; i < openSet.length; i++){
      if (openSet[i].f < openSet[winner].f){
        winner = i;
      }
    }
    current = openSet[winner];

    if (current === end) {
      noLoop();
      console.log('done');

    }
    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;
    for (let index = 0; index < neighbors.length; index++) {
      let neighbor = neighbors[index];
      if (!closedSet.includes(neighbor) && !neighbor.block 
      && validDiag(current.x, current.y, neighbor.x, neighbor.y, matrix)) {
        let tmpG = current.g + 1;
        let newPath = false;
        if (openSet.includes(neighbor)) {
          if (tmpG < neighbor.g) {
            neighbor.g = tmpG;
            newPath = true;
          }
        } else {
          neighbor.g = tmpG;
          newPath = true;
          openSet.push(neighbor);
        }
        
        if (newPath){
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.previous = current;
        }
      }

      
    }
  }
  else {
    console.log('No solution');
    noLoop();
    return;
  }
  background(0);
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      matrix[i][j].show(color(255));
    }
  }

  for (let i = 0; i < closedSet.length; i++){
    closedSet[i].show(color(255, 0, 0));
  }

  // Get the path till then end
  path = [];
  let temp = current;
  path.push(temp);
  while(temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  for (let index = 0; index < path.length; index++) {
    path[index].show(color(0, 0, 255));
  }
}
else {
  background(0);
  for (let i = 0; i < cols; i++){
    for (let j = 0; j < rows; j++){
      matrix[i][j].show(color(255));
    }
  }
}
}
