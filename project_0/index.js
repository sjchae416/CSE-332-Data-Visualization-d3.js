const inp_txt = document.getElementById('inp-txt');
const btn_txt = document.getElementById('btn-txt');
const result_container = document.getElementById('result-container');
const p_nws = document.getElementById('p-nws');
const p_hist = document.getElementById('p-hist');
const p_es = document.getElementById('p-es');
const p_w = document.getElementById('p-w');
var usr_txt = '';

function analyzeText(txt) {
	result_container.style.display = 'block';
	var chars = txt.split('').sort();
	// console.log(chars);
	var words = txt.split(' ');
	// console.log(words);
	var instances = {};
	var nwChar = 0;
	var word_count = 0;

	for (var i = 0; i < chars.length; i++) {
		// NOTE count non-white space characters
		if (chars[i] != ' ') {
			nwChar++;
		}
		// NOTE add existing characters (excluding empty spaces) to the associative array
		if (instances[chars[i]] == undefined) {
			instances[chars[i]] = 0;
		}
		// NOTE count instances of each character (excluding empty spaces)
		instances[chars[i]]++;
	}

	// NOTE print histogram (excluding empty spaces)
	console.log('Histogram: \n');
	var hist = '';
	for (var i in instances) {
		if (i != ' ') {
			console.log(i + ': ' + instances[i]);
			hist += i + ': ' + instances[i] + '\n';
		}
	}
	p_hist.innerText = hist;

	// NOTE count total number of words (don't count '' as a word)
	for (var i = 0; i < words.length; i++) {
		if (words[i] != '') {
			word_count++;
		}
	}

	// NOTE spellcheck
	for (var i = 0; i < words.length; i++) {
		var letters = words[i].split('');
		for (var j = 0; j < letters.length; j++) {
			var letter_count = 1;
			for (var k = j + 1; k < letters.length; k++) {
				if (letters[j] == letters[k]) {
					letter_count++;
					if (letter_count > 2) {
						alert(
							'ERROR_CODE: Spellchecking! \n\nThere are more than 2 instances of the same character!'
						);
					}
				}
			}
		}
	}

	console.log(`There are ${nwChar} non-white space characters`);
	p_nws.innerText = nwChar;

	console.log(
		`There are ${
			instances[' '] ? instances[' '] : 0
		} empty spaces and ${word_count} words`
	);
	p_es.innerText = instances[' '] ? instances[' '] : 0;
	p_w.innerText = word_count;
}

btn_txt.onclick = function () {
	usr_txt = inp_txt.value;
	console.log(`User typed "${usr_txt}"`);
	analyzeText(usr_txt);
};
