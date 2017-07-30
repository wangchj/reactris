import Player from '../models/player.js';
import Piece from '../models/piece.js';
import Constants from '../constants.js';
import PlayerState from '../models/player_state.js';

function SinglePlayerController() {
  // Setting player state
  this.player = new Player();
  this.player.piece = this.player.makeIntoPlayPiece(new Piece());
  this.player.next  = new Piece();
  this.player.purgeCount = 0;
  this.player.level = 1;

  // Piece falling control variables
  this.fallTimer = null;
  this.fallDelay = Constants.fallDelay;

  // Blink control
  this.blinkTimer = null;
}

SinglePlayerController.prototype = {
  start: function() {
    this.fallTimer = setInterval(this.onFallDelayExpired.bind(this), this.fallDelay);
  },
  onFallDelayExpired: function() {
    this.down();
  },
  setPause: function(pause) {
    if (pause)
      clearInterval(this.fallTimer);
    else
      this.fallTimer = setInterval(this.onFallDelayExpired.bind(this), this.fallDelay);
  },
  doRot: function() {
    if (this.player.state.id == PlayerState.purge)
      return;

    if (this.player.doRot())
      this.update();
  },
  /**
   * Move the current piece down by one row.
   */
  down: function() {
    if (this.player.state.id == PlayerState.purge)
      return;

    if (this.player.down())
      this.update();
    else
      this.onPiecePut();
  },
  /**
   * Drops the current piece.
   */
  drop: function() {
    if (this.player.state.id == PlayerState.purge)
      return;

    this.player.drop();
    this.update();
    this.onPiecePut();
  },
  left: function() {
    if (this.player.state.id == PlayerState.purge)
      return;

    if (this.player.left())
      this.update();
  },
  right: function() {
    if (this.player.state.id == PlayerState.purge)
      return;

    if (this.player.right())
      this.update();
  },
  /**
   * Handler when the current piece is put.
   */
  onPiecePut: function() {
    clearInterval(this.fallTimer);
    var completeRows = this.player.field.getCompleteRows(); 
    if(completeRows.length > 0) {
      this.startPurge(completeRows);
      this.player.purgeCount += completeRows.length;
      if (this.player.purgeCount >= 10 * this.player.level) {
        this.levelUp();
      }
    }
    else if (this.player.isDead()) {
      this.setStateToEnd();
      this.update();
    }
    else {
      this.player.changePiece();
      this.fallTimer = setInterval(this.onFallDelayExpired.bind(this), this.fallDelay);
    }
  },
  startPurge: function(completeRows) {
    this.player.state = {
      id: PlayerState.purge,
      blinkCount: 0,
      completeRows:completeRows
    };
    this.player.score = this.score + completeRows.length;
    this.blinkTimer = setInterval(this.onBlinkExpired.bind(this), Constants.blinkDelay);
    this.update();
  },
  setStateToEnd: function() {
    this.player.state.id = PlayerState.end;
  },
  levelUp: function() {
    this.player.level++;
    this.increaseSpeed();
  },
  increaseSpeed: function() {
    if (this.fallDelay > 50) {
      if (this.fallDelay > 100)
        this.fallDelay -= 100;
      else if (this.fallDelay == 100)
        this.fallDelay -= 50;
    } 
  },
  onBlinkExpired: function() {
    if (this.player.state.blinkCount >= Constants.blinkLimit) {
      clearInterval(this.blinkTimer);
      this.player.field.clearCompleteRows();
      this.player.changePiece();
      this.player.state.id = PlayerState.normal;
      this.update();
      this.fallTimer = setInterval(this.onFallDelayExpired.bind(this), this.fallDelay);
    }
    else {
      this.player.state.blinkCount++;
      this.update();
    }
  },
  update: function() {
    var event = new CustomEvent('PlayStateUpdate');
    document.dispatchEvent(event);
  }
};

export default SinglePlayerController;