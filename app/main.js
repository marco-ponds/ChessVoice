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

var chess;

var board, bishop, skyBox;
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
	},
	"en-US": {
		"pawn"		: "pawns",
		"rook"		: "rooks",
		"bishop"	: "bishops",
		"knight"	: "knights",
		"queen"		: "queen",
		"king"		: "king"
	},
	"en-GB": {
		"pawn"		: "pawns",
		"rook"		: "rooks",
		"bishop"	: "bishops",
		"knight"	: "knights",
		"queen"		: "queen",
		"king"		: "king"
	}
}

var symbolsMap = {
	"white": {
		"pawn"		: "&#9817;",
		"rook"		: "&#9814;",
		"bishop"	: "&#9815;",
		"knight"	: "&#9816;",
		"queen"		: "&#9813;",
		"king"		: "&#9812;"
	},
	"black": {
		"pawn"		: "&#9823;",
		"rook"		: "&#9820;",
		"bishop"	: "&#9821;",
		"knight"	: "&#9822;",
		"queen"		: "&#9819;",
		"king"		: "&#9818;"
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

function convertPosition(letter, number) {
	//if we have a1, we must give
	var _x = (zeroPosition.x) + (letters.indexOf(letter) * step);
	var _z = (zeroPosition.z) - (numbers.indexOf(number) * step);
	return {
		x : _x,
		y : 0,
		z : _z 
	};
}

function convertCoordsToPosition(pos) {
	var letter_pos = (pos.x - zeroPosition.x)/step;
	var number_pos = (zeroPosition.z - pos.z)/step;
	return {
		k : letters[letter_pos],
		n : numbers[number_pos]
	}
}

function moveTo(element, position, callback) {
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
	t.onComplete(function() {
		if (!_.isUndefined(callback)) {
			callback();
		}
	});
	t.start();
}

var count = 1;
function changeBoardTexture() {
	board.material.map = THREE.ImageUtils.loadTexture(boardTextures[boardTexturesKeys[count]]);
	count++;
	if (count == boardTexturesKeys.length) count = 0;
}

var angle = 0, angle_step = 0.001;
function onCreate() {
	core.camera.position.y = 7.5;//8;
	core.camera.position.z = 11;//12;
	//core.camera.rotation.x = -0.5;
	core.camera.rotation.set(0,0,0);
	core.camera.lookAt(new THREE.Vector3(0,0,0));

	core.camera._render = function() {
		/*this.position.x = Math.cos(angle)*12;
		this.position.z = Math.sin(angle)*12;
		this.up = new THREE.Vector3(0,0,-1);
		this.lookAt(new THREE.Vector3(0,0,0));
		angle += angle_step;*/
	}

	var material = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(boardTextures.plain),
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
	back.scale.set(100,100,100);
	back.position.z = -20;
	back.overdraw = true;
	//back.rotation.y = Math.PI / 2; //90 degrees
	core.add(back);
	back._render = function() {}

	//creating background
	var back2 = new THREE.Mesh(new THREE.PlaneGeometry(16,16), new THREE.MeshBasicMaterial({color:0x6e859f, side:THREE.DoubleSide}));
	back2.scale.set(100,100,100);
	back2.position.z = 20;
	back2.overdraw = true;
	//back2.rotation.y = Math.PI / 2; //90 degrees
	core.add(back2);
	back2._render = function() {}

	//creating bottom
	var bottom = new THREE.Mesh(new THREE.PlaneGeometry(16,16), new THREE.MeshBasicMaterial({color:0x6e859f, side:THREE.DoubleSide}));
	bottom.scale.set(100,100,100);
	bottom.overdraw = true;
	bottom.position.y = -5;
	bottom.rotation.x = Math.PI/2;
	//bottom.rotation.y = Math.PI / 2; //90 degrees
	core.add(bottom);
	bottom._render = function() {}

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

	//creating a new instance of chess object.
	chess = new Chess();
	chess.setUp();
	$('#play').on("click", function() {
		chess.playClickHandler();
	});
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

function displayMessage(message, type) {
	switch(type) {
		case "error": {
			console.err(message);
		}

		case "warning": {
			console.warn(message)
		}

		case "info": {
			console.info(message)
		}

		default : {
			console.log(message);
		}

	}
}

function handleBoardRender(obj) {
}

input.keydown = function(event) {
	//l(event);
};	

input.keyup = function(event) {

};

function setUpLeap() {

}

