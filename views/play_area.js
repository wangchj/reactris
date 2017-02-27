/**
 * @prop field object
 * @prop piece object
 * @prop state string
 */
var PlayArea = React.createClass({
    render: function() {
        return (
            <g>
                <PlayAreaBlocks field={this.props.field} state={this.props.state}/>
                {
                    this.props.piece ? 
                    <CurrentPiece key={this.props.piece.count} piece={this.props.piece} field={this.props.field}/> : 
                    null
                }
                <PlayAreaBorder/>
            </g>
        );
    }
});

var PlayAreaBorder = React.createClass({
    render: function() {
        return (
            <g>
                <line key='top-border' strokeWidth={1} stroke='#000'
                x1={playAreaXOffset} y1={playAreaYOffset}
                x2={gridWidth * blockWidth + playAreaXOffset} y2={playAreaYOffset} />

                <line key='left-border' strokeWidth={1} stroke='#000'
                x1={playAreaXOffset} y1={playAreaYOffset}
                x2={playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />
                
                <line key='bottom-border' strokeWidth={1} stroke='#000'
                x1={playAreaXOffset} y1={gridHeight * blockWidth + playAreaYOffset}
                x2={gridWidth * blockWidth + playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />

                <line key='right-border' strokeWidth={1} stroke='#000'
                x1={gridWidth * blockWidth + playAreaXOffset} y1={playAreaYOffset}
                x2={gridWidth * blockWidth + playAreaXOffset} y2={gridHeight * blockWidth + playAreaYOffset} />
            </g>
        );
    }
});

/**
 * @prop field
 * @prop state
 */
var PlayAreaBlocks = React.createClass({
    render: function() {
        var blocks = this.makeBlocksToRender();
        return <g>{blocks}</g>
    },
    makeBlocksToRender: function() {
        var blocks = [];
        var state = this.props.state;

        for(var row = 0; row < this.props.field.height; row++) {
            for(var col = 0; col < this.props.field.width; col++) {
                if(this.props.field.blocks[row][col] != null) {
                    switch (state.id) {
                        case PlayerState.normal:

                        case PlayerState.end:
                            blocks.push(<PlayBlock key={row + ' ' + col} row={row} col={col}/>);
                            break;
                        
                        case PlayerState.cancel:
                            var blinkCount = state.blinkCount;
                            var completeRows = state.completeRows;

                            // If blink count is {1, 3, 5, ...} or row is not completed
                            // show the row. Else hide the row.
                            if (blinkCount % 2 != 0 || !completeRows.includes(row))
                                blocks.push(<PlayBlock key={row + ' ' + col} row={row} col={col}/>);
                    }
                }
            }
        }
        return blocks;
    }
});