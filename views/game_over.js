var GameOver = React.createClass({
    render: function(){
        var field = this.props.player.field;
        var textX = playAreaXOffset + 50;
        var textY = playAreaYOffset + (field.height * blockWidth / 2) + 5;
        var boxX =  playAreaXOffset + 40;
        var boxY = playAreaYOffset + (field.height * blockWidth / 2) - 20;
        var boxWidth = field.width * blockWidth - 80;
        var boxHeight = blockWidth * 2

        return (
            <g>
                <rect x={boxX} y={boxY} width={boxWidth} height={boxHeight} fill="#fff"/>
                <text x={textX} y={textY} style={{fontFamily:'GameOver',fontSize:'24px'}}>Game Over</text>
            </g>
        );
    }
});