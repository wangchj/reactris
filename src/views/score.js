import React from 'react';

function Score(props) {
  return (
    <div className="score">
      <div className="header">Score</div>
      <div className="value">{props.player.score}</div>
    </div>
  );
}

export default Score;