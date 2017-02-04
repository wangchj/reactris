/**
 * A grid of accumulated square blocks of the game.
 */
function Field(width, height) {
    this.width = width;   // The width of the grid
    this.height = height; // The hight of the brid
    this.blocks = [];     // A grid of squre blocks

    for (var row = 0; row < height; row++) {
	   var cols = [];
	   for (var col = 0; col < width; col++)
	   cols.push(null);
	   this.blocks.push(cols);
    }
}

Field.prototype = {
    /**
     * Put a piece.
     */
    putPiece: function(piece) {
        for (var i = 0; i < piece.blocks.length; i++) {
            var block = piece.blocks[i];
            this.blocks[block.row][block.col] = true;
        }
    },
    /**
     * Clears complete rows.
     *
     * This method first calls getCompleteRows() to determine if there are any complete rows.
     * Currently there is no caching for complete rows.
     */
    clearCompleteRows: function() {
        var completeRows = this.getCompleteRows();

        if (completeRows.length == 0)
            return;

        var stackHeight = this.getStackHeight();

        var shiftCount = 0;

        for (var row = 0; row < stackHeight; row++) {
            if (shiftCount < completeRows.length && completeRows[shiftCount] == row)
                shiftCount++;
            else if (shiftCount != 0) {
                for (var col = 0; col < gridWidth; col++)
                    this.blocks[row - shiftCount][col] = this.blocks[row][col];
            }

            if (row >= stackHeight - completeRows.length) {
                for (var col = 0; col < gridWidth; col++)
                    this.blocks[row][col] = null;
            }
        }
    },
	/**
	 * Gets an array of indexes of complete rows.
	 */
	getCompleteRows: function() {
        var res = [];

        for(var row = 0; row < this.height; row++) {
            var addRow = true;
            for(var col = 0; col < this.width; col++) {
                if(this.blocks[row][col] == null) {
                    addRow = false;
                    break;
                }
            }

            if(addRow)
            	res.push(row);
        }

        return res;
    },
    /**
     * Gets the max hight of the game.
     */
    getStackHeight: function() {
        var result = 0;
        var blocks = this.blocks;

        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                if (blocks[row][col] != null) {
                    result++;
                    break;
                }
            }
        }
        return result;
    }
}