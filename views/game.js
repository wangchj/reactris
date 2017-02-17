var Game = React.createClass({
	propTypes: {
    	model: React.PropTypes.object.isRequired
  	},
    render: function(){
        return (
            <svg width="300" height="450">
                <PlayArea field={this.props.model.player.field} piece={this.props.model.player.piece} state={this.props.model.player.state}/>
            </svg>
        );
    }
});