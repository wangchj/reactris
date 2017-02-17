// Dependencies: Player

function GameController() {
    this.paused = false;
    this.player = new Player();
    this.player.update = this.onPlayerUpdate.bind(this);
}

GameController.prototype = {
    onPlayerUpdate: function(completeRows) {
        this.render();
    },
    start: function() {
        $('body').keydown(this.onKeydown.bind(this));
        this.render();
        this.player.start();
    },
    onKeydown:function(event) {
        if(this.paused && event.which != 80)
            return;

        switch(event.which) {
            case 32: this.player.drop(); break;  //32: space bar
            case 37: this.player.left(); break;  //37: arrow left
            case 38: this.player.doRot(); break; //38: arrow up
            case 39: this.player.right(); break; //39: arrow right
            case 40: this.player.down(); break;  //40: arrow down
            case 80: this.togglePause(); break;  //80: p
        }
    },
    togglePause: function() {
        if(this.paused) {
            this.player.pause(false);
            this.paused = false;
        }
        else {
            this.player.pause(true);
            this.paused = true;
        }
    },
    render: function() {
        React.render(<Game model={this} />, document.getElementById('content'));
    }
}

var game = new GameController();
game.start();


