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

var pieceFactory = {
	createLightKing: function() {
		return new King("img/kl.svg");
	},
	createDarkKing: function() {
		return new King("img/kd.svg");
	},
	createLightQueen: function() {
		return new Queen("img/ql.svg");
	},
	createDarkQueen: function() {
		return new Queen("img/qd.svg");
	},
	createLightRook: function() {
		return new Rook("img/rl.svg");
	},
	createDarkRook: function() {
		return new Rook("img/rd.svg");
	},
	createLightBishop: function() {
		return new Bishop("img/bl.svg");
	},
	createDarkBishop: function() {
		return new Bishop("img/bd.svg");
	},
	createLightKnight: function() {
		return new Knight("img/nl.svg");
	},
	createDarkKnight: function() {
		return new Knight("img/nd.svg");
	},
	createLightPawn: function() {
		return new LightPawn("img/pl.svg");
	},
	createDarkPawn: function() {
		return new DarkPawn("img/pd.svg");
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
	setSquare: function(file, rank, square) {
		this.board[file + (56 - rank * 8)] = square;
	}
};

function generateBoard(game, player) {
	var tableFragment = document.createDocumentFragment();
	for(var r = 0 ; r < 8 ; r++) { // foreach row
		var rowFragment = document.createDocumentFragment();
		for(var c = 0 ; c < 8 ; c++) { // foreach cell
			var td = rowFragment.appendChild(document.createElement("td"));
			td.classList.add("square");
			if((r + c) % 2 == 0) {
				td.classList.add("light");
			} else {
				td.classList.add("dark");
			}
			var square = new Square(td, c, r);
			/*td.addEventListener("click", function(sq) {
				return function(event) {
					alert("file = " + sq.file + " ; rank = " + sq.rank);
				}
			}(square));*/
			game.setSquare(c, r, square);
		}
		var row = tableFragment.appendChild(document.createElement("tr"));
		row.appendChild(rowFragment);
	}

	var piece = pieceFactory.createLightRook();
	piece.square = game.getSquare(0, 0);
	piece = pieceFactory.createLightKnight();
	piece.square = game.getSquare(1, 0);
	piece = pieceFactory.createLightBishop();
	piece.square = game.getSquare(2, 0);
	piece = pieceFactory.createLightQueen();
	piece.square = game.getSquare(3, 0);
	piece = pieceFactory.createLightKing();
	piece.square = game.getSquare(4, 0);
	piece = pieceFactory.createLightBishop();
	piece.square = game.getSquare(5, 0);
	piece = pieceFactory.createLightKnight();
	piece.square = game.getSquare(6, 0);
	piece = pieceFactory.createLightRook();
	piece.square = game.getSquare(7, 0);
	for(var p = 0 ; p < 8 ; p++) {
		piece = pieceFactory.createLightPawn();
		piece.square = game.getSquare(p, 1);
	}

	piece = pieceFactory.createDarkRook();
	piece.square = game.getSquare(0, 7);
	piece = pieceFactory.createDarkKnight();
	piece.square = game.getSquare(1, 7);
	piece = pieceFactory.createDarkBishop();
	piece.square = game.getSquare(2, 7);
	piece = pieceFactory.createDarkQueen();
	piece.square = game.getSquare(3, 7);
	piece = pieceFactory.createDarkKing();
	piece.square = game.getSquare(4, 7);
	piece = pieceFactory.createDarkBishop();
	piece.square = game.getSquare(5, 7);
	piece = pieceFactory.createDarkKnight();
	piece.square = game.getSquare(6, 7);
	piece = pieceFactory.createDarkRook();
	piece.square = game.getSquare(7, 7);
	for(p = 0 ; p < 8 ; p++) {
		piece = pieceFactory.createDarkPawn();
		piece.square = game.getSquare(p, 6);
	}

	var table = document.createElement("table");
	table.id = "playing_surface";
	table.appendChild(tableFragment);

	return table;
}

window.addEventListener("load", function() {
	document.getElementById("board").appendChild(generateBoard(new Game(), new LightPlayer()));
});
