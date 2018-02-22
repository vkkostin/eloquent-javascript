// PROBLEM 1

function verify(regexp, yes, no) {
	// Ignore unfinished exercises
	if (regexp.source === "...") return;
	yes.forEach(s => {
		if (!regexp.test(s)) {
			console.log("Failure to match '" + s + "'");
		} else {
			console.log(regexp.test(s));
		}

	});
	no.forEach(s => {
		if (regexp.test(s))
			console.log("Unexpected match for '" + s + "'");
	});
}

// verify(/ca[rt]/, ['my car', 'bad cats'], ['camper', 'high art']);

// verify(/pr?op/, ['pop culture', 'mad props'], ['plop']);

// verify(/ferr(y|et|ari)/, ["ferret", "ferry", "ferrari"], ["ferrum", "transfer A"]);

// verify(/ious\b/, ["how delicious", "spacious room"], ["ruinous", "consciousness"]);

// verify(/\s[.,;:]/, ["bad punctuation .", "hello ;", " :"], ["escape the dot"]);

// verify(/\w{7,}/, ["hottentottententen"], ["no", "hotten totten tenten"]);

// verify(/\b[^e\W]+\b/, ["red platypus", "wobbling nest"], ["earth bed", "learning ape"]);



// PROBLEM 2
const text = "'I'm the cook,' he said, 'it's my job.'";
// --> "I'm the cook," he said, "it's my job."

const addSpace = match => match === ' \'' ? ' \"' : match === '\' ' ? '\" ' : '\"';

console.log(text.replace(/^'|'$|'\s|\s'/g, addSpace));



// PROBLEM 3
const number = /^[+|\-]?([.]?\d+|\d+[.]?)[\d]*?([e|E][+|\-]?\d+)?$/;


// ["1", "-1", "+15", "1.55", ".5", "5.", "1.3e2", "1E-4",
// 	"1e+12"].forEach(function(s) {
// 	if (!number.test(s))
// 		console.log("Failed to match '" + s + "'");
// });
//
// ["1a", "+-1", "1.2.3", "1+1", "1e4.5", ".5.", "1f5",
// 	"."].forEach(function(s) {
// 	if (number.test(s))
// 		console.log("Incorrectly accepted '" + s + "'");
// });
