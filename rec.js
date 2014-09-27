var recognition, recognizing;
var start_timestamp;
var final_transcript = "";
var ignore_onend;
function setUpRecognition() {
  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  } else {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

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
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      //final_span.innerHTML = linebreak(final_transcript);
      //l(linebreak("F "+final_transcript));
      //l(linebreak("I "+interim_transcript));
      //facciamo il parse della frase solo se è pià lunga di zero caratteri
      parseVocalInput(final_transcript);
      //interim_span.innerHTML = linebreak(interim_transcript);
    };
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