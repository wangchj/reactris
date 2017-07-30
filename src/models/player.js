import Constants from '../constants.js';
import Field from './field.js';
import Piece from './piece.js';
import PlayerState from './player_state.js';

var gridWidth = Constants.gridWidth;
var gridHeight = Constants.gridHeight;

function Player() {
  this.field = new Field(gridWidth, gridHeight);
  this.piece = null; // The current piece
  this.next  = null; // The next piece
  this.score = 0;
  this.state = {id: PlayerState.normal};
}

Player.prototype = {
  /**
   * Set the piece at the top center of the field.
   */
  makeIntoPlayPiece: function(piece) {
    for(var i = 0; i < piece.blocks.length; i++) {
      piece.blocks[i].col += Math.floor(this.field.width / 2) - 1;
      piece.blocks[i].row += this.field.height;
    }
    return piece;
  },
  /**
   * Sets the current in place.
   */
  putPiece: function() {
    this.field.putPiece(this.piece);
  },
  /**
   * Checks if the current piece can move down by one row.
   * @return {boolean}
   */
  canMoveDown: function() {
    var blocks = this.field.blocks;
    var piece = this.piece;

    for(var i = 0; i < piece.blocks.length; i++) {
      if(piece.blocks[i].row == 0 ||
        (piece.blocks[i].row <= gridHeight && blocks[piece.blocks[i].row - 1][piece.blocks[i].col] != null))
        return false;
    }

    return true;
  },
  /**
   * Check if the game has just ended. This method is meant to be called after each
   * put piece. This method only checks the location of the previous piece (the piece just put).
   * @return true if dead; false otherwise
   */
  justDied: function() {
    for (var i = 0; i < this.piece.blocks.length; i++) {
      var block = this.piece.blocks[i];
      if (block.row >= this.field.height)
        return true;
    }
    return false;
  },
  isDead: function() {
    for (var i = 0; i < gridWidth; i++) {
      if (this.field.blocks[gridHeight - 1][i])
        return true;
    }
    return false;
  },
  /**
   * Assign the next piece to be the current piece.
   * Make a new next piece.
   */
  changePiece: function() {
    this.piece = this.makeIntoPlayPiece(this.next);
    this.next = new Piece();
  },
  /**
   * Move the current piece one column to the left.
   * @return {boolean} true if piece was moved; false otherwise.
   */
  left: function() {
    var canMove = true;
    var blocks = this.field.blocks;
    var piece = this.piece;

    // Check if the move is legal, i.e., the piece will not end up out of bound.
    for (var i = 0; i < piece.blocks.length; i++) {
      if (piece.blocks[i].col == 0 || (piece.blocks[i].row < gridHeight && blocks[piece.blocks[i].row][piece.blocks[i].col - 1] != null)) {
        canMove = false;
        break;
      }
    }

    if(canMove)
      piece.translate({cols: -1});

    return canMove;
  },
  /**
   * Move the current piece one column to the right.
   * @return {boolean} true if piece was moved; false otherwise.
   */
  right: function() {
    var canMove = true;
    var blocks = this.field.blocks;
    var piece = this.piece;

    for(var i = 0; i < piece.blocks.length; i++) {
      if(piece.blocks[i].col == gridWidth - 1 || (piece.blocks[i].row < gridHeight && blocks[piece.blocks[i].row][piece.blocks[i].col + 1] != null)) {
        canMove = false;
        break;
      }
    }

    if(canMove)
      piece.translate({cols: 1});

    return canMove;
  },
  /**
   * Move the current piece down. If the current piece is at the bottom of the field or if it is
   * on top of a block, the piece will be put.
   */
  down: function() {
    if (this.canMoveDown()) {
      this.piece.translate({rows: -1});
      return true;
    }
    else {
      this.putPiece();
      return false;
    }
  },
  /**
   * Drops the current piece to the lowest point and change the current piece to the next piece.
   */
  drop: function() {
    var blocks = this.field.blocks;
    var piece = this.piece;
    var min = this.field.height + 1;

    for(var i = 0; i < piece.blocks.length; i++) {
      var colHeight = this.field.colHeight(piece.blocks[i].col);
      var d = piece.blocks[i].row - colHeight;
      if(d < min)
        min = d;
    }

    if(min > 0)
      for(var i = 0; i < piece.blocks.length; i++)
        piece.blocks[i].row -= min;

    this.putPiece();
  },
  /**
   * Try rotate a piece if it's legal.
   * @return {boolean} true if piece was rotated; false otherwise.
   */
  doRot: function() {
    var blocks = this.field.blocks;
    var piece = this.piece;
    var copy = piece.copy();
    var canRot = true;

    // Rotate the copy
    copy.rotate();

    // Check each block of the copy to see the rotation is permitted
    for (var i = 0; i < copy.blocks.length; i++) {
      if (copy.blocks[i].col < 0 || copy.blocks[i].col >= this.field.width || copy.blocks[i].row < 0 ||
        (copy.blocks[i].row < this.field.height && blocks[copy.blocks[i].row][copy.blocks[i].col] != null)) {
        canRot = false;
        break;
      }
    }

    // If rotate is permitted
    if(canRot) {
      piece.phase = copy.phase;
      piece.blocks = copy.blocks;
    }

    return canRot;
  },
  update: function() {
    var event = new CustomEvent('PlayStateUpdate');
    document.dispatchEvent(event);
  }
}

export default Player;