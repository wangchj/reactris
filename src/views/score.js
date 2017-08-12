import React from 'react';

var Score = React.createClass({
  render: function() {
    return (
      <div className="score">
        <div className="header">Score</div>
        <div className="value">{this.props.player.score}</div>
      </div>
    );
  }
});

export default Score;