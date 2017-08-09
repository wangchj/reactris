import Constants from '../constants.js';
import React from 'react';

const blockWidth = Constants.blockWidth;
const height  = 2; // The height of the next piece area, in number of blocks

var NextPieceArea = React.createClass({
  render: function() {
    return (
      <svg width={100} height={150}>
        <NextPiece piece={this.props.piece}/>
      </svg>
    );
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
        width  = {blockWidth}
        height = {blockWidth}
        x = {block.col * blockWidth + blockWidth}
        y = {(height - block.row - 1) * blockWidth}
        fill = {colorHtmlCode}
        stroke = {Constants.bgColorHtmlCode}
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