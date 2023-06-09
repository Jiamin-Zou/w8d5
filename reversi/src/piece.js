// module.exports = Piece;

/**
 * Initializes the Piece with its color.
 */
const COLORS = ["white", "black"];
function Piece (color) {
    this.color = color;
}

/**
 * Returns the color opposite the current piece.
 */
Piece.prototype.oppColor = function () {
    return (this.color === "white") ? "black" : "white";
};

/**
 * Changes the piece's color to the opposite color.
 */
Piece.prototype.flip = function () {
    this.color = (this.color === "white") ? "black" : "white";
};

/**
 * Returns a string representation of the piece
 * based on its color.
 */
Piece.prototype.toString = function () {
    // return (this.color === "white") ? "W" : "B";
    return this.color[0].toUpperCase();
};

// DON'T TOUCH THIS CODE
if (typeof window === 'undefined'){
    module.exports = Piece;
}
// DON'T TOUCH THIS CODE