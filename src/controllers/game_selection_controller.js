import React from 'react';
import ReactDOM from 'react-dom';
import GameSelectionView from '../views/game_selection_view.js';

function GameSelectionController() {
  this.gameType = "SinglePlayer";
  this.playerName;
}

GameSelectionController.prototype = {
  start: function() {
    this.render();
  },
  onGameTypeChange: function(event) {
    this.gameType = event.target.value;
    this.render();
  },
  onNextClicked: function() {
    var gameInfo = {
      type: this.gameType,
      playerName: this.playerName
    };
    var event = new CustomEvent('GameTypePicked', {
      detail: {
        gameType: this.gameType,
        playerName: this.playerName
      }
    });
    document.dispatchEvent(event);
  },
  render: function() {
    ReactDOM.render(
      <GameSelectionView gameType={this.gameType}
        onGameTypeChange={(event)=>this.onGameTypeChange(event)}
        onNextClick={()=>this.onNextClicked()}
      />,
      document.getElementById('content')
    );
  }
};

export default GameSelectionController;