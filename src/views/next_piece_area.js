import Constants from '../constants.js';
import React from 'react';

var blockWidth = Constants.blockWidth;
var nextPieceAreaXOffset = blockWidth * 13; //pixels
var nextPieceAreaYOffset = blockWidth * 2; //pixels
var nextPieceAreaHeight  = 3;

var NextPieceArea = React.createClass({
  render: function() {
    return <NextPiece piece={this.props.piece}/>
  }
});

/**
 * @props piece object
 */
var NextPiece = React.createClass({
  render: function() {
    var piece = this.props.piece;
    var colorHtmlCode = piece.color.toHtmlCode();
    var blocks = piece.blocks.map(function(block, index) {
      return <rect
        width={blockWidth}
        height={blockWidth} 
        x={block.col * blockWidth + nextPieceAreaXOffset} 
        y={(nextPieceAreaHeight - block.row - 1) * blockWidth + nextPieceAreaYOffset}
        fill={colorHtmlCode}
        stroke={Constants.bgColorHtmlCode}
      />
    });

    return <g id='nextPiece'>{blocks}</g>;
  }
});

var NextPieceBorder = React.createClass({
  render: function() {

  }
});

export default NextPieceArea;