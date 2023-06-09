// const Piece = require("./piece.js");

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){ //typeof only checks for primitive data types and object, //return is always encapsulated in string
  var Piece = require("./piece");
}
// DON'T TOUCH THIS CODE

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = Array(8).fill(null).map(() => Array(8).fill(undefined)); //need to fill with null to successfully map, default undefined array vals will not map
  // const grid = Array(8).map((el) => Array(8).fill(undefined)); //not work if don't fill outer arr.
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black"); //swap two variables can be done if encapsulated in array
  grid[3][3] = new Piece("white");
  grid[4][4] =  new Piece("white");

  // debugger

  return grid;
}


/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [ //this is a class property. allcaps stylistically indicate constant (conceptually)
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  const first = ((pos[0] <= 7) && (pos[0] >= 0));
  const second = ((pos[1] <= 7) && (pos[1] >= 0));
  const result = (first && second);
  return result;
};

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (this.isValidPos(pos)) {
    return this.grid[pos[0]][pos[1]];
  } else {
    throw new Error("Not valid pos!");
  }
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  const piece = this.getPiece(pos)
  if (!piece) {
    return false;
  } else {
    return piece.color === color;
  }
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return !!this.getPiece(pos);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns an empty array if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns empty array if it hits an empty position.
 *
 * Returns empty array if no pieces of the opposite color are found.
 */
Board.prototype._positionsToFlip = function(pos, color, dir, piecesToFlip){
  // piecesToFlip ||= [];
  
  // // reach end of board
  
  // if(!this.isValidPos(pos) || !this.isOccupied(pos)) {
  //   return [];
  // } else if(this.getPiece(pos).color === color) {
  //   if(piecesToFlip.length === 0) {
  //     return [];
  //   } else {
  //     return piecesToFlip;
  //   }
  //   //piecesToFlip.empty? (3)
  //   //else (4) recursive
  // } else {//if you find an enemy piece
  //   piecesToFlip.push(this.getPiece(pos));
  //   let newPos = [pos[0] + dir[0], pos[1] + dir[1]];
  //   this._positionsToFlip(newPos, color, dir, piecesToFlip);
  // }
  // return piecesToFlip;
  if (piecesToFlip === undefined) {
    piecesToFlip = [];
  } else {
    piecesToFlip.push(pos);
  }

  let newPos = [pos[0] + dir[0], pos[1] + dir[1]];
  
  if(!this.isValidPos(newPos) || !this.isOccupied(newPos)) {
    return [];
   } else if (this.isMine(newPos, color)) {
    return (piecesToFlip.length === 0) ? [] : piecesToFlip;
   } else {
    return this._positionsToFlip(newPos, color, dir, piecesToFlip)
   }



};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) return false;
  const dirs = Board.DIRS;

  for (let i = 0; i < dirs.length; i++) {
    let positions = this._positionsToFlip(pos, color, dirs[i])
    if (positions.length > 0) return true;
  }
  return false;
};

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color)) {
    throw new Error ("Invalid move!");
  };

  let positionsToFlip = [];
  const dirs = Board.DIRS;
  for (let di = 0; di < dirs.length; di++) {
    let positions = this._positionsToFlip(pos, color, dirs[di]);
    positionsToFlip = positionsToFlip.concat(positions);
  };

  const i = pos[0];
  const j = pos[1];
  this.grid[i][j] = new Piece(color);

  for (let pi = 0; pi < positionsToFlip.length; pi++) {
    this.getPiece(positionsToFlip[pi]).flip();
  };
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  const moves = [];

  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid.length; j++) {
      const pos = [i, j]
      if (this.validMove(pos, color)) moves.push(pos);
    };
  };
  return moves;
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return (this.validMoves(color).length > 0 )
};



/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  const black = this.hasMove("black");
  const white = this.hasMove("white");

  return (!black && !white);
};




/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  // let render = this.grid.map( row => {
  //   return row.map(piece=> {
  //     if (piece === undefined) {
  //       return "-";
  //     } else {
  //       return piece.toString();
  //     }
  //   })
  // } )

  let idx = [0, 1, 2, 3, 4, 5, 6, 7].join(" ");
  const col = "i\\j| " + idx;
  console.log(col);
  console.log("-".repeat(col.length));
  
  for (let i = 0; i < this.grid.length; i++) {
    let row = " " + i +" | ";
    let pieces = []
    for (let j = 0; j < this.grid[i].length; j++) {
      let pos = [i, j];
      if (this.isOccupied(pos)) {
        let piece = this.getPiece(pos)
        pieces.push(piece.toString());
      } else {
        pieces.push("-");
      }
    }
    row += pieces.join(" ")
    console.log(row);
  }
}

// let b = new Board();
// b.print()


// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
  module.exports = Board;
}
// DON'T TOUCH THIS CODE