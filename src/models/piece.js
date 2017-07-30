import Color from './color.js';

Piece.Type = {
  I: 0, Z:1, S:2, O:3, L:4, J:5, T:6
};

// A unique id for each piece
Piece.counter = 0;

/**
 * Constructor for Piece. A piece is a shape, e.g. L shape, is a collection of square blocks.
 */
function Piece(type) {
  if (type === undefined)
    type = Math.floor(Math.random() * 7);
  
  this.color = Color.getRandomColor();
  this.count = ++Piece.counter;
  this.phase = 0;

  switch(type) {
    case Piece.Type.I: //Straight piece
      this.type = Piece.Type.I;
      this.p = 1;
      this.blocks = [
        {row: 0, col: -1},
        {row: 0, col: 0},
        {row: 0, col: 1},
        {row: 0, col: 2}
      ];
      break;
    case Piece.Type.Z:  //Z piece
      this.type = Piece.Type.Z;
      this.p = 2;
      this.blocks = [
        {row: 1, col: -1},
        {row: 1, col: 0},
        {row: 0, col: 0},
        {row: 0, col: 1}
      ];
      break;
    case Piece.Type.S: //Reverse Z piece
      this.type = Piece.Type.S;
      this.p = 1;
      this.blocks = [
        {row: 0, col: -1},
        {row: 0, col: 0},
        {row: 1, col: 0},
        {row: 1, col: 1}
      ];
      break;
    case Piece.Type.O:  //Square piece
      this.type = Piece.Type.O;
      this.blocks = [
        {row:1, col:0},
        {row:1, col:1},
        {row:0, col:0},
        {row:0, col:1}
      ];
      break;
    case Piece.Type.L:  //L piece
      this.type = Piece.Type.L;
      this.p = 1;
      this.blocks = [
        {row: 0, col: -1},
        {row: 0, col: 0},
        {row: 0, col: 1},
        {row: 1, col: 1}
      ];
      break;
    case Piece.Type.J: //Reverse L piece
      this.type = Piece.Type.J;
      this.p = 2;
      this.blocks = [
        {row: 1, col: -1},
        {row: 0, col: -1},
        {row: 0, col: 0},
        {row: 0, col: 1}
      ];
      break;
    case Piece.Type.T:  //Right angle piece
      this.type = Piece.Type.T;
      this.p = 2;
      this.blocks = [
        {row: 1, col: 0},
        {row: 0, col: -1},
        {row: 0, col: 0},
        {row: 0, col: 1}
      ];
  }
}

Piece.prototype = {
  /**
   * Move this piece by the amount specified by offset.
   * Parameter offset is an object with the following two properties:
   *   rows: integer
   *   cols: integer
   */
  translate: function(offset) {
    for (var i = 0; i < this.blocks.length; i++) {
      this.blocks[i].row += offset.rows ? offset.rows : 0;
      this.blocks[i].col += offset.cols ? offset.cols : 0;
    }
  },
  rotate: function() {
    var p = this.p;
    switch(this.type) {
      case Piece.Type.I: //Straight piece
        if(this.phase == 0) { // Phase 0: horizontal
          this.blocks[0].col = this.blocks[1].col;
          this.blocks[0].row = this.blocks[1].row + 1;
          this.blocks[2].col = this.blocks[1].col;
          this.blocks[2].row = this.blocks[1].row - 1;
          this.blocks[3].col = this.blocks[1].col;
          this.blocks[3].row = this.blocks[1].row - 2;
          this.phase = 1;
        }
        else { // Phase 1: vertical
          this.blocks[0].col = this.blocks[1].col - 1;
          this.blocks[0].row = this.blocks[1].row;
          this.blocks[2].col = this.blocks[1].col + 1;
          this.blocks[2].row = this.blocks[1].row;
          this.blocks[3].col = this.blocks[1].col + 2;
          this.blocks[3].row = this.blocks[1].row;
          this.phase = 0;
        }
        break;
      case Piece.Type.Z:
        if(this.phase == 0) {
          this.blocks[0].col = this.blocks[2].col + 1;
          this.blocks[0].row = this.blocks[2].row + 1;
          this.blocks[1].col = this.blocks[2].col + 1;
          this.blocks[1].row = this.blocks[2].row;
          this.blocks[3].col = this.blocks[2].col;
          this.blocks[3].row = this.blocks[2].row - 1;
          this.phase = 1;
        }
        else {
          this.blocks[0].col = this.blocks[2].col - 1;
          this.blocks[0].row = this.blocks[2].row + 1;
          this.blocks[1].col = this.blocks[2].col;
          this.blocks[1].row = this.blocks[2].row + 1;
          this.blocks[3].col = this.blocks[2].col + 1;
          this.blocks[3].row = this.blocks[2].row;
          this.phase = 0;
        }
        break;
      case Piece.Type.S:
        if(this.phase == 0) {
          this.blocks[0].col = this.blocks[p].col;
          this.blocks[0].row = this.blocks[p].row - 1;
          this.blocks[2].col = this.blocks[p].col - 1;
          this.blocks[2].row = this.blocks[p].row;
          this.blocks[3].col = this.blocks[p].col - 1;
          this.blocks[3].row = this.blocks[p].row + 1;
          this.phase = 1;
        }
        else {
          this.blocks[0].col = this.blocks[p].col - 1;
          this.blocks[0].row = this.blocks[p].row;
          this.blocks[2].col = this.blocks[p].col;
          this.blocks[2].row = this.blocks[p].row + 1;
          this.blocks[3].col = this.blocks[p].col + 1;
          this.blocks[3].row = this.blocks[p].row + 1;
          this.phase = 0;
        }
        break;
      case Piece.Type.O:
        break;
      case Piece.Type.L:  //L piece
      case Piece.Type.J: //Reverse L piece
      case Piece.Type.T:  //Right angle piece
        this.rotateClockwise();
        this.phase = (this.phase + 1) % 4;
    }
  },
  rotateClockwise: function() {
    var p = this.p;
    var blocks = this.blocks;
    var pivot = blocks[p];

    for (var i = 0; i < blocks.length; i++) {
      if (i == p)
        continue;
      var block = blocks[i];
      var rowDiff = block.row - pivot.row;
      var colDiff = block.col - pivot.col;
      block.row = pivot.row - colDiff;
      block.col = pivot.col + rowDiff;
    }
  },
  /**
   * Returns a copy of this piece.
   */
  copy: function() {
    var copy = new Piece();
    var blocks = [];

    for(var i = 0; i < this.blocks.length; i++) {
      blocks.push({
        row: this.blocks[i].row,
        col: this.blocks[i].col
      });
    }

    copy.p = this.p;
    copy.type = this.type;
    copy.phase = this.phase;
    copy.blocks = blocks;

    return copy;
  }
};

export default Piece;