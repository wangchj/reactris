var CurrentPiece = React.createClass({
    render: function() {
        var field = this.props.field;
        var blocks = this.props.piece.blocks.map(function(block, index){
            if (block.row < field.height)
                return <PlayBlock key={index} row={block.row} col={block.col} />
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