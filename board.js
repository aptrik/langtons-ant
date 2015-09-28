// Langton's Ant Board
//
// Rules:
//  - On a white square, turn right 90°, flip the color of the square and
//    move forward one unit.
//  - On a black square, turn left 90°, flip the color of the square and
//    move forward one unit.
'use strict';

var ANT_COLOR = "red";
var GRID_COLOR = "#eee";
var COLOR = {WHITE: 0, BLACK: 1};
var RGB = {0: "#000", 1: "#fff"};
var HEADING = {UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3};

function Board(document, id, boardSize) {
    this.boardSize = boardSize;
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    this.padding = 15;
    this.cellSize = 10;
    this.cells = null;
    this.rows = null;
    this.columns = null;
    this.pos = null;
    this.heading = HEADING.UP;
    this.steps = 0;
}

Board.prototype.draw = function() {
    this.canvas.width = this.boardSize + (this.padding * 2) + 1;
    this.canvas.height = this.canvas.width;

    this.context.strokeStyle = GRID_COLOR;
    var rows = 0, columns = 0;
    for (var x = 0; x <= this.boardSize; x += this.cellSize) {
        columns += 1;
        this.context.moveTo(
            0.5 + x + this.padding,
            this.padding);
        this.context.lineTo(
            0.5 + x + this.padding,
            this.boardSize + this.padding);
    }
    for (var y = 0; y <= this.boardSize; y += this.cellSize) {
        rows += 1;
        this.context.moveTo(
            this.padding,
            0.5 + y + this.padding);
        this.context.lineTo(
            this.boardSize + this.padding,
            0.5 + y + this.padding);
    }
    this.context.stroke();

    this.cells = new Array(rows);
    for (var i = 0; i < rows; i++) {
        this.cells[i] = new Array(columns);
        for (var j = 0; j < columns; j++) {
            this.cells[i][j] = COLOR.WHITE;
        }
    }
    this.pos = [parseInt(rows / 2), parseInt(columns / 2)];
    this.rows = rows;
    this.columns = columns;
};

Board.prototype.play = function(steps) {
    while (steps > 0) {
        this.step();
        steps -= 1;
    }
};

Board.prototype.step = function() {
    var color = this.getCurrentColor();
    switch (color) {
    case  COLOR.WHITE:
        this.turnRight();
        break;
    case  COLOR.BLACK:
        this.turnLeft();
        break;
    }
    this.flipColor(color);
    this.moveForward();
    this.drawAnt();
    this.steps += 1;
};

Board.prototype.drawAnt = function() {
    var d;
    switch (this.heading) {
    case HEADING.UP:
        d = [0, -1];
        break;
    case HEADING.RIGHT:
        d = [1, 0];
        break;
    case HEADING.DOWN:
        d = [0, 1];
        break;
    case HEADING.LEFT:
        d = [-1, 0];
        break;
    }
    this.context.fillStyle = ANT_COLOR;
    this.context.fillRect(
        this.padding + this.pos[0] * this.cellSize,
        this.padding + this.pos[1] * this.cellSize,
        this.cellSize,
        this.cellSize);
};

Board.prototype.getCurrentColor = function() {
    return this.cells[this.pos[0]][this.pos[1]];
};

Board.prototype.flipColor = function(color) {
    switch (color) {
    case COLOR.WHITE:
        color = COLOR.BLACK;
        break;
    case COLOR.BLACK:
        color = COLOR.WHITE;
        break;
    }
    this.cells[this.pos[0]][this.pos[1]] = color;

    var x = this.padding + this.pos[0] * this.cellSize;
    var y = this.padding + this.pos[1] * this.cellSize;

    // this.context.beginPath();
    // this.context.strokeStyle = GRID_COLOR;
    // this.context.moveTo(x, y);
    // this.context.lineTo(1 + x + this.cellSize, y + 1);
    // this.context.lineTo(1 + x + this.cellSize, y + this.cellSize + 1);
    // this.context.lineTo(1 + x, y + this.cellSize + 1);
    // this.context.lineTo(1 + x, y + 1);
    // this.context.stroke();

    var rgbColor = RGB[color];
    this.context.fillStyle = rgbColor;
    this.context.fillRect(x, y, this.cellSize, this.cellSize);
};

Board.prototype.moveForward = function() {
    var d;
    switch (this.heading) {
    case HEADING.UP:
        d = [0, -1];
        break;
    case HEADING.RIGHT:
        d = [1, 0];
        break;
    case HEADING.DOWN:
        d = [0, 1];
        break;
    case HEADING.LEFT:
        d = [-1, 0];
        break;
    }
    this.pos = [this.pos[0] + d[0], this.pos[1] + d[1]];
    var inside = this.pos[0] >= 0 &&
        this.pos[0] < this.columns &&
        this.pos[1] > 0 &&
        this.pos[1] < this.rows;
    return inside;
};

Board.prototype.turnLeft = function() {
    switch (this.heading) {
    case HEADING.UP:
        this.heading = HEADING.LEFT;
        break;
    case HEADING.RIGHT:
        this.heading = HEADING.UP;
        break;
    case HEADING.DOWN:
        this.heading = HEADING.RIGHT;
        break;
    case HEADING.LEFT:
        this.heading = HEADING.DOWN;
        break;
    }
};

Board.prototype.turnRight = function() {
    switch (this.heading) {
    case HEADING.UP:
        this.heading = HEADING.RIGHT;
        break;
    case HEADING.RIGHT:
        this.heading = HEADING.DOWN;
        break;
    case HEADING.DOWN:
        this.heading = HEADING.LEFT;
        break;
    case HEADING.LEFT:
        this.heading = HEADING.UP;
        break;
    }
};
