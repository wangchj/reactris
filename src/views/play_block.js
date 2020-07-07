import Constants from '../constants.js';
import React from 'react';

var blockWidth = Constants.blockWidth;
var playAreaXOffset = Constants.playAreaXOffset;
var playAreaYOffset = Constants.playAreaYOffset
var gridHeight = Constants.gridHeight;

/**
 * A view that draws a single square block in the play area.
 *
 * @prop row integer
 * @prop col integer
 */
function PlayBlock(props) {
  return (
    <rect width={blockWidth} height={blockWidth} 
      x={props.col * blockWidth + playAreaXOffset} 
      y={(gridHeight - props.row - 1) * blockWidth + playAreaYOffset}
      fill={props.colorHtmlCode}
      stroke={Constants.bgColorHtmlCode}
    />
  )
}

export default PlayBlock;