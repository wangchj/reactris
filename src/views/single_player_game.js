import Constants from '../constants.js';
import Level from './level.js';
import NextPieceArea from './next_piece_area.js';
import PlayArea from './play_area.js';
import PlayerState from '../models/player_state.js';
import React from 'react';
import Score from './score.js';

function SinglePlayerGame(props){
  var player = props.player;
  return (
    <div className="player">
      <div className="field">
        <PlayArea field={player.field} piece={player.piece} state={player.state}/>
      </div>
      <div className="sideline">
        <NextPieceArea piece={player.next}/>
        <Score player={player}/>
        <Level player={player}/>
      </div>
    </div>
  );
}

export default SinglePlayerGame;