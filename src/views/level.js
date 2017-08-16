import React from 'react';

var Level = React.createClass({
  render: function() {
    return (
      <div className="level">
        <div className="header">Level</div>
        <div className="value">{this.props.player.level}</div>
      </div>
    );
  }
});

export default Level;