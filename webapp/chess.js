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

function Square(file, rank) {
	this.file = file;
	this.rank = rank;

	// Create the <td> that will be added to the <table>
	this.cell = document.createElement("td");
	this.cell.classList.add("square");
	if((file + rank) % 2 == 0) {
		this.cell.classList.add("light");
	} else {
		this.cell.classList.add("dark");
	}
	// Create a placeholder child to swap out when the piece is set
	this.placeholder = document.createElement("span");
	this.cell.appendChild(this.placeholder);
	/*this.cell.addEventListener("click", function(sq) {
		return function(event) {
			alert("file = " + sq.file + " ; rank = " + sq.rank);
		}
	}(this));*/
}
Square.prototype = {
	file: null,
	rank: null,
	cell: null,
	placeholder: null,
	piece: null,
	setPiece: function(piece) {
		if(this.piece != null) {
			this.piece.file = this.piece.rank = 0;
			this.cell.replaceChild(piece.icon, this.cell.firstChild);
		} else {
			this.cell.appendChild(piece.icon);
		}
		this.piece = piece;
	}
};

function Piece(iconUrl, file, rank) {
	this.icon = document.createElement("img");
	this.icon.src = iconUrl;
	this.file = file;
	this.rank = rank;
}
Piece.prototype = {
	icon: null,
	square_: null,
	file: 0,
	rank: 0
};

function King(iconUrl, file, rank) {
	Piece.call(this, iconUrl, file, rank);
}
King.prototype = Object.create(Piece.prototype, {
});

function Queen(iconUrl, file, rank) {
	Piece.call(this, iconUrl, file, rank);
}
Queen.prototype = Object.create(Piece.prototype, {
});

function Rook(iconUrl, file, rank) {
	Piece.call(this, iconUrl, file, rank);
}
Rook.prototype = Object.create(Piece.prototype, {
});

function Bishop(iconUrl, file, rank) {
	Piece.call(this, iconUrl, file, rank);
}
Bishop.prototype = Object.create(Piece.prototype, {
});

function Knight(iconUrl, file, rank) {
	Piece.call(this, iconUrl, file, rank);
}
Knight.prototype = Object.create(Piece.prototype, {
});

function LightPawn(iconUrl, file, rank) {
	Piece.call(this, iconUrl, file, rank);
}
LightPawn.prototype = Object.create(Piece.prototype, {
});

function DarkPawn(iconUrl, file, rank) {
	Piece.call(this, iconUrl, file, rank);
}
DarkPawn.prototype = Object.create(Piece.prototype, {
});

function Board() {
	this.board = [];

	// Generate the board model
	for(var r = 0 ; r < 8 ; ++r) {
		for(var f = 0 ; f < 8 ; ++f) {
			this.board[f + r * 8] = new Square(f, r);
		}
	}

	// Bind the board to the <table>
	var tableFragment = document.createDocumentFragment();
	for(r = 7 ; r >= 0 ; --r) {
		var rowFragment = document.createDocumentFragment();
		for(f = 0 ; f < 8 ; ++f) {
			var square = this.getSquare(f, r);
			rowFragment.appendChild(square.cell);
		}
		tableFragment.appendChild(document.createElement("tr")).appendChild(rowFragment);
	}

	// Create the <table>
	this.table = document.createElement("table");
	this.table.id = "playing_surface";
	this.table.appendChild(tableFragment);
}
Board.prototype = {
	board: null,
	table: null,
	getSquare: function(file, rank) {
		return this.board[file + rank * 8];
	},
	setPieces: function(pieces) {
		for(var p = 0 ; p < pieces.length ; ++p) {
			var square = this.getSquare(
				pieces[p].file, pieces[p].rank);
			square.setPiece(pieces[p]);
		}
	}
};

function createNewGame(board) {
	// Create the pieces
	var pieces = [
		// Light pieces
		new Rook("img/rl.svg", 0, 0),
		new Knight("img/nl.svg", 1, 0),
		new Bishop("img/bl.svg", 2, 0),
		new Queen("img/ql.svg", 3, 0),
		new King("img/kl.svg", 4, 0),
		new Bishop("img/bl.svg", 5, 0),
		new Knight("img/nl.svg", 6, 0),
		new Rook("img/rl.svg", 7, 0),
		// Dark pieces
		new Rook("img/rd.svg", 0, 7),
		new Knight("img/nd.svg", 1, 7),
		new Bishop("img/bd.svg", 2, 7),
		new Queen("img/qd.svg", 3, 7),
		new King("img/kd.svg", 4, 7),
		new Bishop("img/bd.svg", 5, 7),
		new Knight("img/nd.svg", 6, 7),
		new Rook("img/rd.svg", 7, 7)
	];
	// Light pawns
	for(var p = 0 ; p < 8 ; ++p) {
		pieces.push(new LightPawn("img/pl.svg", p, 1));
	}
	// Dark pawns
	for(p = 0 ; p < 8 ; ++p) {
		pieces.push(new DarkPawn("img/pd.svg", p, 6));
	}

	// Add the pieces to the board
	board.setPieces(pieces);
}

window.addEventListener("load", function() {
	var time = performance.now();
	var board = new Board();
	createNewGame(board);
	document.getElementById("board").appendChild(board.table);
	time = performance.now() - time;
	console.log("generated board in " + time + " ms");
});
