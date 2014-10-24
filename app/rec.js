var recognition, recognizing;
var start_timestamp;
var final_transcript = "";
var ignore_onend;
function setUpRecognition() {
	if (!('webkitSpeechRecognition' in window)) {
		l("need to upgrade browser");
		upgrade();
	} else {
		l("browser up to date");
		recognition = new webkitSpeechRecognition();
		l("lang: " + recognition.lang);
		recognition.lang = "it-IT";
		//recognition.continuous = false;
		//recognition.interimResults = false;
		recognition.onstart = function(event) {
			recognizing = true;
			start_timestamp = event.timeStamp;
		};

		recognition.onerror = function(event) {
			if (event.error == 'no-speech') {
				l("no-speech error", "e");
				ignore_onend = true;
			}
			if (event.error == 'audio-capture') {
				l('info_no_microphone','e');
				ignore_onend = true;
			}
			if (event.error == 'not-allowed') {
				if (event.timeStamp - start_timestamp < 100) {
					l('info_blocked','e');
				} else {
					l('info_denied','e');
				}
				ignore_onend = true;
			}
			//Chess.repeatInput();
		};

		recognition.onend = function() {
			recognizing = false;
			if (ignore_onend) {
				return;
			}
		};

		recognition.onresult = function(event) {
			var interim_transcript = '';
			if (typeof(event.results) == 'undefined') {
				recognition.onend = null;
				recognition.stop();
				upgrade();
				return;
			}
			final_transcript = event.results[0][0].transcript;
			if (final_transcript.length > 0) {
				recognition.callback(final_transcript);
			}
		};
		l("about to setup recognition._start");
		recognition._start = function(callback) {
			recognition.callback = callback;
			recognition.start();
		}
	}
}

function upgrade() {
	console.log("please upgrade chrome");
}

var first_char = /\S/;
function capitalize(s) {
	return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}