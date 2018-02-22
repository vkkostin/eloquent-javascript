const BouncingCritter = require('./critter');
const World = require('./world');
const Wall = require('./wall');
const { plan } = require('./exports');


const world = new World(plan, {"#": Wall, "o": BouncingCritter});

console.log(world.toString());

for (let i = 0; i < 5; i++) {
  world.turn();
  console.log(world.toString());
}


