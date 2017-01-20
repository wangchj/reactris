const blockWidth = 20;
const gridWidth = 10; //Number of blocks horizontally
const gridHeight = 20; //Number of blocks vertically
const playAreaXOffset = 20;
const playAreaYOffset = 20;

//Piece types
const pieceType = {
    st: 0, z:1, rz:2, s:3, l:4, rl:5, r:6
};

var Game = React.createClass({
    getInitialState: function() {
        this.pcount = 0;
        this.paused = false;

        return {
            blocks: this.initField(),
            piece: this.makeIntoPlayPiece(this.makeRandomPiece()),
            next: this.makeRandomPiece(),
            delay: 500,
            score: 0,
            mode: 0
        };
    },
    componentDidMount: function() {
        $('body').keydown(this.onKeydown);
        this.timer = setInterval(this.delayExpire, this.state.delay);
    },
    delayExpire: function() {
        //clearInterval(this.timer);
        //console.log('delayExpire');
        //console.log(this.state.blocks.toString());
        var piece = this.state.piece;
        var put = false;

        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].y == 0 ||
                this.state.blocks[piece.blocks[i].x][piece.blocks[i].y - 1] != null) {
                put = true;
                break;
            }
        }

        if(put)
            this.putPiece();
        else
            this.lowerPiece();
    },
    blinkExpire: function() {
        console.log('blinkExpire');
    },
    lowerPiece: function() {
        var piece = this.state.piece;
        for(var i = 0; i < piece.blocks.length; i++)
            piece.blocks[i].y--;
        this.setState({piece: piece});
        //this.timer = setInterval(this.delayExpire, this.state.delay); 
    },
    putPiece: function() {
        clearInterval(this.timer);

        console.log('putPiece()');

        this.mergePiece();
            
        completeRows = this.getCompleteRows(); 
        console.log(completeRows.length);
        if(completeRows.length > 0) {
            mode = [1, 0, completeRows]; //1 for elimination mode
            this.setState({mode: mode, score: this.state.score + completeRows.length});
            this.blinkTime = setInterval(this.blinkExpire, 1000);
        }
        else {
            this.changePiece();
            this.timer = setInterval(this.delayExpire, this.state.delay);
        }
    },
    mergePiece: function() {
        console.log('mergePiece()');
        var piece = this.state.piece;
        var blocks = this.state.blocks;
        for(var i = 0; i < piece.blocks.length; i++) {
            var b = piece.blocks[i];
            blocks[b.x][b.y] = b;
        }
        this.setState({blocks: blocks});
    },
    changePiece: function() {
        console.log('changePiece()');
        this.setState({piece: this.makeIntoPlayPiece(this.state.next), next: this.makeRandomPiece()})
    },
    initField: function() {
        var rows = [];
        for(var row = 0; row < gridHeight; row++) {
            var cols = [];
            for(var col = 0; col < gridWidth; col++) {
                cols.push(null);
            }
            rows.push(cols);
        }
        return rows;
    },
    getCompleteRows: function() {
        var res = [];

        for(var row = 0; row < gridHeight; row++) {
            var addRow = true;
            for(var col = 0; col < gridWidth; col++) {
                if(this.state.blocks[col][row] == null) {
                    addRow = false;
                    break;
                }
            }

            if(addRow) res.push(row);
        }

        return res;
    },
    render: function(){
        return (
            <svg width="500" height="450">
                <PlayArea blocks={this.state.blocks} piece={this.state.piece} />
            </svg>
        );
    },
    makeIntoPlayPiece: function(piece) {
        for(var i = 0; i < piece.blocks.length; i++) {
            piece.blocks[i].x += Math.floor(gridWidth / 2) - 1;
            piece.blocks[i].y += gridHeight;
        }
        return piece;
    },
    makeRandomPiece: function() {
        return this.makePiece(Math.floor(Math.random() * 7));
    },
    makePiece: function(type) {
        this.pcount++;

        switch(type) {
            case pieceType.st: //Straight piece
                return {
                    type: pieceType.st,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {x:0, y:0, visible:true},
                        {x:1, y:0, visible:true},
                        {x:2, y:0, visible:true},
                        {x:3, y:0, visible:true}
                    ]
                };
            case pieceType.z:  //Z piece
                return {
                    type: pieceType.z,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {x:0, y:1, visible:true},
                        {x:1, y:1, visible:true},
                        {x:1, y:0, visible:true},
                        {x:2, y:0, visible:true}
                    ]
                };
            case pieceType.rz: //Reverse Z piece
                return {
                    type: pieceType.rz,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {x:1, y:1, visible:true},
                        {x:2, y:1, visible:true},
                        {x:0, y:0, visible:true},
                        {x:1, y:0, visible:true}
                    ]
                };
            case pieceType.s:  //Square piece
                return {
                    type: pieceType.s,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {x:0, y:1, visible:true},
                        {x:1, y:1, visible:true},
                        {x:0, y:0, visible:true},
                        {x:1, y:0, visible:true}
                    ]
                };
            case pieceType.l:  //L piece
                return {
                    type: pieceType.l,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {x:0, y:2, visible:true},
                        {x:0, y:1, visible:true},
                        {x:0, y:0, visible:true},
                        {x:1, y:0, visible:true}
                    ]
                };
            case pieceType.rl: //Reverse L piece
                return {
                    type: pieceType.rl,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {x:1, y:2, visible:true},
                        {x:1, y:1, visible:true},
                        {x:0, y:0, visible:true},
                        {x:1, y:0, visible:true}
                    ]
                };
            case pieceType.r:  //Right angle piece
                return {
                    type: pieceType.r,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {x:1, y:1, visible:true},
                        {x:0, y:0, visible:true},
                        {x:1, y:0, visible:true},
                        {x:2, y:0, visible:true}
                    ]
                };
        }
    },
    /**
     * Duplicates a piece.
     */
    copyPiece: function(piece) {
        var blocks = [];
        for(var i = 0; i < piece.blocks.length; i++) {
            blocks.push({
                x: piece.blocks[i].x,
                y: piece.blocks[i].y,
                visible: piece.blocks[i].visible
            });
        }

        return {
            type: piece.type,
            count: piece.count,
            phase: piece.phase,
            blocks: blocks
        };
    },
    colHeight: function(colNum) {
        for(var i = gridHeight; i > 0; i--) {
            if(this.state.blocks[colNum][i - 1] != null)
                return i;
        }
        return 0;
    },
    onKeydown:function(event) {
        //console.log('onKeydown()');
        //console.log(event);
        if(this.paused && event.which != 80)
            return;

        switch(event.which) {
            case 32: this.drop(); break;        //32: space bar
            case 37: this.left(); break;        //37: arrow left
            case 38: this.doRot(); break;       //38: arrow up
            case 39: this.right(); break;       //39: arrow right
            case 40: this.down(); break;        //40: arrow down
            case 80: this.togglePause(); break; //80: p
        }
    },
    togglePause: function() {
        if(this.paused) {
            this.timer = setInterval(this.delayExpire, this.state.delay);
            this.paused = false;
        }
        else {
            clearInterval(this.timer);
            this.paused = true;
        }
    },
    left: function() {
        var move = true;
        var blocks = this.state.blocks;
        var piece = this.state.piece;

        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].x == 0 || blocks[piece.blocks[i].x - 1][piece.blocks[i].y] != null) {
                move = false;
                break;
            }
        }

        if(move) {
            for(var i = 0; i < piece.blocks.length; i++)
                piece.blocks[i].x--;
            this.setState({piece: piece});
        }
    },
    right: function() {
        var move = true;
        var blocks = this.state.blocks;
        var piece = this.state.piece;

        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].x == gridWidth - 1 || blocks[piece.blocks[i].x + 1][piece.blocks[i].y] != null) {
                move = false;
                break;
            }
        }

        if(move) {
            for(var i = 0; i < piece.blocks.length; i++)
                piece.blocks[i].x++;
            this.setState({piece: piece});
        }
    },
    down: function() {
        var blocks = this.state.blocks;
        var piece = this.state.piece;
        
        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].y == 0 || blocks[piece.blocks[i].x][piece.blocks[i].y - 1] != null) {
                this.putPiece();
                return;
            }
        }

        this.lowerPiece();
    },
    drop: function() {
        var blocks = this.state.blocks;
        var piece = this.state.piece;
        var min = gridHeight + 1;
        for(var i = 0; i < piece.blocks.length; i++) {
            var colHeight = this.colHeight(piece.blocks[i].x);
            var d = piece.blocks[i].y - colHeight;
            if(d < min)
                min = d;
        }

        if(min > 0)
            for(var i = 0; i < piece.blocks.length; i++)
                piece.blocks[i].y -= min;

        this.putPiece();
    },
    doRot: function() {
        var blocks = this.state.blocks;
        var piece = this.state.piece;
        var copy = this.copyPiece(piece);

        //console.log(copy);

        copy = this.rotate(copy);
        canRot = true;

        //console.log(copy);

        for(var i = 0; i < copy.blocks.length; i++) {
            if(
                copy.blocks[i].x < 0 || copy.blocks[i].x >= gridWidth ||
                copy.blocks[i].y < 0 || copy.blocks[i].y >= gridHeight ||
                blocks[copy.blocks[i].x][copy.blocks[i].y] != null
            )
            {
                canRot = false;
                break;
            }
        }

        if(canRot) {
            piece.phase = copy.phase;
            piece.blocks = copy.blocks;
            this.setState({piece:piece});
        }
    },
    rotate: function(piece) {
        switch(piece.type) {
            case pieceType.st: //Straight piece
                if(piece.phase == 0) {
                    piece.blocks[0].x = piece.blocks[1].x; piece.blocks[0].y = piece.blocks[1].y + 1;
                    piece.blocks[2].x = piece.blocks[1].x; piece.blocks[2].y = piece.blocks[1].y - 1;
                    piece.blocks[3].x = piece.blocks[1].x; piece.blocks[3].y = piece.blocks[1].y - 2;
                    piece.phase = 1;
                }
                else {
                    piece.blocks[0].x = piece.blocks[1].x - 1; piece.blocks[0].y = piece.blocks[1].y;
                    piece.blocks[2].x = piece.blocks[1].x + 1; piece.blocks[2].y = piece.blocks[1].y;
                    piece.blocks[3].x = piece.blocks[1].x + 2; piece.blocks[3].y = piece.blocks[1].y;
                    piece.phase = 0;
                }
                break;
            case pieceType.z:  //Z piece
                if(piece.phase == 0) {
                    piece.blocks[0].x = piece.blocks[2].x + 1; piece.blocks[0].y = piece.blocks[2].y + 1;
                    piece.blocks[1].x = piece.blocks[2].x + 1; piece.blocks[1].y = piece.blocks[2].y;
                    piece.blocks[3].x = piece.blocks[2].x; piece.blocks[3].y = piece.blocks[2].y - 1;
                    piece.phase = 1;
                }
                else {
                    piece.blocks[0].x = piece.blocks[2].x - 1; piece.blocks[0].y = piece.blocks[2].y + 1;
                    piece.blocks[1].x = piece.blocks[2].x; piece.blocks[1].y = piece.blocks[2].y + 1;
                    piece.blocks[3].x = piece.blocks[2].x + 1; piece.blocks[3].y = piece.blocks[2].y;
                    piece.phase = 0;
                }
                break;
            case pieceType.rz: //Reverse Z piece
                if(piece.phase == 0) {
                    piece.blocks[0].x = piece.blocks[3].x - 1; piece.blocks[0].y = piece.blocks[3].y;
                    piece.blocks[1].x = piece.blocks[3].x - 1; piece.blocks[1].y = piece.blocks[3].y + 1;
                    piece.blocks[2].x = piece.blocks[3].x; piece.blocks[2].y = piece.blocks[3].y - 1;
                    piece.phase = 1;
                }
                else {
                    piece.blocks[0].x = piece.blocks[3].x; piece.blocks[0].y = piece.blocks[3].y + 1;
                    piece.blocks[1].x = piece.blocks[3].x + 1; piece.blocks[1].y = piece.blocks[3].y + 1;
                    piece.blocks[2].x = piece.blocks[3].x - 1; piece.blocks[2].y = piece.blocks[3].y;
                    piece.phase = 0;
                }
                break;
            case pieceType.s:  //Square piece
                break;
            case pieceType.l:  //L piece
                if(piece.phase == 0) {
                    piece.blocks[0].x = piece.blocks[1].x + 1; piece.blocks[0].y = piece.blocks[1].y;
                    piece.blocks[2].x = piece.blocks[1].x - 1; piece.blocks[2].y = piece.blocks[1].y;
                    piece.blocks[3].x = piece.blocks[1].x - 1; piece.blocks[3].y = piece.blocks[1].y - 1;
                    piece.phase = 1;
                }
                else if(piece.phase == 1) {
                    piece.blocks[0].x = piece.blocks[1].x; piece.blocks[0].y = piece.blocks[1].y - 1;
                    piece.blocks[2].x = piece.blocks[1].x; piece.blocks[2].y = piece.blocks[1].y + 1;
                    piece.blocks[3].x = piece.blocks[1].x - 1; piece.blocks[3].y = piece.blocks[1].y + 1;
                    piece.phase = 2;
                }
                else if(piece.phase == 2) {
                    piece.blocks[0].x = piece.blocks[1].x - 1; piece.blocks[0].y = piece.blocks[1].y;
                    piece.blocks[2].x = piece.blocks[1].x + 1; piece.blocks[2].y = piece.blocks[1].y;
                    piece.blocks[3].x = piece.blocks[1].x + 1; piece.blocks[3].y = piece.blocks[1].y + 1;
                    piece.phase = 3;
                }
                else {
                    piece.blocks[0].x = piece.blocks[1].x; piece.blocks[0].y = piece.blocks[1].y + 1;
                    piece.blocks[2].x = piece.blocks[1].x; piece.blocks[2].y = piece.blocks[1].y - 1;
                    piece.blocks[3].x = piece.blocks[1].x + 1; piece.blocks[3].y = piece.blocks[1].y - 1;
                    piece.phase = 0;
                }
                break;
            case pieceType.rl: //Reverse L piece
                if(piece.phase == 0) {
                    piece.blocks[0].x = piece.blocks[1].x + 1; piece.blocks[0].y = piece.blocks[1].y;
                    piece.blocks[2].x = piece.blocks[1].x - 1; piece.blocks[2].y = piece.blocks[1].y;
                    piece.blocks[3].x = piece.blocks[1].x - 1; piece.blocks[3].y = piece.blocks[1].y + 1;
                    piece.phase = 1;
                }
                else if(piece.phase == 1) {
                    piece.blocks[0].x = piece.blocks[1].x; piece.blocks[0].y = piece.blocks[1].y - 1;
                    piece.blocks[2].x = piece.blocks[1].x; piece.blocks[2].y = piece.blocks[1].y + 1;
                    piece.blocks[3].x = piece.blocks[1].x + 1; piece.blocks[3].y = piece.blocks[1].y + 1;
                    piece.phase = 2;
                }
                else if(piece.phase == 2) {
                    piece.blocks[0].x = piece.blocks[1].x - 1; piece.blocks[0].y = piece.blocks[1].y;
                    piece.blocks[2].x = piece.blocks[1].x + 1; piece.blocks[2].y = piece.blocks[1].y;
                    piece.blocks[3].x = piece.blocks[1].x + 1; piece.blocks[3].y = piece.blocks[1].y - 1;
                    piece.phase = 3;
                }
                else {
                    piece.blocks[0].x = piece.blocks[1].x; piece.blocks[0].y = piece.blocks[1].y + 1;
                    piece.blocks[2].x = piece.blocks[1].x; piece.blocks[2].y = piece.blocks[1].y - 1;
                    piece.blocks[3].x = piece.blocks[1].x - 1; piece.blocks[3].y = piece.blocks[1].y - 1;
                    piece.phase = 0;
                }
                break;
            case pieceType.r:  //Right angle piece
                if(piece.phase == 0) {
                    piece.blocks[0].x = piece.blocks[2].x + 1; piece.blocks[0].y = piece.blocks[2].y;
                    piece.blocks[1].x = piece.blocks[2].x; piece.blocks[1].y = piece.blocks[2].y + 1;
                    piece.blocks[3].x = piece.blocks[2].x; piece.blocks[3].y = piece.blocks[2].y - 1;
                    piece.phase = 1;
                }
                else if(piece.phase == 1) {
                    piece.blocks[0].x = piece.blocks[2].x; piece.blocks[0].y = piece.blocks[2].y - 1;
                    piece.blocks[1].x = piece.blocks[2].x + 1; piece.blocks[1].y = piece.blocks[2].y;
                    piece.blocks[3].x = piece.blocks[2].x - 1; piece.blocks[3].y = piece.blocks[2].y;
                    piece.phase = 2;
                }
                else if(piece.phase == 2) {
                    piece.blocks[0].x = piece.blocks[2].x - 1; piece.blocks[0].y = piece.blocks[2].y;
                    piece.blocks[1].x = piece.blocks[2].x; piece.blocks[1].y = piece.blocks[2].y - 1;
                    piece.blocks[3].x = piece.blocks[2].x; piece.blocks[3].y = piece.blocks[2].y + 1;
                    piece.phase = 3;
                }
                else {
                    piece.blocks[0].x = piece.blocks[2].x; piece.blocks[0].y = piece.blocks[2].y + 1;
                    piece.blocks[1].x = piece.blocks[2].x - 1; piece.blocks[1].y = piece.blocks[2].y;
                    piece.blocks[3].x = piece.blocks[2].x + 1; piece.blocks[3].y = piece.blocks[2].y;
                    piece.phase = 0;
                }
        }
        return piece;
    }
});

var Background = React.createClass({
    render: function() {}
});

/**
 * @prop blocks array<block>
 * @prop piece  object
 */
var PlayArea = React.createClass({
    render: function() {
        return (
            <g>
                <PlayAreaBlocks blocks={this.props.blocks} />
                <Piece key={this.props.piece.count} piece={this.props.piece} />
                <PlayAreaBorder />
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
 * @prop blocks
 */
var PlayAreaBlocks = React.createClass({
    render: function() {
        var blocks = this.makeBlocksToRender();
        //console.log('PlayAreaBlocks.render()');
        //console.log(blocks);
        return <g>{blocks}</g>
    },
    makeBlocksToRender: function() {
        var blocks = [];
        for(var row = 0; row < gridHeight; row++) {
            for(var col = 0; col < gridWidth; col++) {
                if(this.props.blocks[col][row] != null) {
                    blocks.push(
                        <Block key={col + ' ' + row} x={col} y={row} visible={this.props.blocks[col][row].visible} />
                    );
                }
            }
        }
        return blocks;
    }
});

var ScoreArea = React.createClass({
    render: function() {

    }
});

var NextPieceArea = React.createClass({
    render: function() {

    }
});

/**
 * @prop piece object {type: integer, blocks: array<block>}
 */
var Piece = React.createClass({
    getInitialState: function() {
        //console.log(this.props.piece);
        return {piece: this.props.piece};
    },
    render: function() {
        var blocks = this.state.piece.blocks.map(function(block, index){
            return (
                <Block key={index} x={block.x} y={block.y} visible={block.visible} />
            )
        });
        return (
            <g id='currentPiece'>
                {blocks}
            </g>
        );
    }
});

/**
 * @prop x integer
 * @prop y integer
 * @prop visible boolean
 */
var Block = React.createClass({
    render: function() {
        if(this.props.visible && this.props.x >= 0 && this.props.x < gridWidth && this.props.y >=0 && this.props.y < gridHeight)
            return (
                <rect width={blockWidth} height={blockWidth} 
                x={this.props.x * blockWidth + playAreaXOffset} 
                y={(gridHeight - this.props.y - 1) * blockWidth + playAreaYOffset}
                fill='#000' />
            );
        else
            return null;
    }
});

React.render(<Game />, document.getElementById('content'));