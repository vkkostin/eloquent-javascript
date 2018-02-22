const stringedFunction = 'exports.add = num => num + 5; exports.sub = num => num - 5';

function requires(func) {
	if (func in requires.cache) return requires.cache[func];


	const code = new Function('exports', 'modules', func);
	const exports = {}, module = { exports: exports };

	code(exports, module);

	requires.cache[func] = module.exports;
	return exports;
}
requires.cache = Object.create(null);



const math = requires(stringedFunction);

// console.log(math);
console.log(requires.cache);

// console.log(requires(stringedFunction).add(10));




// PROBLEM 1
const monthNames = {};

(exports => {
		const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
		const monthsShort = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sept', 'oct', 'nov', 'dec'];

		exports.name = number => months[number];
		exports.number = name => name.length === 3 || name === 'sept' ? monthsShort.indexOf(name.toLowerCase()) : months.indexOf(name.toLowerCase());

})(monthNames);


// console.log(monthNames.number('apr'));
// console.log(monthNames.number('September'));
