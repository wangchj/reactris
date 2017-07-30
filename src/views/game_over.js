import Constants from '../constants.js';
import React from 'react';

var GameOver = React.createClass({
  render: function() {
    var field = this.props.player.field;
    var textX = Constants.playAreaXOffset + 50;
    var textY = Constants.playAreaYOffset + (field.height * Constants.blockWidth / 2) + 5;
    var boxX =  Constants.playAreaXOffset + 40;
    var boxY = Constants.playAreaYOffset + (field.height * Constants.blockWidth / 2) - 20;
    var boxWidth = field.width * Constants.blockWidth - 80;
    var boxHeight = Constants.blockWidth * 2

    return (
      <g>
        <rect x={boxX} y={boxY} width={boxWidth} height={boxHeight} fill="#fff"/>
        <text x={textX} y={textY} style={{fontFamily:'GameOver',fontSize:'24px'}}>Game Over</text>
      </g>
    );
  }
});

export default GameOver;