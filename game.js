const blockWidth = 20;
const gridWidth = 10; //Number of blocks horizontally
const gridHeight = 20; //Number of blocks vertically
const playAreaXOffset = 20;
const playAreaYOffset = 20;

const blinkDelay = 100; // The time between blinks in ms
const blinkLimit = 2;   //Number of blinks


var Game = React.createClass({
    getInitialState: function() {
        this.paused = false;

        return {
            field: new Field(gridWidth, gridHeight),
            piece: this.makeIntoPlayPiece(new Piece()),
            next: new Piece(),
            delay: 500,
            score: 0,
            state: PlayerState.normal
        };
    },
    componentDidMount: function() {
        $('body').keydown(this.onKeydown);
        this.timer = setInterval(this.delayExpire, this.state.delay);
    },
    delayExpire: function() {
        var piece = this.state.piece;
        var put = false;

        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].row == 0 || 
                (piece.blocks[i].row < gridHeight && 
                this.state.field.blocks[piece.blocks[i].row - 1][piece.blocks[i].col] != null))
            {
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
        var state = this.state.state;
        var blinkCount = state[1];
        var completeRows = state[2];

        if (blinkCount >= blinkLimit) {
            clearInterval(this.blinkTimer);

            // TODO: update score

            this.state.field.clearCompleteRows();

            this.setState({
                field: this.state.field,
                piece: this.makeIntoPlayPiece(this.state.next),
                next: new Piece(),
                state: PlayerState.normal
            });
            
            this.timer = setInterval(this.delayExpire, this.state.delay);
        }
        else {
            this.setState({state:[PlayerState.cancel, blinkCount + 1, completeRows]})
        }
    },
    lowerPiece: function() {
        this.state.piece.translate({rows: -1});
        this.setState({piece: this.state.piece});
        //this.timer = setInterval(this.delayExpire, this.state.delay); 
    },
    putPiece: function() {
        clearInterval(this.timer);

        this.state.field.putPiece(this.state.piece);
        this.setState({field: this.state.field});

        var completeRows = this.state.field.getCompleteRows(); 

        if(completeRows.length > 0) {
            state = [PlayerState.cancel, 0, completeRows];
            this.setState({
                piece: null,
                state: state,
                score: this.state.score + completeRows.length
            });
            this.blinkTimer = setInterval(this.blinkExpire, blinkDelay);
        }
        else {
            this.changePiece();
            this.timer = setInterval(this.delayExpire, this.state.delay);
        }
    },
    changePiece: function() {
        this.setState({piece: this.makeIntoPlayPiece(this.state.next), next: new Piece()})
    },
    render: function(){
        return (
            <svg width="300" height="450">
                <PlayArea field={this.state.field} piece={this.state.piece} state={this.state.state}/>
            </svg>
        );
    },
    makeIntoPlayPiece: function(piece) {
        for(var i = 0; i < piece.blocks.length; i++) {
            piece.blocks[i].col += Math.floor(gridWidth / 2) - 1;
            piece.blocks[i].row += gridHeight;
        }
        return piece;
    },
    colHeight: function(colNum) {
        for(var i = gridHeight; i > 0; i--) {
            if(this.state.field.blocks[i - 1][colNum] != null)
                return i;
        }
        return 0;
    },
    onKeydown:function(event) {
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
        var blocks = this.state.field.blocks;
        var piece = this.state.piece;

        for(var i = 0; i < piece.blocks.length; i++) {
            if (piece.blocks[i].col == 0 || (piece.blocks[i].row < gridHeight && blocks[piece.blocks[i].row][piece.blocks[i].col - 1] != null)) {
                move = false;
                break;
            }
        }

        if(move) {
            for(var i = 0; i < piece.blocks.length; i++)
                piece.blocks[i].col--;
            this.setState({piece: piece});
        }
    },
    right: function() {
        var move = true;
        var blocks = this.state.field.blocks;
        var piece = this.state.piece;

        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].col == gridWidth - 1 || (piece.blocks[i].row < gridHeight && blocks[piece.blocks[i].row][piece.blocks[i].col + 1] != null)) {
                move = false;
                break;
            }
        }

        if(move) {
            for(var i = 0; i < piece.blocks.length; i++)
                piece.blocks[i].col++;
            this.setState({piece: piece});
        }
    },
    down: function() {
        var blocks = this.state.field.blocks;
        var piece = this.state.piece;
        
        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].row == 0 || (piece.blocks[i].row <= gridHeight && blocks[piece.blocks[i].row - 1][piece.blocks[i].col] != null)) {
                this.putPiece();
                return;
            }
        }

        this.lowerPiece();
    },
    drop: function() {
        var blocks = this.state.field.blocks;
        var piece = this.state.piece;
        var min = gridHeight + 1;
        for(var i = 0; i < piece.blocks.length; i++) {
            var colHeight = this.colHeight(piece.blocks[i].col);
            var d = piece.blocks[i].row - colHeight;
            if(d < min)
                min = d;
        }

        if(min > 0)
            for(var i = 0; i < piece.blocks.length; i++)
                piece.blocks[i].row -= min;

        this.putPiece();
    },
    doRot: function() {
        var blocks = this.state.field.blocks;
        var piece = this.state.piece;
        var copy = piece.copy();
        var canRot = true;

        // Rotate the copy
        copy .rotate();

        // Check each block of the copy to see the rotation is permitted
        for(var i = 0; i < copy.blocks.length; i++) {
            if(
                copy.blocks[i].col < 0 || copy.blocks[i].col >= gridWidth ||
                copy.blocks[i].row < 0 ||
                (copy.blocks[i].row < gridHeight && blocks[copy.blocks[i].row][copy.blocks[i].col] != null)
            )
            {
                canRot = false;
                break;
            }
        }

        // If rotate is permitted
        if(canRot) {
            piece.phase = copy.phase;
            piece.blocks = copy.blocks;
            this.setState({piece:piece});
        }
    }
});

var Background = React.createClass({
    render: function() {}
});

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
                    <PieceView key={this.props.piece.count} piece={this.props.piece} /> : 
                    null
                }
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

        for(var row = 0; row < gridHeight; row++) {
            for(var col = 0; col < gridWidth; col++) {
                if(this.props.field.blocks[row][col] != null) {
                    
                    // If state is falling state
                    if (state === PlayerState.normal)
                        blocks.push(
                            <Block key={row + ' ' + col} row={row} col={col} />
                        );
                    // Else, the state is canceling state
                    else {
                        var blinkCount = state[1]
                        var completeRows = state[2];

                        // If blink count is {1, 3, 5, ...} or row is not completed
                        // show the row. Else hide the row.
                        if (blinkCount % 2 != 0 || !completeRows.includes(row))
                            blocks.push(
                                <Block key={row + ' ' + col} row={row} col={col} />
                            );
                    }
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
var PieceView = React.createClass({
    getInitialState: function() {
        return {piece: this.props.piece};
    },
    render: function() {
        var blocks = this.state.piece.blocks.map(function(block, index){
            return (
                <Block key={index} row={block.row} col={block.col} />
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
 * @prop row integer
 * @prop col integer
 */
var Block = React.createClass({
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

React.render(<Game />, document.getElementById('content'));