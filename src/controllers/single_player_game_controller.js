import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import SinglePlayerController from './single_player_controller.js';
import SinglePlayerGame from '../views/single_player_game.js';

function SinglePlayerGameController() {
  this.paused = false;
  this.playerController = new SinglePlayerController();
}

SinglePlayerGameController.prototype = {
  start: function() {
    document.addEventListener('PlayStateUpdate', this.onPlayerStateUpdate.bind(this));
    $('body').keydown(this.onKeydown.bind(this));
    this.playerController.start();
    this.render();
  },
  onKeydown: function(event) {
    if(this.paused && event.which != 80)
        return;

    switch(event.which) {
      case 32: this.playerController.drop(); break;  //32: space bar
      case 37: this.playerController.left(); break;  //37: arrow left
      case 38: this.playerController.doRot(); break; //38: arrow up
      case 39: this.playerController.right(); break; //39: arrow right
      case 40: this.playerController.down(); break;  //40: arrow down
      case 80: this.togglePause(); break;  //80: p
    }
  },
  togglePause: function() {
    if(this.paused) {
      this.playerController.setPause(false);
      this.paused = false;
    }
    else {
      this.playerController.setPause(true);
      this.paused = true;
    }
  },
  render: function() {
    var player = this.playerController.player;
    ReactDOM.render(<SinglePlayerGame player={player}/>, document.getElementById('content'));
  },
  onPlayerStateUpdate: function(event) {
    this.render();
  },
  stop: function() {
    $('body').off('keydown');
  }
}

export default SinglePlayerGameController;