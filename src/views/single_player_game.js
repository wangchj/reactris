import Constants from '../constants.js';
import GameOver from './game_over.js';
import NextPieceArea from './next_piece_area.js';
import PlayArea from './play_area.js';
import PlayerState from '../models/player_state.js';
import React from 'react';

var SinglePlayerGame = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired // player model object
  }
  render: function(){
    var player = this.props.player;
    return (
      <svg width={Constants.playAreaWidth} height={Constants.playAreaHeight}>
        <PlayArea field={player.field} piece={player.piece} state={player.state}/>
        <NextPieceArea piece={player.next}/>
        {player.state.id == PlayerState.end ? <GameOver player={player}/> : null} 
      </svg>
    );
  }
});

export default SinglePlayerGame;