/* Copyright Chris Steinhoff 2013 */
"use strict";

function Player(nickname) {
	this.nickname = nickname;
}
Player.prototype = {
	nickname: null
};

function LightPlayer() {
}
LightPlayer.prototype = Object.create(Player.prototype, {
});

function DarkPlayer() {
}
DarkPlayer.prototype = Object.create(Player.prototype, {
});

function Square(cell, file, rank) {
	this.cell = cell;
	this.file = file;
	this.rank = rank;
}
Square.prototype = {
	cell: null,
	file: null,
	rank: null,
	piece_: null,
	set piece(piece) {
		this.piece_ = piece;
		if(piece) {
			var icon = document.createElement("img");
			icon.src = piece.icon;
			this.cell.innerHTML = "";
			this.cell.appendChild(icon);
		} else {
			this.cell.innerHTML = "";
		}
	}
};

function Piece(icon) {
	this.icon = icon;
}
Piece.prototype = {
	icon: null,
	square_: null,
	set square(square) {
		this.square_ = square;
		square.piece = this;
	},
	moveTo: function(square) {
		this.square = square;
	}
};

function King(icon) {
	Piece.call(this, icon);
}
King.prototype = Object.create(Piece.prototype, {
});

function Queen(icon) {
	Piece.call(this, icon);
}
Queen.prototype = Object.create(Piece.prototype, {
});

function Rook(icon) {
	Piece.call(this, icon);
}
Rook.prototype = Object.create(Piece.prototype, {
});

function Bishop(icon) {
	Piece.call(this, icon);
}
Bishop.prototype = Object.create(Piece.prototype, {
});

function Knight(icon) {
	Piece.call(this, icon);
}
Knight.prototype = Object.create(Piece.prototype, {
});

function LightPawn(icon) {
	Piece.call(this, icon);
}
LightPawn.prototype = Object.create(Piece.prototype, {
});

function DarkPawn(icon) {
	Piece.call(this, icon);
}
DarkPawn.prototype = Object.create(Piece.prototype, {
});

function Game() {
	this.board = new Array(64);
}
Game.prototype = {
	board: null,
	getSquare: function(file, rank) {
		return this.board[file + rank * 8];
	},
	setSquare: function(square) {
		this.board[square.file + square.rank * 8] = square;
	}
};

function generateBoard(game, player) {
	var time = performance.now();
	// Generate the board
	for(var r = 0 ; r < 8 ; ++r) {
		for(var f = 0 ; f < 8 ; ++f) {
			game.setSquare(new Square(null, f, r));
		}
	}
	// Bind the board to the <table>
	var tableFragment = document.createDocumentFragment();
	for(r = 7 ; r >= 0 ; --r) {
		var rowFragment = document.createDocumentFragment();
		for(f = 0 ; f < 8 ; ++f) {
			var square = game.getSquare(f, r);
			var td = rowFragment.appendChild(document.createElement("td"));
			td.classList.add("square");
			if((square.file + square.rank) % 2 == 0) {
				td.classList.add("light");
			} else {
				td.classList.add("dark");
			}
			/*td.addEventListener("click", function(sq) {
				return function(event) {
					alert("file = " + sq.file + " ; rank = " + sq.rank);
				}
			}(square));*/
			square.cell = td;
		}
		tableFragment.appendChild(document.createElement("tr")).appendChild(rowFragment);
	}

	// Creates the Pieces and places them on a square
	var pieceFactory = {
		setSquare: function(piece, file, rank) {
			piece.square = game.getSquare(file, rank);
			return piece;
		},
		createLightKing: function(file, rank) {
			return this.setSquare(new King("img/kl.svg"), file, rank);
		},
		createDarkKing: function(file, rank) {
			return this.setSquare(new King("img/kd.svg"), file, rank);
		},
		createLightQueen: function(file, rank) {
			return this.setSquare(new Queen("img/ql.svg"), file, rank);
		},
		createDarkQueen: function(file, rank) {
			return this.setSquare(new Queen("img/qd.svg"), file, rank);
		},
		createLightRook: function(file, rank) {
			return this.setSquare(new Rook("img/rl.svg"), file, rank);
		},
		createDarkRook: function(file, rank) {
			return this.setSquare(new Rook("img/rd.svg"), file, rank);
		},
		createLightBishop: function(file, rank) {
			return this.setSquare(new Bishop("img/bl.svg"), file, rank);
		},
		createDarkBishop: function(file, rank) {
			return this.setSquare(new Bishop("img/bd.svg"), file, rank);
		},
		createLightKnight: function(file, rank) {
			return this.setSquare(new Knight("img/nl.svg"), file, rank);
		},
		createDarkKnight: function(file, rank) {
			return this.setSquare(new Knight("img/nd.svg"), file, rank);
		},
		createLightPawn: function(file, rank) {
			return this.setSquare(new LightPawn("img/pl.svg"), file, rank);
		},
		createDarkPawn: function(file, rank) {
			return this.setSquare(new DarkPawn("img/pd.svg"), file, rank);
		}
	};

	// Setup the light side
	pieceFactory.createLightRook(0, 0);
	pieceFactory.createLightKnight(1, 0);
	pieceFactory.createLightBishop(2, 0);
	pieceFactory.createLightQueen(3, 0);
	pieceFactory.createLightKing(4, 0);
	pieceFactory.createLightBishop(5, 0);
	pieceFactory.createLightKnight(6, 0);
	pieceFactory.createLightRook(7, 0);
	for(var p = 0 ; p < 8 ; p++) {
		pieceFactory.createLightPawn(p, 1);
	}

	// Setup the dark side
	pieceFactory.createDarkRook(0, 7);
	pieceFactory.createDarkKnight(1, 7);
	pieceFactory.createDarkBishop(2, 7);
	pieceFactory.createDarkQueen(3, 7);
	pieceFactory.createDarkKing(4, 7);
	pieceFactory.createDarkBishop(5, 7);
	pieceFactory.createDarkKnight(6, 7);
	pieceFactory.createDarkRook(7, 7);
	for(p = 0 ; p < 8 ; p++) {
		pieceFactory.createDarkPawn(p, 6);
	}

	var table = document.createElement("table");
	table.id = "playing_surface";
	table.appendChild(tableFragment);

	time = performance.now() - time;
	console.log("generated board in " + time + " ms");

	return table;
}

window.addEventListener("load", function() {
	document.getElementById("board").appendChild(generateBoard(new Game(), new LightPlayer()));
});
