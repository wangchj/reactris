import Constants from '../constants.js';
import React from 'react';

const blockWidth = Constants.blockWidth;
const height  = 2; // The height of the next piece area, in number of blocks

function NextPieceArea(props) {
  return (
    <svg width={80} height={50}>
      <NextPiece piece={props.piece}/>
    </svg>
  );
}

/**
 * @props piece object
 */
function NextPiece(props) {
  var piece = props.piece;
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

function NextPieceBorder(props) {}

export default NextPieceArea;