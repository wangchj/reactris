var Game = React.createClass({
    propTypes: {
        model: React.PropTypes.object.isRequired
    },
    render: function(){
        return (
            <svg width="350" height="450">
                <PlayArea field={this.props.model.player.field} piece={this.props.model.player.piece} state={this.props.model.player.state}/>
                <NextPieceArea piece={this.props.model.player.next}/>
                {this.props.model.player.state.id == PlayerState.end ? <GameOver player={this.props.model.player}/> : null} 
            </svg>
        );
    }
});