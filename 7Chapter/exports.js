const Vector = require('./vector');

exports.directions = {
  "n":  new Vector( 0, -1),
  "ne": new Vector( 1, -1),
  "e":  new Vector( 1,  0),
  "se": new Vector( 1,  1),
  "s":  new Vector( 0,  1),
  "sw": new Vector(-1,  1),
  "w":  new Vector(-1,  0),
  "nw": new Vector(-1, -1)
};

exports.charFromElement = function(element) {
  if (element === null)
    return " ";
  else
    return element.originChar;
};

exports.randomElement = function(array) {
  return array[Math.floor(Math.random() * array.length)];
};

exports.elementFromChar = function(legend, ch) {
  if (ch === " ")
    return null;
  const element = new legend[ch]();
  element.originChar = ch;
  return element;
};

exports.directionNames = "n ne e se s sw w nw".split(" ");
const directionNames = "n ne e se s sw w nw".split(" ");


exports.dirPlus = function(dir, n) {
	const index = directionNames.indexOf(dir);
	return directionNames[(index + n + 8) % 8];
};


exports.plan =
   ["############################",
    "#      #    #      o      ##",
    "#                          #",
    "#          #####           #",
    "##         #   #    ##     #",
    "###           ##     #     #",
    "#           ###      #     #",
    "#   ####                   #",
    "#   ##       o             #",
    "# o  #         o       ### #",
    "#    #                     #",
    "############################"];