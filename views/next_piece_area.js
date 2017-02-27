var nextPieceAreaXOffset = blockWidth * 12; //pixels
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
        var blocks = this.props.piece.blocks.map(function(block, index) {
            return <rect
                width={blockWidth}
                height={blockWidth} 
                x={block.col * blockWidth + nextPieceAreaXOffset} 
                y={(nextPieceAreaHeight - block.row - 1) * blockWidth + nextPieceAreaYOffset}
                fill='#000'
            />
        });

        return <g id='nextPiece'>{blocks}</g>;
    }
});

var NextPieceBorder = React.createClass({
    render: function() {

    }
});