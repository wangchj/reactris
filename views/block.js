/**
 * @prop row integer
 * @prop col integer
 */
var BlockView = React.createClass({
    render: function() {
        if(this.props.col >= 0 && this.props.col < gridWidth && this.props.row >= 0 && this.props.row < gridHeight)
            return (
                <rect width={blockWidth} height={blockWidth} 
                x={this.props.col * blockWidth + playAreaXOffset} 
                y={(gridHeight - this.props.row - 1) * blockWidth + playAreaYOffset}
                fill='#000' />
            );
        else
            return null;
    }
});