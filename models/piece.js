Piece.Type = {
    st: 0, z:1, rz:2, s:3, l:4, rl:5, r:6
};

// A unique id for each piece
Piece.counter = 0;

/**
 * Constructor for Piece. A piece is a shape, e.g. L shape, is a collection of square blocks.
 */
function Piece(type) {
    if (type === undefined)
        type = Math.floor(Math.random() * 7);

    Piece.counter++;

    switch(type) {
        case Piece.Type.st: //Straight piece
            this.type = Piece.Type.st,
            this.count = Piece.counter,
            this.phase = 0,
            this.blocks = [
                {row:0, col:0},
                {row:0, col:1},
                {row:0, col:2},
                {row:0, col:3}
            ];
            break;
        case Piece.Type.z:  //Z piece
            this.type = Piece.Type.z,
            this.count = Piece.counter,
            this.phase = 0,
            this.blocks = [
                {row:1, col:0},
                {row:1, col:1},
                {row:0, col:1},
                {row:0, col:2}
            ];
            break;
        case Piece.Type.rz: //Reverse Z piece
            this.type = Piece.Type.rz,
            this.count = Piece.counter,
            this.phase = 0,
            this.blocks = [
                {row:1, col:1},
                {row:1, col:2},
                {row:0, col:0},
                {row:0, col:1}
            ];
            break;
        case Piece.Type.s:  //Square piece
            this.type = Piece.Type.s,
            this.count = Piece.counter,
            this.phase = 0,
            this.blocks = [
                {row:1, col:0},
                {row:1, col:1},
                {row:0, col:0},
                {row:0, col:1}
            ];
            break;
        case Piece.Type.l:  //L piece
            this.type = Piece.Type.l,
            this.count = Piece.counter,
            this.phase = 0,
            this.blocks = [
                {row:2, col:0},
                {row:1, col:0},
                {row:0, col:0},
                {row:0, col:1}
            ];
            break;
        case Piece.Type.rl: //Reverse L piece
            this.type = Piece.Type.rl,
            this.count = Piece.counter,
            this.phase = 0,
            this.blocks = [
                {row:2, col:1},
                {row:1, col:1},
                {row:0, col:0},
                {row:0, col:1}
            ];
            break;
        case Piece.Type.r:  //Right angle piece
            this.type = Piece.Type.r,
            this.count = Piece.counter,
            this.phase = 0,
            this.blocks = [
                {row:1, col:1},
                {row:0, col:0},
                {row:0, col:1},
                {row:0, col:2}
            ];
    }
}

Piece.prototype = {
    /**
     * Move this piece by the amount specified by offset.
     * Parameter offset is an object with the following two properties:
     *   rows: integer
     *   cols: integer
     */
    translate: function(offset) {
        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].row += offset.rows ? offset.rows : 0;
            this.blocks[i].col += offset.cols ? offset.cols : 0;
        }
    },
    rotate: function() {
        switch(this.type) {
            case Piece.Type.st: //Straight piece
                if(this.phase == 0) { // Phase 0: horizontal
                    this.blocks[0].col = this.blocks[1].col; this.blocks[0].row = this.blocks[1].row + 1;
                    this.blocks[2].col = this.blocks[1].col; this.blocks[2].row = this.blocks[1].row - 1;
                    this.blocks[3].col = this.blocks[1].col; this.blocks[3].row = this.blocks[1].row - 2;
                    this.phase = 1;
                }
                else { // Phase 1: vertical
                    this.blocks[0].col = this.blocks[1].col - 1; this.blocks[0].row = this.blocks[1].row;
                    this.blocks[2].col = this.blocks[1].col + 1; this.blocks[2].row = this.blocks[1].row;
                    this.blocks[3].col = this.blocks[1].col + 2; this.blocks[3].row = this.blocks[1].row;
                    this.phase = 0;
                }
                break;
            case Piece.Type.z:  //Z piece
                if(this.phase == 0) {
                    this.blocks[0].col = this.blocks[2].col + 1; this.blocks[0].row = this.blocks[2].row + 1;
                    this.blocks[1].col = this.blocks[2].col + 1; this.blocks[1].row = this.blocks[2].row;
                    this.blocks[3].col = this.blocks[2].col; this.blocks[3].row = this.blocks[2].row - 1;
                    this.phase = 1;
                }
                else {
                    this.blocks[0].col = this.blocks[2].col - 1; this.blocks[0].row = this.blocks[2].row + 1;
                    this.blocks[1].col = this.blocks[2].col; this.blocks[1].row = this.blocks[2].row + 1;
                    this.blocks[3].col = this.blocks[2].col + 1; this.blocks[3].row = this.blocks[2].row;
                    this.phase = 0;
                }
                break;
            case Piece.Type.rz: //Reverse Z piece
                if(this.phase == 0) {
                    this.blocks[0].col = this.blocks[3].col - 1; this.blocks[0].row = this.blocks[3].row;
                    this.blocks[1].col = this.blocks[3].col - 1; this.blocks[1].row = this.blocks[3].row + 1;
                    this.blocks[2].col = this.blocks[3].col; this.blocks[2].row = this.blocks[3].row - 1;
                    this.phase = 1;
                }
                else {
                    this.blocks[0].col = this.blocks[3].col; this.blocks[0].row = this.blocks[3].row + 1;
                    this.blocks[1].col = this.blocks[3].col + 1; this.blocks[1].row = this.blocks[3].row + 1;
                    this.blocks[2].col = this.blocks[3].col - 1; this.blocks[2].row = this.blocks[3].row;
                    this.phase = 0;
                }
                break;
            case Piece.Type.s:  //Square piece
                break;
            case Piece.Type.l:  //L piece
                if(this.phase == 0) {
                    this.blocks[0].col = this.blocks[1].col + 1; this.blocks[0].row = this.blocks[1].row;
                    this.blocks[2].col = this.blocks[1].col - 1; this.blocks[2].row = this.blocks[1].row;
                    this.blocks[3].col = this.blocks[1].col - 1; this.blocks[3].row = this.blocks[1].row - 1;
                    this.phase = 1;
                }
                else if(this.phase == 1) {
                    this.blocks[0].col = this.blocks[1].col; this.blocks[0].row = this.blocks[1].row - 1;
                    this.blocks[2].col = this.blocks[1].col; this.blocks[2].row = this.blocks[1].row + 1;
                    this.blocks[3].col = this.blocks[1].col - 1; this.blocks[3].row = this.blocks[1].row + 1;
                    this.phase = 2;
                }
                else if(this.phase == 2) {
                    this.blocks[0].col = this.blocks[1].col - 1; this.blocks[0].row = this.blocks[1].row;
                    this.blocks[2].col = this.blocks[1].col + 1; this.blocks[2].row = this.blocks[1].row;
                    this.blocks[3].col = this.blocks[1].col + 1; this.blocks[3].row = this.blocks[1].row + 1;
                    this.phase = 3;
                }
                else {
                    this.blocks[0].col = this.blocks[1].col; this.blocks[0].row = this.blocks[1].row + 1;
                    this.blocks[2].col = this.blocks[1].col; this.blocks[2].row = this.blocks[1].row - 1;
                    this.blocks[3].col = this.blocks[1].col + 1; this.blocks[3].row = this.blocks[1].row - 1;
                    this.phase = 0;
                }
                break;
            case Piece.Type.rl: //Reverse L piece
                if(this.phase == 0) {
                    this.blocks[0].col = this.blocks[1].col + 1; this.blocks[0].row = this.blocks[1].row;
                    this.blocks[2].col = this.blocks[1].col - 1; this.blocks[2].row = this.blocks[1].row;
                    this.blocks[3].col = this.blocks[1].col - 1; this.blocks[3].row = this.blocks[1].row + 1;
                    this.phase = 1;
                }
                else if(this.phase == 1) {
                    this.blocks[0].col = this.blocks[1].col; this.blocks[0].row = this.blocks[1].row - 1;
                    this.blocks[2].col = this.blocks[1].col; this.blocks[2].row = this.blocks[1].row + 1;
                    this.blocks[3].col = this.blocks[1].col + 1; this.blocks[3].row = this.blocks[1].row + 1;
                    this.phase = 2;
                }
                else if(this.phase == 2) {
                    this.blocks[0].col = this.blocks[1].col - 1; this.blocks[0].row = this.blocks[1].row;
                    this.blocks[2].col = this.blocks[1].col + 1; this.blocks[2].row = this.blocks[1].row;
                    this.blocks[3].col = this.blocks[1].col + 1; this.blocks[3].row = this.blocks[1].row - 1;
                    this.phase = 3;
                }
                else {
                    this.blocks[0].col = this.blocks[1].col; this.blocks[0].row = this.blocks[1].row + 1;
                    this.blocks[2].col = this.blocks[1].col; this.blocks[2].row = this.blocks[1].row - 1;
                    this.blocks[3].col = this.blocks[1].col - 1; this.blocks[3].row = this.blocks[1].row - 1;
                    this.phase = 0;
                }
                break;
            case Piece.Type.r:  //Right angle piece
                if(this.phase == 0) {
                    this.blocks[0].col = this.blocks[2].col + 1; this.blocks[0].row = this.blocks[2].row;
                    this.blocks[1].col = this.blocks[2].col; this.blocks[1].row = this.blocks[2].row + 1;
                    this.blocks[3].col = this.blocks[2].col; this.blocks[3].row = this.blocks[2].row - 1;
                    this.phase = 1;
                }
                else if(this.phase == 1) {
                    this.blocks[0].col = this.blocks[2].col; this.blocks[0].row = this.blocks[2].row - 1;
                    this.blocks[1].col = this.blocks[2].col + 1; this.blocks[1].row = this.blocks[2].row;
                    this.blocks[3].col = this.blocks[2].col - 1; this.blocks[3].row = this.blocks[2].row;
                    this.phase = 2;
                }
                else if(this.phase == 2) {
                    this.blocks[0].col = this.blocks[2].col - 1; this.blocks[0].row = this.blocks[2].row;
                    this.blocks[1].col = this.blocks[2].col; this.blocks[1].row = this.blocks[2].row - 1;
                    this.blocks[3].col = this.blocks[2].col; this.blocks[3].row = this.blocks[2].row + 1;
                    this.phase = 3;
                }
                else {
                    this.blocks[0].col = this.blocks[2].col; this.blocks[0].row = this.blocks[2].row + 1;
                    this.blocks[1].col = this.blocks[2].col - 1; this.blocks[1].row = this.blocks[2].row;
                    this.blocks[3].col = this.blocks[2].col + 1; this.blocks[3].row = this.blocks[2].row;
                    this.phase = 0;
                }
        }
    },
    /**
     * Returns a copy of this piece.
     */
    copy: function() {
        var copy = new Piece();
        var blocks = [];

        for(var i = 0; i < this.blocks.length; i++) {
            blocks.push({
                row: this.blocks[i].row,
                col: this.blocks[i].col
            });
        }

        copy.type = this.type;
        copy.phase = this.phase;
        copy.blocks = blocks;

        return copy;
    }
}
