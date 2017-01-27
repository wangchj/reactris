const blockWidth = 20;
const gridWidth = 10; //Number of blocks horizontally
const gridHeight = 20; //Number of blocks vertically
const playAreaXOffset = 20;
const playAreaYOffset = 20;

const blinkDelay = 100; // The time between blinks in ms
const blinkLimit = 2;   //Number of blinks
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
        var piece = this.state.piece;
        var put = false;

        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].row == 0 || 
                (piece.blocks[i].row < gridHeight && 
                this.state.blocks[piece.blocks[i].row - 1][piece.blocks[i].col] != null))
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
        console.log('blinkExpire');
        var mode = this.state.mode;
        var blinkCount = mode[1];
        var completeRows = mode[2];

        if (blinkCount >= blinkLimit) {
            clearInterval(this.blinkTimer);

            // TODO: update score

            this.clearCompleteRows();

            this.setState({
                blocks: this.state.blocks,
                piece: this.makeIntoPlayPiece(this.state.next),
                next: this.makeRandomPiece(),
                mode: 0
            });
            
            this.timer = setInterval(this.delayExpire, this.state.delay);
        }
        else {
            this.setState({mode:[1, blinkCount + 1, completeRows]})
        }
    },
    clearCompleteRows: function() {
        console.log('clearCompleteRows()');
        
        var completeRows = this.state.mode[2];
        if (completeRows.length == 0)
            return;

        var stackHeight = this.getStackHeight();
        console.log('stack height', stackHeight);
        

        var shiftCount = 0;

        for (var row = 0; row < stackHeight; row++) {
            if (shiftCount < completeRows.length && completeRows[shiftCount] == row)
                shiftCount++;
            else if (shiftCount != 0) {
                for (var col = 0; col < gridWidth; col++)
                    this.state.blocks[row - shiftCount][col] = this.state.blocks[row][col];
            }

            if (row >= stackHeight - completeRows.length) {
                for (var col = 0; col < gridWidth; col++)
                    this.state.blocks[row][col] = null;
            }
        }

        //this.setState({blocks:this.state.blocks});

    },
    getStackHeight: function() {
        var result = 0;
        var blocks = this.state.blocks;
        console.log(blocks);
        for (var row = 0; row < gridHeight; row++) {
            for (var col = 0; col < gridWidth; col++) {
                if (blocks[row][col] != null) {
                    result++;
                    break;
                }
            }
        }
        return result;
    },
    lowerPiece: function() {
        var piece = this.state.piece;
        for(var i = 0; i < piece.blocks.length; i++)
            piece.blocks[i].row--;
        this.setState({piece: piece});
        //this.timer = setInterval(this.delayExpire, this.state.delay); 
    },
    putPiece: function() {
        clearInterval(this.timer);

        console.log('putPiece()');

        this.mergePiece();
            
        completeRows = this.getCompleteRows(); 
        //console.log(completeRows.length);
        if(completeRows.length > 0) {
            mode = [1, 0, completeRows]; //1 for elimination mode
            this.setState({
                piece: null,
                mode: mode,
                score: this.state.score + completeRows.length
            });
            this.blinkTimer = setInterval(this.blinkExpire, blinkDelay);
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
            blocks[b.row][b.col] = true;
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
                if(this.state.blocks[row][col] == null) {
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
            <svg width="300" height="450">
                <PlayArea blocks={this.state.blocks} piece={this.state.piece} mode={this.state.mode}/>
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
                        {row:0, col:0},
                        {row:0, col:1},
                        {row:0, col:2},
                        {row:0, col:3}
                    ]
                };
            case pieceType.z:  //Z piece
                return {
                    type: pieceType.z,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {row:1, col:0},
                        {row:1, col:1},
                        {row:0, col:1},
                        {row:0, col:2}
                    ]
                };
            case pieceType.rz: //Reverse Z piece
                return {
                    type: pieceType.rz,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {row:1, col:1},
                        {row:1, col:2},
                        {row:0, col:0},
                        {row:0, col:1}
                    ]
                };
            case pieceType.s:  //Square piece
                return {
                    type: pieceType.s,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {row:1, col:0},
                        {row:1, col:1},
                        {row:0, col:0},
                        {row:0, col:1}
                    ]
                };
            case pieceType.l:  //L piece
                return {
                    type: pieceType.l,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {row:2, col:0},
                        {row:1, col:0},
                        {row:0, col:0},
                        {row:0, col:1}
                    ]
                };
            case pieceType.rl: //Reverse L piece
                return {
                    type: pieceType.rl,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {row:2, col:1},
                        {row:1, col:1},
                        {row:0, col:0},
                        {row:0, col:1}
                    ]
                };
            case pieceType.r:  //Right angle piece
                return {
                    type: pieceType.r,
                    count: this.pcount,
                    phase: 0,
                    blocks: [
                        {row:1, col:1},
                        {row:0, col:0},
                        {row:0, col:1},
                        {row:0, col:2}
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
                row: piece.blocks[i].row,
                col: piece.blocks[i].col
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
            if(this.state.blocks[i - 1][colNum] != null)
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
            if(piece.blocks[i].col == 0 || blocks[piece.blocks[i].row][piece.blocks[i].col - 1] != null) {
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
        var blocks = this.state.blocks;
        var piece = this.state.piece;

        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].col == gridWidth - 1 || blocks[piece.blocks[i].row][piece.blocks[i].col + 1] != null) {
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
        var blocks = this.state.blocks;
        var piece = this.state.piece;
        
        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].row == 0 || blocks[piece.blocks[i].row - 1][piece.blocks[i].col] != null) {
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
        var blocks = this.state.blocks;
        var piece = this.state.piece;
        var copy = this.copyPiece(piece);

        //console.log(copy);

        copy = this.rotate(copy);
        canRot = true;

        //console.log(copy);

        for(var i = 0; i < copy.blocks.length; i++) {
            if(
                copy.blocks[i].col < 0 || copy.blocks[i].col >= gridWidth ||
                copy.blocks[i].row < 0 || copy.blocks[i].row >= gridHeight ||
                blocks[copy.blocks[i].row][copy.blocks[i].col] != null
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
                if(piece.phase == 0) { // Phase 0: horizontal
                    piece.blocks[0].col = piece.blocks[1].col; piece.blocks[0].row = piece.blocks[1].row + 1;
                    piece.blocks[2].col = piece.blocks[1].col; piece.blocks[2].row = piece.blocks[1].row - 1;
                    piece.blocks[3].col = piece.blocks[1].col; piece.blocks[3].row = piece.blocks[1].row - 2;
                    piece.phase = 1;
                }
                else { // Phase 1: vertical
                    piece.blocks[0].col = piece.blocks[1].col - 1; piece.blocks[0].row = piece.blocks[1].row;
                    piece.blocks[2].col = piece.blocks[1].col + 1; piece.blocks[2].row = piece.blocks[1].row;
                    piece.blocks[3].col = piece.blocks[1].col + 2; piece.blocks[3].row = piece.blocks[1].row;
                    piece.phase = 0;
                }
                break;
            case pieceType.z:  //Z piece
                if(piece.phase == 0) {
                    piece.blocks[0].col = piece.blocks[2].col + 1; piece.blocks[0].row = piece.blocks[2].row + 1;
                    piece.blocks[1].col = piece.blocks[2].col + 1; piece.blocks[1].row = piece.blocks[2].row;
                    piece.blocks[3].col = piece.blocks[2].col; piece.blocks[3].row = piece.blocks[2].row - 1;
                    piece.phase = 1;
                }
                else {
                    piece.blocks[0].col = piece.blocks[2].col - 1; piece.blocks[0].row = piece.blocks[2].row + 1;
                    piece.blocks[1].col = piece.blocks[2].col; piece.blocks[1].row = piece.blocks[2].row + 1;
                    piece.blocks[3].col = piece.blocks[2].col + 1; piece.blocks[3].row = piece.blocks[2].row;
                    piece.phase = 0;
                }
                break;
            case pieceType.rz: //Reverse Z piece
                if(piece.phase == 0) {
                    piece.blocks[0].col = piece.blocks[3].col - 1; piece.blocks[0].row = piece.blocks[3].row;
                    piece.blocks[1].col = piece.blocks[3].col - 1; piece.blocks[1].row = piece.blocks[3].row + 1;
                    piece.blocks[2].col = piece.blocks[3].col; piece.blocks[2].row = piece.blocks[3].row - 1;
                    piece.phase = 1;
                }
                else {
                    piece.blocks[0].col = piece.blocks[3].col; piece.blocks[0].row = piece.blocks[3].row + 1;
                    piece.blocks[1].col = piece.blocks[3].col + 1; piece.blocks[1].row = piece.blocks[3].row + 1;
                    piece.blocks[2].col = piece.blocks[3].col - 1; piece.blocks[2].row = piece.blocks[3].row;
                    piece.phase = 0;
                }
                break;
            case pieceType.s:  //Square piece
                break;
            case pieceType.l:  //L piece
                if(piece.phase == 0) {
                    piece.blocks[0].col = piece.blocks[1].col + 1; piece.blocks[0].row = piece.blocks[1].row;
                    piece.blocks[2].col = piece.blocks[1].col - 1; piece.blocks[2].row = piece.blocks[1].row;
                    piece.blocks[3].col = piece.blocks[1].col - 1; piece.blocks[3].row = piece.blocks[1].row - 1;
                    piece.phase = 1;
                }
                else if(piece.phase == 1) {
                    piece.blocks[0].col = piece.blocks[1].col; piece.blocks[0].row = piece.blocks[1].row - 1;
                    piece.blocks[2].col = piece.blocks[1].col; piece.blocks[2].row = piece.blocks[1].row + 1;
                    piece.blocks[3].col = piece.blocks[1].col - 1; piece.blocks[3].row = piece.blocks[1].row + 1;
                    piece.phase = 2;
                }
                else if(piece.phase == 2) {
                    piece.blocks[0].col = piece.blocks[1].col - 1; piece.blocks[0].row = piece.blocks[1].row;
                    piece.blocks[2].col = piece.blocks[1].col + 1; piece.blocks[2].row = piece.blocks[1].row;
                    piece.blocks[3].col = piece.blocks[1].col + 1; piece.blocks[3].row = piece.blocks[1].row + 1;
                    piece.phase = 3;
                }
                else {
                    piece.blocks[0].col = piece.blocks[1].col; piece.blocks[0].row = piece.blocks[1].row + 1;
                    piece.blocks[2].col = piece.blocks[1].col; piece.blocks[2].row = piece.blocks[1].row - 1;
                    piece.blocks[3].col = piece.blocks[1].col + 1; piece.blocks[3].row = piece.blocks[1].row - 1;
                    piece.phase = 0;
                }
                break;
            case pieceType.rl: //Reverse L piece
                if(piece.phase == 0) {
                    piece.blocks[0].col = piece.blocks[1].col + 1; piece.blocks[0].row = piece.blocks[1].row;
                    piece.blocks[2].col = piece.blocks[1].col - 1; piece.blocks[2].row = piece.blocks[1].row;
                    piece.blocks[3].col = piece.blocks[1].col - 1; piece.blocks[3].row = piece.blocks[1].row + 1;
                    piece.phase = 1;
                }
                else if(piece.phase == 1) {
                    piece.blocks[0].col = piece.blocks[1].col; piece.blocks[0].row = piece.blocks[1].row - 1;
                    piece.blocks[2].col = piece.blocks[1].col; piece.blocks[2].row = piece.blocks[1].row + 1;
                    piece.blocks[3].col = piece.blocks[1].col + 1; piece.blocks[3].row = piece.blocks[1].row + 1;
                    piece.phase = 2;
                }
                else if(piece.phase == 2) {
                    piece.blocks[0].col = piece.blocks[1].col - 1; piece.blocks[0].row = piece.blocks[1].row;
                    piece.blocks[2].col = piece.blocks[1].col + 1; piece.blocks[2].row = piece.blocks[1].row;
                    piece.blocks[3].col = piece.blocks[1].col + 1; piece.blocks[3].row = piece.blocks[1].row - 1;
                    piece.phase = 3;
                }
                else {
                    piece.blocks[0].col = piece.blocks[1].col; piece.blocks[0].row = piece.blocks[1].row + 1;
                    piece.blocks[2].col = piece.blocks[1].col; piece.blocks[2].row = piece.blocks[1].row - 1;
                    piece.blocks[3].col = piece.blocks[1].col - 1; piece.blocks[3].row = piece.blocks[1].row - 1;
                    piece.phase = 0;
                }
                break;
            case pieceType.r:  //Right angle piece
                if(piece.phase == 0) {
                    piece.blocks[0].col = piece.blocks[2].col + 1; piece.blocks[0].row = piece.blocks[2].row;
                    piece.blocks[1].col = piece.blocks[2].col; piece.blocks[1].row = piece.blocks[2].row + 1;
                    piece.blocks[3].col = piece.blocks[2].col; piece.blocks[3].row = piece.blocks[2].row - 1;
                    piece.phase = 1;
                }
                else if(piece.phase == 1) {
                    piece.blocks[0].col = piece.blocks[2].col; piece.blocks[0].row = piece.blocks[2].row - 1;
                    piece.blocks[1].col = piece.blocks[2].col + 1; piece.blocks[1].row = piece.blocks[2].row;
                    piece.blocks[3].col = piece.blocks[2].col - 1; piece.blocks[3].row = piece.blocks[2].row;
                    piece.phase = 2;
                }
                else if(piece.phase == 2) {
                    piece.blocks[0].col = piece.blocks[2].col - 1; piece.blocks[0].row = piece.blocks[2].row;
                    piece.blocks[1].col = piece.blocks[2].col; piece.blocks[1].row = piece.blocks[2].row - 1;
                    piece.blocks[3].col = piece.blocks[2].col; piece.blocks[3].row = piece.blocks[2].row + 1;
                    piece.phase = 3;
                }
                else {
                    piece.blocks[0].col = piece.blocks[2].col; piece.blocks[0].row = piece.blocks[2].row + 1;
                    piece.blocks[1].col = piece.blocks[2].col - 1; piece.blocks[1].row = piece.blocks[2].row;
                    piece.blocks[3].col = piece.blocks[2].col + 1; piece.blocks[3].row = piece.blocks[2].row;
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
                <PlayAreaBlocks blocks={this.props.blocks} mode={this.props.mode}/>
                {
                    this.props.piece ? 
                    <Piece key={this.props.piece.count} piece={this.props.piece} /> : 
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
        var mode = this.props.mode;

        for(var row = 0; row < gridHeight; row++) {
            for(var col = 0; col < gridWidth; col++) {
                if(this.props.blocks[row][col] != null) {
                    
                    // If mode is falling mode
                    if (mode === 0)
                        blocks.push(
                            <Block key={row + ' ' + col} row={row} col={col} />
                        );
                    // Else, the mode is caneling mode
                    else {
                        var blinkCount = mode[1]
                        var completeRows = mode[2];

                        //console.log('blinkCount', blinkCount);
                        //console.log(completeRows, completeRows.indexOf(row));

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
var Piece = React.createClass({
    getInitialState: function() {
        //console.log(this.props.piece);
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