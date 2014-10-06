//main game logic
var currentTurn = "white";
var isMoving = false;

/*

	chess game logic

	1. first player to move is white
	2. parsing player input
	3. is the move valid?
	4. if it's a valid move, move piece
	5. check if the position is already occupied
	6. if occupied, remove piece
	7. update moves list
	8. update game status
	9. game over? 	nope, change turn,
					yep, show winner.

	//TODO
	add arrocco and strano movimento pedoni quando sono affiancati. (non mi ricordo come si chiama la mossa.)
	promozione del pedone ad altro pezzo (????)

	si deve dare la possibilità di tornare indeitro con le mosse

	//comandi attualmente riconosciuti
	*nomepezzo* da A5 a F4

	
*/

var Game = {
	setUp : function() {
		//Setting up recognition object
		setUpRecognition();
		recognition.lang = selectedlanguage;
		//adding click listener to start button
		//setting currentTurn to white.
		currentTurn = "white";
		$('#play').on("click", function() {
			if (!isMoving) {
				Game.play();
			}
		});
	},

	play : function(piece, from, to) {
		//we are ready to move
		//listen to player input
		if (!piece && !to && !from) {
			//we have to listen to player input
			recognition._start(Game.parseVocalInput);
			return;
		}
		//if we are here, we want to move a piece
		var target = to.k;
		var targetNum = to.n;
		var piecePos = from.k;
		var pieceNum = from.n;
		var p = Game.isValidPiece(piece.toLowerCase()); //we need to store our piece here.

		//if piece is a list of pieces, we have to choose the right piece
		//We have to apply rules for each type of piece

		//we now want to recognize if this piece can move to its final position

		//if destination is correct, change its position
		moveTo(p, target, targetNum, function() {
			//here is where our piece has finished its movement.
			
			//check if position is already occupied 

			//if it's occupied by enemy piece, remove it

			//add this move to moves list

			//We have to check if the game is over.
			//if the game is over prompt user with the winner and ask for new game
			//if game is over, return

			//at the end we must change turn
			Game.changeTurn();
			//setting isMoving to false
			isMoving = false;
			//prompt user to hit play button again to start new turn
		});
	},

	parseVocalInput : function(input) {
		recognition.stop();
		var words = input.split(" ");
		var foundPiece, piecePos;
		var foundTarget, foundTargetNum;
		var foundPos, foundPosNum;
		//var start = Date.now();
		for (var i in words) {
			for (var k in langMapping[selectedlanguage]){
				l("searching " + words[i] + " . " + k);
				if (words[i].toLowerCase() == k) {
					piecePos = i;
					foundPiece = langMapping[selectedlanguage][k];
					break;
				}
			}
			if (foundPiece) break;
		}
		//a questo punto dobbiamo cercare di capire la posizione in cui vogliamo spostare il pezzo
		words = input.split("");
		for (var i in words) {
			//se trovo un numero, guardo se la parola prima è una lettera
			if (!isNaN(words[i])) {
				if (!foundPosNum) {
					foundPosNum = parseInt(words[i]) < 9 ? parseInt(words[i]) : undefined;
				} else {
					foundTargetNum = parseInt(words[i]) < 9 ? parseInt(words[i]) : undefined;
				}
				if (words[i-1] != " " && words[i-1] != undefined) {
					if (letters.indexOf(words[i-1].toLowerCase()) != -1) {
						//abbiamo trovato una delle lettere valide
						if (!foundPos) {
							foundPos = words[i-1].toLowerCase();
						} else {
							foundTarget = words[i-1].toLowerCase();
						}
					}
				} else if (words[i-1] != " " && words[i-1] != undefined) {
					if (letters.indexOf(words[i-2].toLowerCase()) != -1) {
						//abbiamo trovato una delle lettere valide
						if (!foundPos) {
							foundPos = words[i-1].toLowerCase();
						} else {
							foundTarget = words[i-1].toLowerCase();
						}						
					}
				} 			
			}

			if ((foundTarget && foundTargetNum) && (foundPos && foundTargetNum)) {
				break;
			}
		}
		//checking if we have found every element
		if (_.isUndefined(foundTarget) || _.isUndefined(foundTargetNum) || _.isUndefined(foundPiece)
			|| _.isUndefined(foundPos) || _.isUndefined(foundPosNum)) {
			//not good input, must repeat
			Game.repeatInput();
			return;
		}
		//if we are here, input is good, trying to go on.
		if (currentTurn == "white") {
			Game.play(white[foundPiece], {k: foundPos, n: foundPosNum}, {k: foundTarget, n: foundTargetNum});
		} else {
			Game.play(black[foundPiece], {k: foundPos, n: foundPosNum}, {k: foundTarget, n: foundTargetNum});
		}
	},

	repeatInput : function() {
		//show dialog to user.
		recognition._start(Game.parseVocalInput);
		return;
	},

	recognizePiece : function(piece, from, to) {
		switch (piece) {
			case "pawn": {
				var res = _validatePawn(from, to);
				if (res.flag) {
					return res.data;
				} 
				return undefined;
			}
			case "rook": {
				var res = _validateRook(from, to);
				if (res.flag) {
					return res.data;
				}
				return undefined;
			}
			case "bishop": {
				var res = _validateBishop(from, to);
				if (res.flag) {
					return res.data;
				}
				return undefined;
			}
			case "knight": {
				var res = _validateKnight(from, to);
				if (res.flag) {
					return res.data;
				}
				return undefined;
			}
			case "queen": {
				var res = _validateQueen(from, to);
				if (res.flag) {
					return res.data;
				}
				return undefined;
			}
			case "king": {
				var res = _validateKing(from, to);
				if (res.flag) {
					return res.data;
				}
				return undefined;
			}
		}
	},

	changeTurn : function() {
		currentTurn = (currentTurn == "white") ? "black" : "white";
		Game.moveCamera(currentTurn);
	},

	moveCamera : function() {
		//we must rotate camera to show other turn pieces.
	}
}


/**************************************************
	HELPERS METHOD TO CHECK IF PIECE IS VALID
**************************************************/

function _validatePawn(from, to) {
	for (var i in window[currentTurn].pawns) {
		if (window[currentTurn].pawns[i].position) {

		}
	}
}

function _validateRook(from, to) {

}

function _validateKnight(from, to) {

}

function _validateBishop(from, to) {

}

function _validateQueen(from, to) {

}

function _validateKing(from, to) {

}