// Dependencies: constants.js, field.js, piece.js, player_state.js

function Player() {
    this.field = new Field(gridWidth, gridHeight);
    this.piece = this.makeIntoPlayPiece(new Piece());
    this.next = new Piece();
    this.delay = fallDelay;
    this.score = 0;
    this.state = {id: PlayerState.normal};
    this.timer = null;

    /*
     * Callback function when this player state has updated. This redraws the game.
     *
     * Parameters:
     *   completeRows
     *     An array of integers indicating the indexes of complete rows for canceling.
     *     If this argument is null, that mean no canceling should occur.
     */
    this.update = null;
}

Player.prototype = {
    start: function() {
        this.timer = setInterval(this.onDelayExpire.bind(this), this.delay);
    },
    onDelayExpire: function() {
        var piece = this.piece;
        var put = false;

        // TODO: check the end of the game

        for (var i = 0; i < piece.blocks.length; i++) {
            if (piece.blocks[i].row == 0 || 
                (piece.blocks[i].row < this.field.height && 
                this.field.blocks[piece.blocks[i].row - 1][piece.blocks[i].col] != null))
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
        if (this.state.blinkCount >= blinkLimit) {
            clearInterval(this.blinkTimer);

            // TODO: update score

            this.field.clearCompleteRows();
            this.piece = this.makeIntoPlayPiece(this.next);
            this.next = new Piece();
            this.state.id = PlayerState.normal;
            this.update();
            
            this.timer = setInterval(this.onDelayExpire.bind(this), this.delay);
        }
        else {
            this.state.blinkCount++;
            this.update();
        }
    },
    /**
     * Set the piece at the top center of the field.
     */
    makeIntoPlayPiece: function(piece) {
        for(var i = 0; i < piece.blocks.length; i++) {
            piece.blocks[i].col += Math.floor(this.field.width / 2) - 1;
            piece.blocks[i].row += this.field.height;
        }
        return piece;
    },
    /**
     * Lower the current piece by one row. This method does not check if the move is legal; so
     * before calling this method, the caller should check if the piece should be lowered or
     * put but calling putPiece().
     */
    lowerPiece: function() {
        this.piece.translate({rows: -1});

        //Stop timer?
        
        this.update();
    },
    /**
     * Sets the current in place. If there are complete rows, tigger cancel.
     */
    putPiece: function() {
        clearInterval(this.timer);

        this.field.putPiece(this.piece);
        this.update();

        var completeRows = this.field.getCompleteRows(); 

        if(completeRows.length > 0) {
            this.state = {
                id: PlayerState.cancel,
                blinkCount: 0,
                completeRows:completeRows
            };

            this.update();

            this.piece = null;
            this.score = this.score + completeRows.length;
            this.blinkTimer = setInterval(this.blinkExpire.bind(this), blinkDelay);
        }
        else {
            this.changePiece();
            this.timer = setInterval(this.onDelayExpire.bind(this), this.delay);
        }
    },
    /**
     * Assign the next piece to be the current piece.
     * Make a new next piece.
     */
    changePiece: function() {
        this.piece = this.makeIntoPlayPiece(this.next);
        this.next = new Piece();
    },
    /**
     * Move the current piece one column to the left.
     */
    left: function() {
        var move = true;
        var blocks = this.field.blocks;
        var piece = this.piece;

        // Check if the move is legal, i.e., the piece will not end up out of bound.
        for(var i = 0; i < piece.blocks.length; i++) {
            if (piece.blocks[i].col == 0 || (piece.blocks[i].row < gridHeight && blocks[piece.blocks[i].row][piece.blocks[i].col - 1] != null)) {
                move = false;
                break;
            }
        }

        if(move) {
            piece.translate({cols: -1});
            this.update();
        }
    },
    /**
     * Move the current piece one column to the right.
     */
    right: function() {
        var move = true;
        var blocks = this.field.blocks;
        var piece = this.piece;

        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].col == gridWidth - 1 || (piece.blocks[i].row < gridHeight && blocks[piece.blocks[i].row][piece.blocks[i].col + 1] != null)) {
                move = false;
                break;
            }
        }

        if(move) {
            piece.translate({cols: 1});
            this.update();
        }
    },
    /**
     * Move the current piece down. If the current piece is at the bottom of the field or if it is
     * on top of a block, the piece will be put.
     */
    down: function() {
        var blocks = this.field.blocks;
        var piece = this.piece;
        
        for(var i = 0; i < piece.blocks.length; i++) {
            if(piece.blocks[i].row == 0 || (piece.blocks[i].row <= gridHeight && blocks[piece.blocks[i].row - 1][piece.blocks[i].col] != null)) {
                this.putPiece();
                return;
            }
        }

        this.lowerPiece();
    },
    /**
     * Drops the current piece to the lowest point and change the current piece to the next piece.
     */
    drop: function() {
        var blocks = this.field.blocks;
        var piece = this.piece;
        var min = this.field.height + 1;

        for(var i = 0; i < piece.blocks.length; i++) {
            var colHeight = this.field.colHeight(piece.blocks[i].col);
            var d = piece.blocks[i].row - colHeight;
            if(d < min)
                min = d;
        }

        if(min > 0)
            for(var i = 0; i < piece.blocks.length; i++)
                piece.blocks[i].row -= min;

        this.putPiece();
    },
    /**
     * Try rotate a piece if it's legal.
     */
    doRot: function() {
        var blocks = this.field.blocks;
        var piece = this.piece;
        var copy = piece.copy();
        var canRot = true;

        // Rotate the copy
        copy.rotate();

        // Check each block of the copy to see the rotation is permitted
        for (var i = 0; i < copy.blocks.length; i++) {
            if(
                copy.blocks[i].col < 0 || copy.blocks[i].col >= this.field.width ||
                copy.blocks[i].row < 0 ||
                (copy.blocks[i].row < this.field.height && blocks[copy.blocks[i].row][copy.blocks[i].col] != null)
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
            this.update();
        }
    },
    /**
     * Toggle pause for this player. When paused, the piece will stop falling.
     *
     * @param pause a boolean value denoting this call should pause or resume the game. If pause
     * is true, then this should pause the game, if false, then this should resume the game
     */
    pause: function(pause) {
        if (pause)
            clearInterval(this.timer);
        else
            this.timer = setInterval(this.onDelayExpire.bind(this), this.delay);
    }
}