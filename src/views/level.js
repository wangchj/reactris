import React from 'react';

function Level(props) {
  return (
    <div className="level">
      <div className="header">Level</div>
      <div className="value">{props.player.level}</div>
    </div>
  );
}

export default Level;