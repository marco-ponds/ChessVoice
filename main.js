/*
	CREDITS

	CHESS MODELS: http://www.blendswap.com/user/Zombiecrackers
*/

/*
	MAIN SCRIPT
	copyright© 2014 Marco Stagni. http://marcostagni.com
*/

function onLeapSocketConnected() {
	l("Leap socket connected.", "i");
}

function onLeapDeviceConnected() {
	l("Leap Device connected.", "i");
}

function onLeapDeviceDisconnected() {
	l("Leap Device disconnected.", "i");
}


var board, cube, bishop;
var boardTexturesKeys = ["plain", "wood"];
var boardTextures = {
	"plain" : "img/chessboard.gif",
	"wood" : "img/chessboardWood.jpg"
}

var letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
var numbers = [1,2,3,4,5,6,7,8];
var zeroPosition = {
	x : -7,
	z : 7
}
var step = 2;

//black user
var black = {
	pawns : [],
	queen : {},
	king : {},
	bishops : [],
	knights : [],
	rooks : []
};

//white user
var white = {
	pawns : [],
	queen : {},
	king : {},
	bishops : [],
	knights : [],
	rooks : []
};

var langMapping = {
	"it-IT": {
		"pedone"	: "pawns",
		"torre"		: "rooks",
		"alfiere"	: "bishops",
		"cavallo"	: "knights",
		"regina"	: "queen",
		"re"		: "king"
	}
}

//black and white materials
var w_material = new THREE.MeshLambertMaterial({
	color : "white",
	//	map : THREE.ImageUtils.loadTexture(boardTextures[boardTexturesKeys[count]])
});
var b_material = new THREE.MeshLambertMaterial({
	color : "#23272B"
});

//geometries
var pawnGeometry, pawnMaterial;
var rookGeometry, rookMaterial;
var bishopGeometry, bishopMaterial;
var knightGeometry, knightMaterial;
var kingGeometry, kingMaterial;
var queenGeometry, queenMaterial;

/*
	voice recognition methods
*/
var recognition, recognizing = false;
var selectedlanguage = "it-IT";
var languages = ["it-IT", "en-GB", "en-US"];

function convertPosition( letter, number ) {
	//if we have a1, we must give
	var _x = (zeroPosition.x) + (letters.indexOf(letter) * step);
	var _z = (zeroPosition.z) - (numbers.indexOf(number) * step);
	return {
		x : _x,
		y : 0,
		z : _z 
	};
}

function moveTo(element, position) {
	//storing position inside element
	element._position = position;
	var current = {
		x : element.position.x,
		z : element.position.z
	};
	var t = new TWEEN.Tween(current).to({x : position.x, z: position.z}, 1000);
	t.easing(TWEEN.Easing.Exponential.EaseIn);
	t.onUpdate(function() {
		////console.log("current " + current);
		element.position.x = current.x;
		element.position.z = current.z;
	});
	t.start();
}

var count = 0;
function changeBoardTexture() {
	board.material.map = THREE.ImageUtils.loadTexture(boardTextures[boardTexturesKeys[count]]);
	count++;
	if (count == boardTexturesKeys.length) count = 0;
}

var angle = 0, angle_step = 0.001;
function onCreate() {
	core.camera.position.y = 8;
	core.camera.position.z = 12;
	core.camera.rotation.x = -0.5;

	core.camera._render = function() {
		/*this.position.x = Math.cos(angle)*12;
		this.position.z = Math.sin(angle)*12;
		this.up = new THREE.Vector3(0,0,-1);
		this.lookAt(new THREE.Vector3(0,0,0));
		angle += angle_step;*/
	}

	var material = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(boardTextures.wood),
		side : THREE.DoubleSide
	});
	// board
	board = new THREE.Mesh(new THREE.PlaneGeometry(16,16), material);
	board.overdraw = true;
	board.rotation.x = Math.PI / 2; //90 degrees
	core.add(board);
	board._render = handleBoardRender;

	//creating ambient light
	var ambientLight = new THREE.AmbientLight(0xbbbbbb);
	//core.add(ambientLight);

	//adding fog
	core.scene.fog = new THREE.Fog( 0xffffff, 1000, 10000 );

	//creating directional light
	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 5, 1).normalize();
	directionalLight.castShadow = true;
	directionalLight.shadowDarkness = 0.5;
	core.add(directionalLight);

	//creating background
	var back = new THREE.Mesh(new THREE.PlaneGeometry(16,16), new THREE.MeshBasicMaterial({color:0x6e859f}));
	back.scale.set(20,20,20);
	back.position.z = -10;
	back.overdraw = true;
	//back.rotation.y = Math.PI / 2; //90 degrees
	core.add(back);
	back._render = function() {}

	/*
		TO DO LIST
		 - get models for each chess element
		 - calculate right movements for each element
		 - start using voice recognition
		 - change chess board
	*/

	//preload should have ended
	setUpPawns();
	setUpRooks();
	setUpKnights();
	setUpBishops();
	setUpKings();
	setUpQueens();

	//starting recognition
	setUpRecognition();
	recognition.lang = selectedlanguage;
	recognition.start();
}

function parseVocalInput(input) {
	recognition.stop();
	var words = input.split(" ");
	var foundPiece, piecePos;
	var foundTarget, foundTargetNum;
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
			foundTargetNum = parseInt(words[i]) < 9 ? parseInt(words[i]) : undefined;
			if (words[i-1] != " " && words[i-1] != undefined) {
				if (letters.indexOf(words[i-1].toLowerCase()) != -1) {
					//abbiamo trovato una delle lettere valide
					foundTarget = words[i-1].toLowerCase();
				}
 			} else if (words[i-1] != " " && words[i-1] != undefined) {
					if (letters.indexOf(words[i-2].toLowerCase()) != -1) {
						//abbiamo trovato una delle lettere valide
						foundTarget = words[i-2].toLowerCase();
					}
 			} 			
		}

		if (foundTarget && foundTargetNum) {
			break;
		}
	}

	l("found " + foundTarget + " - " + foundTargetNum + " foundPiece " + foundPiece);

	moveTo(white[foundPiece],convertPosition(foundTarget,foundTargetNum));
}

var jsonCount = 0;
function checkBeforeLoad(callback) {
	if (jsonCount == 6) {
		callback();
	}
}
console.log("parsing main.js");
progressAnimation = function(callback) {
	console.log("my progress");
	$('#loader').animate({"opacity" : "0", "margin-top" : "250px"}, 1000 , function () {
		$('#loader').remove();	
		$('body').animate({backgroundColor : "#fff"}, 200 , callback);
	});
}

function preload(callback) {
	//use this method to perform heavy tasks
	//loading chess models
	//console.log("inside preload");
	var loader = new THREE.JSONLoader(true);
	//setting up pawns
	loader.load("models/pawn.js", function(geom, mats) {
		pawnGeometry = geom;
		//console.log("inside laod pawn");
		//setUpPawns();
		jsonCount++;
		checkBeforeLoad(callback);
	});

	//console.log("after 1");

	loader.load("models/rook.js", function(geom, mats) {
		rookGeometry = geom;
		//console.log("inside load rook");
		//setUpRooks();
		jsonCount++;
		checkBeforeLoad(callback);

	});

	//console.log("after 2");

	loader.load("models/knight.js", function(geom, mats) {
		knightGeometry = geom;
		//console.log("inside load knight")
		//setUpKnights();
		jsonCount++;
		checkBeforeLoad(callback);

	});

	//console.log("after 3");

	loader.load("models/bishop.js", function(geom, mats) {
		bishopGeometry = geom;
		//console.log("inside load bishop")
		//setUpBishops();
		jsonCount++;
		checkBeforeLoad(callback);

	});

	//console.log("after 4");

	loader.load("models/queen.js", function(geom, mats) {
		queenGeometry = geom;
		//console.log("inside load queen")
		//setUpQueens();
		jsonCount++;
		checkBeforeLoad(callback);

	});

	//console.log("after 5");

	loader.load("models/king.js", function(geom, mats) {
		kingGeometry = geom;
		//console.log("inside load king")
		//setUpKings();
		jsonCount++;
		checkBeforeLoad(callback);

	});

	//console.log("after 6");
}

function handleBoardRender(obj) {
}

input.keydown = function(event) {

};

input.keyup = function(event) {

};

function setUpLeap() {

}
