/**
 * A view that draws a single square block in the play area.
 *
 * @prop row integer
 * @prop col integer
 */
var PlayBlock = React.createClass({
    render: function() {
        return (
            <rect width={blockWidth} height={blockWidth} 
                x={this.props.col * blockWidth + playAreaXOffset} 
                y={(gridHeight - this.props.row - 1) * blockWidth + playAreaYOffset}
                fill='#000'
            />
        )
    }
});