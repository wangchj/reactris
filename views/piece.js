/**
 * @prop piece object {type: integer, blocks: array<block>}
 */
var PieceView = React.createClass({
    // getInitialState: function() {
    //     return {piece: this.props.piece};
    // },
    render: function() {
        var blocks = this.props.piece.blocks.map(function(block, index){
            return (
                <BlockView key={index} row={block.row} col={block.col} />
            )
        });
        return (
            <g id='currentPiece'>
                {blocks}
            </g>
        );
    }
});