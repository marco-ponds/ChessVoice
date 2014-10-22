//main Chess logic


/*

	CHESS GAME LOGIC
	IMPLEMENTATION OF CHESS CLASS using classy.js

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

Class("Chess", {

	Chess : function() {
		//main constructor
		this.currentTurn = "white";
		this.isMoving = false;
	},

	setUp : function() {
		//Setting up recognition object
		l("calling setup recognition");
		setUpRecognition();
		//adding click listener to start button
		//setting currentTurn to white.
		currentTurn = "white";
		$('#play').on("click", function() {
			if (!this.isMoving) {
				this.playClickHandler();
			}
		});
	},

	playClickHandler : function() {
		isMoving = true;
		this.play();
	},

	play : function(piece, from, to) {
		//we are ready to move
		//listen to player input
		if (!piece && !to && !from) {
			//we have to listen to player input
			l("starting recognition");
			recognition._start(this.parseVocalInput);
			return;
		}
		//if we are here, we want to move a piece
		var target = to.k;
		var targetNum = to.n;
		var piecePos = from.k;
		var pieceNum = from.n;
		//if piece is a list of pieces, we have to choose the right piece
		//We have to apply rules for each type of piece

		//we now want to recognize if this piece can move to its final position
		var p = this.isValidPiece(piece.toLowerCase(), from, to); //we need to store our piece here.
		if (!p) {
			//something wrong with our piece
			this.repeatInput();
		} else {
			//if destination is correct, change its position
			var move = "<li>" + symbolsMap[currentTurn][piece.toLowerCase()] + " from " + from.k + "" + from.n + " to " + to.k + "" + to.n + "</li>"; 
			moveTo(p, target, targetNum, function() {
				//here is where our piece has finished its movement.
				
				//check if position is already occupied 

				//if it's occupied by enemy piece, remove it

				//add this move to moves list

				//We have to check if the Chess is over.
				//if the Chess is over prompt user with the winner and ask for new Chess
				//if Chess is over, return

				//at the end we must change turn
				this.changeTurn();
				//setting isMoving to false
				this.isMoving = false;
				//prompt user to hit play button again to start new turn
			});
		}
	},

	parseVocalInput : function(input) {
		recognition.stop();
		var words = input.split(" ");
		var foundPiece, piecePos;
		var foundTarget, foundTargetNum;
		var foundPos = undefined, foundPosNum = undefined;
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
						l("found letter " + words[i-1]);
						if (!foundPos) {
							foundPos = words[i-1].toLowerCase();
						} else {
							foundTarget = words[i-1].toLowerCase();
						}
					}
				} else if (words[i-1] != " " && words[i-1] != undefined) {
					if (letters.indexOf(words[i-2].toLowerCase()) != -1) {
						//abbiamo trovato una delle lettere valide
						l("found letter " + words[i-2]);
						if (!foundPos) {
							foundPos = words[i-2].toLowerCase();
						} else {
							foundTarget = words[i-2].toLowerCase();
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
			l("piece not recognized");
			l(foundTarget);
			l(foundTargetNum);
			l(foundPos);
			l(foundPosNum);
			this.repeatInput();
			return;
		}
		//if we are here, input is good, trying to go on.
		if (currentTurn == "white") {
			this.play(white[foundPiece], {k: foundPos, n: foundPosNum}, {k: foundTarget, n: foundTargetNum});
		} else {
			this.play(black[foundPiece], {k: foundPos, n: foundPosNum}, {k: foundTarget, n: foundTargetNum});
		}
	},

	repeatInput : function() {
		//show dialog to user.
		recognition.stop();
		setUpRecognition();
		recognition._start(this.parseVocalInput);
		return;
	},

	isValidPiece : function(piece, from, to) {
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
		this.currentTurn = (this.currentTurn == "white") ? "black" : "white";
		$("#currentRound").removeClass().addClass(this.currentTurn).text(this.currentTurn);
		this.moveCamera(this.currentTurn);
	},

	moveCamera : function(turn) {
		//we must rotate camera to show other turn pieces.
		//storing position inside element
		//core.camera._position = core.camera.position;
		//position = 
		var current = {
			x : core.camera.position.x,
			z : core.camera.position.z
		};
		var destinationZ = (turn == "white") ? 11 : -11;
		var t = new TWEEN.Tween(current).to({x : 0, z: destinationZ}, 2500);
		t.easing(TWEEN.Easing.Exponential.EaseIn);
		t.onUpdate(function() {
			////console.log("current " + current);
			core.camera.position.x = current.x;
			core.camera.position.z = current.z;
			core.camera.lookAt(new THREE.Vector3(0,0,0));
		});
		t.start();
	}
});


/**************************************************
	HELPERS METHOD TO CHECK IF PIECE IS VALID
**************************************************/

function _validatePawn(from, to) {
	var f = convertPosition(from.k, from.n);
	var t = convertPosition(to.k, to.n);
	for (var i in window[chess.currentTurn].pawns) {
		//checking if exist a pawn with this starting location
		if (_.isEqual(window[chess.currentTurn].pawns[i]._position, f)) {
			//check if destination is valid
			/*
				we should check if our piece can reach its destination
			*/
			var pawn = window[chess.currentTurn].pawns[i];
			//i pedoni vanno solo dritto di uno o al massimo due posizioni
			//vanno avanti di due solo se partono dalla loro posizione iniziale
			//TODO
			/*
				complete check for pawn both for black and white player.
				different coords to be considered
			*/
			if (chess.currentTurn == "white") {

			} else {
				
			}
			return {
				flag : true,
				data : window[chess.currentTurn].pawns[i]
			}
		}

	}
	return {
		flag : false,
		data : undefined
	}
}

function _validateRook(from, to) {
	var f = convertPosition(from.k, from.n);
	var t = convertPosition(to.k, to.n);
	for (var i in window[chess.currentTurn].rooks) {
		//checking if exist a pawn with this starting location
		if (_.isEqual(window[chess.currentTurn].rooks[i]._position, f)) {
			//check if destination is valid
			/*
				we should check if our piece can reach its destination
			*/
			return {
				flag : true,
				data : window[chess.currentTurn].rooks[i]
			}
		}

	}
	return {
		flag : false,
		data : undefined
	}
}

function _validateKnight(from, to) {
	var f = convertPosition(from.k, from.n);
	var t = convertPosition(to.k, to.n);
	for (var i in window[chess.currentTurn].knights) {
		//checking if exist a pawn with this starting location
		if (_.isEqual(window[chess.currentTurn].knights[i]._position, f)) {
			//check if destination is valid
			/*
				we should check if our piece can reach its destination
			*/
			return {
				flag : true,
				data : window[chess.currentTurn].knights[i]
			}
		}

	}
	return {
		flag : false,
		data : undefined
	}
}

function _validateBishop(from, to) {
	var f = convertPosition(from.k, from.n);
	var t = convertPosition(to.k, to.n);
	for (var i in window[chess.currentTurn].bishops) {
		//checking if exist a pawn with this starting location
		if (_.isEqual(window[chess.currentTurn].bishops[i]._position, f)) {
			//check if destination is valid
			/*
				we should check if our piece can reach its destination
			*/
			return {
				flag : true,
				data : window[chess.currentTurn].bishops[i]
			}
		}

	}
	return {
		flag : false,
		data : undefined
	}
}

function _validateQueen(from, to) {
	var f = convertPosition(from.k, from.n);
	var t = convertPosition(to.k, to.n);
	if (_.isEqual(window[chess.currentTurn].queen._position, f)) {
		//check if destination is valid
		/*
			we should check if our piece can reach its destination
		*/
		return {
			flag : true,
			data : window[chess.currentTurn].queen
		}
	}
	return {
		flag : false,
		data : undefined
	}
}

function _validateKing(from, to) {
	var f = convertPosition(from.k, from.n);
	var t = convertPosition(to.k, to.n);
	if (_.isEqual(window[chess.currentTurn].king._position, f)) {
		//check if destination is valid
		/*
			we should check if our piece can reach its destination
		*/
		return {
			flag : true,
			data : window[chess.currentTurn].king
		}
	}
	return {
		flag : false,
		data : undefined
	}
}