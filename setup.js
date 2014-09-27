
/*
	SETUP METHODS
	copyright© 2014 Marco Stagni. http://marcostagni.com
*/

function setUpPawns() {
	for (var p =0; p<8; p++) {
		//White
		white.pawns[p] = new THREE.Mesh(pawnGeometry,w_material);
		white.pawns[p].scale.set(0.65,0.65,0.65);
		white.pawns[p].castShadow = true;
		white.pawns[p].receiveShadow = true;
		core.add(white.pawns[p]);
		//addToBoard(white.pawns[p]);
		moveTo(white.pawns[p], convertPosition(letters[p],2));
		//blacks
		black.pawns[p] = new THREE.Mesh(pawnGeometry,b_material);
		black.pawns[p].castShadow = true;
		black.pawns[p].receiveShadow = true;
		black.pawns[p].scale.set(0.65,0.65,0.65);
		core.add(black.pawns[p]);
		//addToBoard(black.pawns[p]);
		moveTo(black.pawns[p], convertPosition(letters[p],7));
	}
}

function setUpRooks() {
	white.rooks[0] = new THREE.Mesh(rookGeometry, w_material);
	white.rooks[1] = new THREE.Mesh(rookGeometry, w_material);
	black.rooks[0] = new THREE.Mesh(rookGeometry, b_material);
	black.rooks[1] = new THREE.Mesh(rookGeometry, b_material);
	moveTo(white.rooks[1], convertPosition("a",1))
	moveTo(white.rooks[0], convertPosition("h",1))
	moveTo(black.rooks[1], convertPosition("a",8))
	moveTo(black.rooks[0], convertPosition("h",8))

	white.rooks[1].castShadow = true;
	white.rooks[0].castShadow = true;
	black.rooks[1].castShadow = true;
	black.rooks[0].castShadow = true;
	white.rooks[1].receiveShadow = true;
	white.rooks[0].receiveShadow = true;
	black.rooks[1].receiveShadow = true;
	black.rooks[0].receiveShadow = true;

	black.rooks[1].scale.set(0.65,0.65,0.65);
	black.rooks[0].scale.set(0.65,0.65,0.65);
	white.rooks[1].scale.set(0.65,0.65,0.65);
	white.rooks[0].scale.set(0.65,0.65,0.65);

	core.add(white.rooks[0]);
	core.add(white.rooks[1]);
	core.add(black.rooks[0]);
	core.add(black.rooks[1]);

	//addToBoard(white.rooks[0]);
	//addToBoard(white.rooks[1]);
	//addToBoard(black.rooks[0]);
	//addToBoard(black.rooks[1]);
}

function setUpKnights() {
	white.knights[0] = new THREE.Mesh(knightGeometry, w_material);
	white.knights[1] = new THREE.Mesh(knightGeometry, w_material);
	black.knights[0] = new THREE.Mesh(knightGeometry, b_material);
	black.knights[1] = new THREE.Mesh(knightGeometry, b_material);
	moveTo(white.knights[0], convertPosition("b",1))
	moveTo(white.knights[1], convertPosition("g",1))
	moveTo(black.knights[0], convertPosition("b",8))
	moveTo(black.knights[1], convertPosition("g",8))

	white.knights[1].castShadow = true;
	white.knights[0].castShadow = true;
	black.knights[1].castShadow = true;
	black.knights[0].castShadow = true;
	white.knights[1].receiveShadow = true;
	white.knights[0].receiveShadow = true;
	black.knights[1].receiveShadow = true;
	black.knights[0].receiveShadow = true;

	black.knights[1].scale.set(0.65,0.65,0.65);
	black.knights[0].scale.set(0.65,0.65,0.65);
	white.knights[1].scale.set(0.65,0.65,0.65);
	white.knights[0].scale.set(0.65,0.65,0.65);

	core.add(white.knights[0]);
	core.add(white.knights[1]);
	core.add(black.knights[0]);
	core.add(black.knights[1]);

	//addToBoard(white.knights[0]);
	//addToBoard(white.knights[1]);
	//addToBoard(black.knights[0]);
	//addToBoard(black.knights[1]);
}

function setUpBishops(){
	white.bishops[0] = new THREE.Mesh(bishopGeometry, w_material);
	white.bishops[1] = new THREE.Mesh(bishopGeometry, w_material);
	black.bishops[0] = new THREE.Mesh(bishopGeometry, b_material);
	black.bishops[1] = new THREE.Mesh(bishopGeometry, b_material);
	moveTo(white.bishops[1], convertPosition("c",1))
	moveTo(white.bishops[0], convertPosition("f",1))
	moveTo(black.bishops[1], convertPosition("c",8))
	moveTo(black.bishops[0], convertPosition("f",8))

	white.bishops[1].castShadow = true;
	white.bishops[0].castShadow = true;
	black.bishops[1].castShadow = true;
	black.bishops[0].castShadow = true;
	white.bishops[1].receiveShadow = true;
	white.bishops[0].receiveShadow = true;
	black.bishops[1].receiveShadow = true;
	black.bishops[0].receiveShadow = true;

	black.bishops[1].scale.set(0.65,0.65,0.65);
	black.bishops[0].scale.set(0.65,0.65,0.65);
	white.bishops[1].scale.set(0.65,0.65,0.65);
	white.bishops[0].scale.set(0.65,0.65,0.65);

	core.add(white.bishops[0]);
	core.add(white.bishops[1]);
	core.add(black.bishops[0]);
	core.add(black.bishops[1]);

	//addToBoard(white.bishops[0]);
	//addToBoard(white.bishops[1]);
	//addToBoard(black.bishops[0]);
	//addToBoard(black.bishops[1]);
}

function setUpKings() {
	white.king = new THREE.Mesh(kingGeometry, w_material);
	black.king = new THREE.Mesh(kingGeometry, b_material);
	moveTo(white.king, convertPosition("e",1))
	moveTo(black.king, convertPosition("e",8))

	white.king.castShadow = true;
	black.king.castShadow = true;
	white.king.receiveShadow = true;
	black.king.receiveShadow = true;

	black.king.scale.set(0.65,0.65,0.65);
	white.king.scale.set(0.65,0.65,0.65);
	core.add(white.king);
	core.add(black.king);

	//addToBoard(white.king);
	//addToBoard(black.king);
}

function setUpQueens() {
	white.queen = new THREE.Mesh(queenGeometry, w_material);
	black.queen = new THREE.Mesh(queenGeometry, b_material);
	moveTo(white.queen, convertPosition("d",1))
	moveTo(black.queen, convertPosition("d",8))

	white.queen.castShadow = true;
	black.queen.castShadow = true;
	white.queen.receiveShadow = true;
	black.queen.receiveShadow = true;

	black.queen.scale.set(0.65,0.65,0.65);
	white.queen.scale.set(0.65,0.65,0.65);
	core.add(white.queen);
	core.add(black.queen);

	//addToBoard(white.queen);
	//addToBoard(black.queen);
}