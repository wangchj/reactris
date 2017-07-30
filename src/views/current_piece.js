import PlayBlock from './play_block.js';
import React from 'react';

var CurrentPiece = React.createClass({
  render: function() {
    var field = this.props.field;
    var piece = this.props.piece;
    var colorHtmlCode = piece.color.toHtmlCode();
    var blocks = piece.blocks.map(function(block, index){
      if (block.row < field.height)
        return <PlayBlock key={index} row={block.row} col={block.col} colorHtmlCode={colorHtmlCode}/>
      else
        return null;
    });

    return (
      <g id='currentPiece'>
        {blocks}
      </g>
    );
  }
});

export default CurrentPiece;