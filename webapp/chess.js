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
	piece_: null,
	set piece(piece) {
		this.piece_ = piece;
		if(piece) {
			this.cell.replaceChild(piece.icon, this.cell.firstChild);
		} else {
			this.cell.innerHTML = "";
		}
	},
	clear: function() {
		this.cell.replaceChild(this.placeholder, this.cell.firstChild);
	}
};

function Piece(iconUrl) {
	this.icon = document.createElement("img");
	this.icon.src = iconUrl;
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

function King(iconUrl) {
	Piece.call(this, iconUrl);
}
King.prototype = Object.create(Piece.prototype, {
});

function Queen(iconUrl) {
	Piece.call(this, iconUrl);
}
Queen.prototype = Object.create(Piece.prototype, {
});

function Rook(iconUrl) {
	Piece.call(this, iconUrl);
}
Rook.prototype = Object.create(Piece.prototype, {
});

function Bishop(iconUrl) {
	Piece.call(this, iconUrl);
}
Bishop.prototype = Object.create(Piece.prototype, {
});

function Knight(iconUrl) {
	Piece.call(this, iconUrl);
}
Knight.prototype = Object.create(Piece.prototype, {
});

function LightPawn(iconUrl) {
	Piece.call(this, iconUrl);
}
LightPawn.prototype = Object.create(Piece.prototype, {
});

function DarkPawn(iconUrl) {
	Piece.call(this, iconUrl);
}
DarkPawn.prototype = Object.create(Piece.prototype, {
});

function Board() {
	this.board = [];
	for(var r = 0 ; r < 8 ; ++r) {
		for(var f = 0 ; f < 8 ; ++f) {
			this.board[f + r * 8] = new Square(f, r);
		}
	}
}
Board.prototype = {
	board: null,
	getSquare: function(file, rank) {
		return this.board[file + rank * 8];
	}
};

function renderBoard(board, player) {
	var time = performance.now();
	// Bind the board to the <table>
	var tableFragment = document.createDocumentFragment();
	for(var r = 7 ; r >= 0 ; --r) {
		var rowFragment = document.createDocumentFragment();
		for(var f = 0 ; f < 8 ; ++f) {
			var square = board.getSquare(f, r);
			rowFragment.appendChild(square.cell);
		}
		tableFragment.appendChild(document.createElement("tr")).appendChild(rowFragment);
	}

	// Define the major pieces
	var pieceConfig = [
		{ piece: new Rook("img/rl.svg"), file: 0, rank: 0 },
		{ piece: new Knight("img/nl.svg"), file: 1, rank: 0 },
		{ piece: new Bishop("img/bl.svg"), file: 2, rank: 0 },
		{ piece: new Queen("img/ql.svg"), file: 3, rank: 0 },
		{ piece: new King("img/kl.svg"), file: 4, rank: 0 },
		{ piece: new Bishop("img/bl.svg"), file: 5, rank: 0 },
		{ piece: new Knight("img/nl.svg"), file: 6, rank: 0 },
		{ piece: new Rook("img/rl.svg"), file: 7, rank: 0 },
		{ piece: new Rook("img/rd.svg"), file: 0, rank: 7 },
		{ piece: new Knight("img/nd.svg"), file: 1, rank: 7 },
		{ piece: new Bishop("img/bd.svg"), file: 2, rank: 7 },
		{ piece: new Queen("img/qd.svg"), file: 3, rank: 7 },
		{ piece: new King("img/kd.svg"), file: 4, rank: 7 },
		{ piece: new Bishop("img/bd.svg"), file: 5, rank: 7 },
		{ piece: new Knight("img/nd.svg"), file: 6, rank: 7 },
		{ piece: new Rook("img/rd.svg"), file: 7, rank: 7 }
	];

	// Place major pieces on the board
	for(var p = 0 ; p < pieceConfig.length ; ++p) {
		pieceConfig[p].piece.square = board.getSquare(
			pieceConfig[p].file, pieceConfig[p].rank);
	}

	// Place light pawns
	for(p = 0 ; p < 8 ; ++p) {
		new LightPawn("img/pl.svg").square = board.getSquare(p, 1);
	}

	// Place dark pawns
	for(p = 0 ; p < 8 ; ++p) {
		new DarkPawn("img/pd.svg").square = board.getSquare(p, 6);
	}

	var table = document.createElement("table");
	table.id = "playing_surface";
	table.appendChild(tableFragment);

	time = performance.now() - time;
	console.log("generated board in " + time + " ms");

	return table;
}

window.addEventListener("load", function() {
	document.getElementById("board").appendChild(renderBoard(new Board(), new LightPlayer()));
});
