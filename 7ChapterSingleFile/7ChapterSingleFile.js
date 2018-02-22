//////// FUNCTIONS and CONSTANT DECLARATIONS
const World1 =
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
const Inhabitants1 = {"#": Wall, "o": BouncingCritter};

const World2 =
	["############################",
	 "#####                 ######",
	 "##   ***                **##",
	 "#   *##**         **  O  *##",
	 "#    ***     O    ##**    *#",
	 "#       O         ##***    #",
	 "#                 ##**     #",
	 "#   O       #*             #",
	 "#*          #**       O    #",
	 "#***        ##**    O    **#",
	 "##****     ###***       *###",
	 "############################"];
const Inhabitants2 = {"#": Wall, "O": PlantEater, "*": Plant};


const World3 =
	["####################################################",
		"#                 ####         ****              ###",
		"#   *  @  ##                 ########       OO    ##",
		"#   *    ##        O O                 ****       *#",
		"#       ##*                        ##########     *#",
		"#      ##***  *         ****                     **#",
		"#* **  #  *  ***      #########                  **#",
		"#* **  #      *               #   *              **#",
		"#     ##              #   O   #  ***          ######",
		"#*            @       #       #   *        O  #    #",
		"#*                    #  ######                 ** #",
		"###          ****          ***                  ** #",
		"#       O                        @         O       #",
		"#   *     ##  ##  ##  ##               ###      *  #",
		"#   **         #              *       #####  O     #",
		"##  **  O   O  #  #    ***  ***        ###      ** #",
		"###               #   *****                    ****#",
		"####################################################"];
const Inhabitants3 = {"#": Wall, "O": PlantEater, "*": Plant, '@': Tiger};

// Directional property names return a new vector corresponding to that direction
const directions = {
	"n":  new Vector( 0, -1),
	"ne": new Vector( 1, -1),
	"e":  new Vector( 1,  0),
	"se": new Vector( 1,  1),
	"s":  new Vector( 0,  1),
	"sw": new Vector(-1,  1),
	"w":  new Vector(-1,  0),
	"nw": new Vector(-1, -1)
};

// An array of the keys in the directions object
const directionNames = "n ne e se s sw w nw".split(" ");

// Takes a string character and turns it into the appropriate 'new' object (setting the originChar property of that object to the string character)
function elementFromChar(legend, ch) {
	if (ch === " ")
		return null;
	const element = new legend[ch]();
	element.originChar = ch;
	return element;
}

// Takes an object and returns its string character using the originChar property set by elementFromChar above
function charFromElement(element) {
	if (element === null)
		return " ";
	else
		return element.originChar;
}

// Takes an array (in this case the directionNames) and returns a random cardinal direction
function randomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

// Takes a string cardinal direction a number of how many desired turns and returns a new string direction
function dirPlus(dir, n) {
	const index = directionNames.indexOf(dir);
	return directionNames[(index + n + 8) % 8];
}

// Prints the animated world into the console, taking a world parameter and desired number of turns
function printWorld(world, turns) {
	console.log(world.toString());
	for (let i = 0; i < turns; i++) {
		world.turn();
		console.log(world.toString());
	}
}


//	VECTOR DEFINITION
function Vector(x, y) {
	this.x = x;
	this.y = y;
}
Vector.prototype.plus = function(other) {
	return new Vector(this.x + other.x, this.y + other.y);
};


// GRID DEFINITION
function Grid(width, height) {
	this.space = new Array(width * height);
	this.width = width;
	this.height = height;
}


Grid.prototype.isInside = function(vector) {
	return vector.x >= 0 && vector.x < this.width &&
		vector.y >= 0 && vector.y < this.height;
};
Grid.prototype.get = function(vector) {
	return this.space[vector.x + this.width * vector.y];
};
Grid.prototype.set = function(vector, value) {
	this.space[vector.x + this.width * vector.y] = value;
};
Grid.prototype.forEach = function(f, context) {
	for (let y = 0; y < this.height; y++) {
		for (let x = 0; x < this.width; x++) {
			const value = this.space[x + y * this.width];
			if (value !== null)
				f.call(context, value, new Vector(x, y));
		}
	}
};


////// WORLD DEFINITION //////
function World(map, legend) {
	const grid = new Grid(map[0].length, map.length);
	this.grid = grid;
	this.legend = legend;

	map.forEach(function(line, y) {
		for (let x = 0; x < line.length; x++)
			grid.set(new Vector(x, y),
				elementFromChar(legend, line[x]));
	});
}


World.prototype.toString = function() {
	let output = "";
	for (let y = 0; y < this.grid.height; y++) {
		for (let x = 0; x < this.grid.width; x++) {
			const element = this.grid.get(new Vector(x, y));
			output += charFromElement(element);
		}
		output += "\n";
	}
	return output;
};
World.prototype.turn = function() {
	let acted = [];
	this.grid.forEach(function(critter, vector) {
		if (critter.act && acted.indexOf(critter) === -1) {
			acted.push(critter);
			this.letAct(critter, vector);
		}
	}, this);
};
World.prototype.letAct = function(critter, vector) {
	const action = critter.act(new View(this, vector));
	if (action && action.type === "move") {
		const dest = this.checkDestination(action, vector);
		if (dest && this.grid.get(dest) === null) {
			this.grid.set(vector, null);
			this.grid.set(dest, critter);
		}
	}
};
World.prototype.checkDestination = function(action, vector) {
	if (directions.hasOwnProperty(action.direction)) {
		const dest = vector.plus(directions[action.direction]);
		if (this.grid.isInside(dest))
			return dest;
	}
};



////////// LIFELIKE WORLD //////////
function LifelikeWorld(map, legend) {
	World.call(this, map, legend);
}
LifelikeWorld.prototype = Object.create(World.prototype);

const actionTypes = Object.create(null);

LifelikeWorld.prototype.letAct = function(critter, vector) {
	const action = critter.act(new View(this, vector));
	const handled = action && action.type in actionTypes && actionTypes[action.type].call(this, critter, vector, action);
	if (!handled) {
		critter.energy -= 0.2;
		if (critter.energy <= 0)
			this.grid.set(vector, null);
	}
};



////////// VIEW ////////
function View(world, vector) {
	this.world = world;
	this.vector = vector;
}


View.prototype.look = function(dir) {
	const target = this.vector.plus(directions[dir]);
	if (this.world.grid.isInside(target))
		return charFromElement(this.world.grid.get(target));
	else
		return "#";
};
View.prototype.findAll = function(ch) {
	const found = [];
	for (let dir in directions)
		if (this.look(dir) === ch)
			found.push(dir);
	return found;
};
View.prototype.find = function(ch) {
	const found = this.findAll(ch);
	if (found.length === 0) return null;
	return randomElement(found);
};


////////// WALL ////////
function Wall() {}


////////// DENIZENS ////////

// Critter that moves
function BouncingCritter() {
	this.direction = randomElement(directionNames);
}

BouncingCritter.prototype.act = function(view) {
	if (view.look(this.direction) !== " ") {
		this.direction = view.find(" ") || "s";
	}
	return {type: "move", direction: this.direction};
};


// Critter that follows the wall on the left side
function WallFollower() {
	this.dir = "s";
}

WallFollower.prototype.act = function(view) {
	let start = this.dir;
	if (view.look(dirPlus(this.dir, -3)) !== " ")
		start = this.dir = dirPlus(this.dir, -2);
	while (view.look(this.dir) !== " ") {
		this.dir = dirPlus(this.dir, 1);
		if (this.dir === start) break;
	}
	return {type: "move", direction: this.dir};
};


// Plant that provides a random amount of enery to consumer
function Plant() {
	this.energy = 3 + Math.random() * 4;
}

Plant.prototype.act = function(view) {
	if (this.energy > 15) {
		const space = view.find(" ");
		if (space)
			return {type: "reproduce", direction: space};
	}
	if (this.energy < 20)
		return {type: "grow"};
};


// Herbivore critter that eats plants
function PlantEater() {
	this.energy = 20;
}

PlantEater.prototype.act = function(view) {
	const space = view.find(" ");
	if (this.energy > 60 && space) {
		return {type: "reproduce", direction: space};
	}
	const plant = view.find("*");
	if (plant) {
		return {type: "eat", direction: plant};
	}
	if (space) {
		return {type: "move", direction: space};
	}
};

// PROBLEM 2
// Carnivore that eats herbivores
function Tiger() {
	this.energy = 40;
}

Tiger.prototype.act = function(view) {
	const energy = this.energy;

	// character search
	const space = view.find(" ");
	const herbivore = view.find("0");

	// actions
	const reproduce = {type: "reproduce", direction: space};
	const eat = {type: "eat", direction: herbivore};
	const move = {type: "move", direction: space};

	// behavior control

	return energy > 60 && space ? reproduce : energy < 30 && herbivore ? eat : move;
};



// PROBLEM 1: a new critter that is not a glutton and/or have them actively look for plants and/or breed slower
function SmartPlantEater() {
	this.energy = 20;
}

SmartPlantEater.prototype.act = function(view) {
	const energy = this.energy;

	// character search
	const space = view.find(" ");
	const plant = view.find("*");
	const enemyNearby = view.find("@");

	// calculates the opposite direction from enemy
	const enemyLocation = directionNames[enemyNearby];
	const awayFromEnemy = directionNames[(enemyLocation + 4) % 4];

	// actions
	const reproduce = {type: "reproduce", direction: space};
	const eat = {type: "eat", direction: plant};
	const move = {type: "move", direction: space};
	const evade = {type: "evade", direction: awayFromEnemy};

	// behavior control
	return enemyNearby && energy > 5 ? evade : energy > 40 && space ? reproduce : energy < 30 && plant ? eat : energy > 10 && space ? move : true;
};




// ACTION TYPES DEFINED: GROW, MOVE, EAT, and REPRODUCE
actionTypes.grow = function(critter) {
	critter.energy += 0.5;
	return true;
};

actionTypes.move = function(critter, vector, action) {
	const dest = this.checkDestination(action, vector);
	if (dest === null || critter.energy <= 1 || this.grid.get(dest) !== null)
		return false;
	critter.energy -= 1;
	this.grid.set(vector, null);
	this.grid.set(dest, critter);
	return true;
};

actionTypes.evade = function(critter, vector, action) {

};

actionTypes.eat = function(critter, vector, action) {
	const dest = this.checkDestination(action, vector);
	const atDest = dest !== null && this.grid.get(dest);
	if (!atDest || atDest.energy === null)
		return false;
	critter.energy += atDest.energy;
	this.grid.set(dest, null);
	return true;
};

actionTypes.reproduce = function(critter, vector, action) {
	const baby = elementFromChar(this.legend,
		critter.originChar);
	const dest = this.checkDestination(action, vector);
	if (dest === null ||
		critter.energy <= 2 * baby.energy ||
		this.grid.get(dest) !== null)
		return false;
	critter.energy -= 2 * baby.energy;
	this.grid.set(dest, baby);
	return true;
};



// Defines worlds
const world = new World(World1, Inhabitants1);

const valley = new LifelikeWorld(World2, Inhabitants2);

const large = new World(World3, Inhabitants3);

printWorld(world, 5);
// printWorld(valley, 5);
// printWorld(large, 5);