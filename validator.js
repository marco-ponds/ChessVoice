Class("Validator", {
	Validator : function(game) {
		this.game = game;
	},

	traverse : function(jsonObj, pos) {
		var found = false;
		$.each(obj, function(k, v) {
			if (obj[k] instanceof Array) {
				$.each(obj[k], function(k,v) {
					if (_.isEqual(v._position, pos)) found = true;
				});
			} else {
				if (_.isEqual(obj[k]._position, pos)) found = true;
			}
		});
		return found;
	},

	/**************************************************
		HELPERS METHOD TO CHECK IF PIECE IS VALID
	**************************************************/

	_validatePawn : function(from, to) {
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
				var valid_piece = { flag : true, data : window[chess.currentTurn].pawns[i]};
				var null_piece = { flag : false, data : undefined};
				//i pedoni vanno solo dritto di uno o al massimo due posizioni
				//vanno avanti di due solo se partono dalla loro posizione iniziale
				//TODO
				/*
					complete check for pawn both for black and white player.
					different coords to be considered
				*/
				var convertedPos = convertCoordsToPosition(pawn._position);
				if (chess.currentTurn == "white") {
					//controllo se sono nella posizione iniziale. (il numero deve essere 1)
					if (convertedPos.n == 1) {
						//this pawn is in first position //never moved
						if (to.k != convertedPos.k) return null_piece; //different letter = impossible
						if (to.n > (convertedPos.n+2)) return null_piece; //trying to go further than 2 moves
						//we must check that there is nobody between
						var check_pos = convertedPos.n+1;
						while (check_pos <= to.n) {
							if (this.traverse(window[this.game.currentTurn], convertPosition(to.k, check_pos))) {
								//if we are here, we found something on the path
								return null_piece;
							}
							check_pos++;
						}
						//conditions are enough to move? i think so
						return valid_piece;
					} else{
						//this pawn already moved
						if (to.k != convertedPos.k) return null_piece;
						if (to.n > (convertedPos.n+1)) return null_piece;
						//we only have to check the next position
						if (this.traverse(window[this.game.currentTurn], convertPosition(to.k, to.n))) return null_piece;

						return valid_piece;
					}
				} else {
					//black is moving
					if (convertPosition.n == 6) {

					} else {
						
					}
				}
				return {
					flag : true,
					data : window[chess.currentTurn].pawns[i]
				}
			}

		}
		//if we are here, no pawns wew found
		return {
			flag : false,
			data : undefined
		}
	},

	_validateRook : function(from, to) {
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
	},

	_validateKnight : function(from, to) {
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
	},

	_validateBishop : function(from, to) {
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
	},

	_validateQueen : function(from, to) {
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
	},

	_validateKing : function(from, to) {
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

});