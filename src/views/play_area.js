import Constants from '../constants.js';
import CurrentPiece from './current_piece.js';
import PlayBlock from './play_block.js';
import PlayerState from '../models/player_state.js';
import React from 'react';

function PlayArea(props) {
  return (
    <div>
      <svg width={Constants.playAreaWidth} height={Constants.playAreaHeight}>
        <g>
          <PlayAreaBlocks field={props.field} state={props.state}/>
          {
            props.piece ?
            <CurrentPiece key={props.piece.count} piece={props.piece} field={props.field}/> :
            null
          }
          <PlayAreaBorder/>
        </g>
      </svg>
      {props.state.id === PlayerState.end ?
        <div className="pin">
          <div className="end">Game Over</div>
        </div> : null
      }
    </div>
  );
}

function PlayAreaBorder(props) {
  var playAreaXOffset = Constants.playAreaXOffset;
  var playAreaYOffset = Constants.playAreaYOffset;
  var gridWidth = Constants.gridWidth;
  var gridHeight = Constants.gridHeight;
  var blockWidth = Constants.blockWidth;
  return (
    <g>
      <line key='top-border' strokeWidth={1} stroke='#464741'
      x1={playAreaXOffset} y1={playAreaYOffset}
      x2={gridWidth * blockWidth + playAreaXOffset} y2={playAreaYOffset} />

      <line key='left-border' strokeWidth={1} stroke='#464741'
      x1={playAreaXOffset} y1={playAreaYOffset}
      x2={playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />
      
      <line key='bottom-border' strokeWidth={1} stroke='#464741'
      x1={playAreaXOffset} y1={gridHeight * blockWidth + playAreaYOffset}
      x2={gridWidth * blockWidth + playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />

      <line key='right-border' strokeWidth={1} stroke='#464741'
      x1={gridWidth * blockWidth + playAreaXOffset} y1={playAreaYOffset}
      x2={gridWidth * blockWidth + playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />
    </g>
  );
}

function makeBlocksToRender(field, state) {
  var res = [];

  for(var row = 0; row < field.height; row++) {
    for(var col = 0; col < field.width; col++) {
      var block = field.blocks[row][col];
      if(block != null) {
        var colorHtmlCode = block.color.toHtmlCode();
        switch (state.id) {
          case PlayerState.normal:
          case PlayerState.end:
            res.push(<PlayBlock key={row + ' ' + col} row={row} col={col} colorHtmlCode={colorHtmlCode}/>);
            break;
          case PlayerState.purge:
            var blinkCount = state.blinkCount;
            var completeRows = state.completeRows;

            // If blink count is {1, 3, 5, ...} or row is not completed
            // show the row. Else hide the row.
            if (blinkCount % 2 != 0 || !completeRows.includes(row))
              res.push(<PlayBlock key={row + ' ' + col} row={row} col={col} colorHtmlCode={colorHtmlCode}/>);
        }
      }
    }
  }
  return res;
}

function PlayAreaBlocks(props) {
  var blocks = makeBlocksToRender(props.field, props.state);
  return <g>{blocks}</g>
}

export default PlayArea;