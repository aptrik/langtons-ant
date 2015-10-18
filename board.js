// Langton's Ant Board
//
// Rules:
//  - On a white square, turn right 90°, flip the color of the square and
//    move forward one unit.
//  - On a black square, turn left 90°, flip the color of the square and
//    move forward one unit.
'use strict';

var COLOR = {
    WHITE: "#fff",
    BLACK: "#000",
    ANT: "#f00",
    GRID: "#eee"
};
var HEADING = {UP: 270, RIGHT: 180, DOWN: 0, LEFT: 90};

function Board(background_canvas, foreground_canvas, boardSize) {
    this.boardSize = boardSize;
    this.bg_canvas = background_canvas;
    this.fg_canvas = foreground_canvas;
    this.padding = 15;
    this.cellSize = 10;
    this.cells = null;
    this.rows = null;
    this.columns = null;
    this.pos = null;
    this.inside = true;
    this.heading = HEADING.UP;
    this.steps = 0;
    this.drawBoard();
    this.drawAnt();
}

Board.prototype.drawBoard = function() {
    this.bg_canvas.width = this.boardSize + (this.padding * 2) + 1;
    this.bg_canvas.height = this.bg_canvas.width;
    this.fg_canvas.width = this.bg_canvas.width;
    this.fg_canvas.height = this.bg_canvas.height;

    this.bg_context = this.bg_canvas.getContext("2d");
    this.fg_context = this.fg_canvas.getContext("2d");

    this.bg_context.strokeStyle = COLOR.GRID;
    this.rows = 0;
    this.columns = 0;
    for (var x = 0; x <= this.boardSize; x += this.cellSize) {
        this.columns += 1;
        this.bg_context.moveTo(
            0.5 + x + this.padding,
            this.padding);
        this.bg_context.lineTo(
            0.5 + x + this.padding,
            this.boardSize + this.padding);
    }
    for (var y = 0; y <= this.boardSize; y += this.cellSize) {
        this.rows += 1;
        this.bg_context.moveTo(
            this.padding,
            0.5 + y + this.padding);
        this.bg_context.lineTo(
            this.boardSize + this.padding - 1,
            0.5 + y + this.padding);
    }
    this.bg_context.stroke();

    this.cells = new Array(this.rows);
    for (var i = 0; i < this.rows; i++) {
        this.cells[i] = new Array(this.columns);
        for (var j = 0; j < this.columns; j++) {
            this.cells[i][j] = COLOR.WHITE;
        }
    }
    this.pos = [parseInt(this.rows / 2), parseInt(this.columns / 2)];
};

Board.prototype.drawAnt = function() {
    var ctx = this.fg_context;
    ctx.fillStyle = COLOR.ANT;
    var x = this.padding + this.pos[0] * this.cellSize;
    var y = this.padding + this.pos[1] * this.cellSize;
    ctx.fillRect(x, y, this.cellSize, this.cellSize);
};

Board.prototype.step = function(steps) {
    if (steps === undefined) {
        steps = 1;
    }
    while (steps-- > 0) {
        this._step();
    }
};

Board.prototype._step = function() {
    if (this.inside) {
        var color = this.getCurrentColor();
        switch (color) {
        case COLOR.WHITE:
            this.turnRight();
            break;
        case COLOR.BLACK:
            this.turnLeft();
            break;
        }
        this.flipColor(color);
        this.moveForward();
        this.drawAnt();
    }
};

Board.prototype.getCurrentColor = function() {
    return this.cells[this.pos[0]][this.pos[1]];
};

Board.prototype.flipColor = function(oldColor) {
    var color;
    switch (oldColor) {
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

    if (oldColor === COLOR.BLACK) {
        this.fg_context.clearRect(x, y, this.cellSize, this.cellSize);
    }
    else {
        this.fg_context.fillStyle = color;
        this.fg_context.fillRect(x, y, this.cellSize, this.cellSize);
    }
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
    var new_pos = [this.pos[0] + d[0], this.pos[1] + d[1]];
    this.inside = new_pos[0] >= 0 &&
        new_pos[0] < this.columns &&
        new_pos[1] > 0 &&
        new_pos[1] < this.rows;
    if (this.inside) {
        this.pos = new_pos;
        this.steps += 1;
    }
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

Board.prototype.headingArrow = function() {
    switch (this.heading) {
    case HEADING.UP:
        return "&#8593;";
    case HEADING.RIGHT:
        return "&#8594;";
    case HEADING.DOWN:
        return "&#8595;";
    case HEADING.LEFT:
        return "&#8592;";
    }
};
