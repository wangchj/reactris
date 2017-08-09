import Constants from '../constants.js';
import NextPieceArea from './next_piece_area.js';
import PlayArea from './play_area.js';
import PlayerState from '../models/player_state.js';
import React from 'react';

var SinglePlayerGame = React.createClass({
  propTypes: {
    player: React.PropTypes.object.isRequired // player model object
  },
  render: function(){
    var player = this.props.player;
    return (
      <div className="player">
        <div className="field">
          <PlayArea field={player.field} piece={player.piece} state={player.state}/>
        </div>
        <div className="next">
          <NextPieceArea piece={player.next}/>
        </div>
      </div>
    );
  }
});

export default SinglePlayerGame;