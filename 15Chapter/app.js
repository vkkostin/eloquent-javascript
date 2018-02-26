// CONSTANTS
const actorChars = {
    "@": Player,
    "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
};
const maxStep = 0.05;
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;
const SCALE = 20;
const wobbleSpeed = 8;
const wobbleDist = 0.07;
const arrowCodes = {37: "left", 38: "up", 39: "right"};
const startingLives = 3;


// HELPER FUNCTIONS
function elt(name, className) {
    const elt = document.createElement(name);
    if (className) elt.className = className;
    return elt;
}


// LEVEL
function Level(plan) {
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = [];
    this.actors = [];
    this.coins = 0;

    for (let y = 0; y < this.height; y++) {
        const line = plan[y], gridLine = [];
        for (let x = 0; x < this.width; x++) {
            const ch = line[x];
            let fieldType = null;
            const Actor = actorChars[ch];
            if (Actor)
                this.actors.push(new Actor(new Vector(x, y), ch));
            else if (ch === "x")
                fieldType = "wall";
            else if (ch === "!")
                fieldType = "lava";
            gridLine.push(fieldType);
        }
        this.grid.push(gridLine);
    }

    this.totalCoins = this.actors.filter(actor => actor instanceof Coin).length;
    this.player = this.actors.filter(function(actor) {
        return actor.type === "player";
    })[0];
    this.status = this.finishDelay = null;
}

Level.prototype.isFinished = function() {
    return this.status != null && this.finishDelay < 0;
};

Level.prototype.obstacleAt = function(pos, size) {
    const xStart = Math.floor(pos.x);
    const xEnd = Math.ceil(pos.x + size.x);
    const yStart = Math.floor(pos.y);
    const yEnd = Math.ceil(pos.y + size.y);

    if (xStart < 0 || xEnd > this.width || yStart < 0)
        return "wall";
    if (yEnd > this.height)
        return "lava";
    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
            const fieldType = this.grid[y][x];
            if (fieldType) return fieldType;
        }
    }
};

Level.prototype.actorAt = function(actor) {
    for (let i = 0; i < this.actors.length; i++) {
        const other = this.actors[i];
        if (other !== actor &&
            actor.pos.x + actor.size.x > other.pos.x &&
            actor.pos.x < other.pos.x + other.size.x &&
            actor.pos.y + actor.size.y > other.pos.y &&
            actor.pos.y < other.pos.y + other.size.y)
            return other;
    }
};


Level.prototype.animate = function(step, keys) {
    if (this.status != null)
        this.finishDelay -= step;

    while (step > 0) {
        const thisStep = Math.min(step, maxStep);
        this.actors.forEach(function(actor) {
            actor.act(thisStep, this, keys);
        }, this);
        step -= thisStep;
    }
};

Level.prototype.playerTouched = function(type, actor) {
    if (type === "lava" && this.status == null) {
        this.status = "lost";
        this.finishDelay = 1;
    } else if (type === "coin") {
        this.coins ++;
        const coinsContainer = document.querySelector('.coins');
        coinsContainer.textContent = `${this.coins.toString()}/${this.totalCoins}`;

        this.actors = this.actors.filter(function(other) {
            return other !== actor;
        });
        if (!this.actors.some(function(actor) {
                return actor.type === "coin";
            })) {
            this.status = "won";
            this.finishDelay = 1;
        }
    }
};



// VECTOR
function Vector(x, y) {
    this.x = x; this.y = y;
}
Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
    return new Vector(this.x * factor, this.y * factor);
};


// PLAYER
function Player(pos) {
    this.pos = pos.plus(new Vector(0, -0.5));
    this.size = new Vector(0.8, 1.5);
    this.speed = new Vector(0, 0);
}
Player.prototype.type = "player";

Player.prototype.moveX = function(step, level, keys) {
    this.speed.x = 0;
    if (keys.left) this.speed.x -= playerXSpeed;
    if (keys.right) this.speed.x += playerXSpeed;

    const motion = new Vector(this.speed.x * step, 0);
    const newPos = this.pos.plus(motion);
    const obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle)
        level.playerTouched(obstacle);
    else
        this.pos = newPos;
};

Player.prototype.moveY = function(step, level, keys) {
    this.speed.y += step * gravity;
    const motion = new Vector(0, this.speed.y * step);
    const newPos = this.pos.plus(motion);
    const obstacle = level.obstacleAt(newPos, this.size);
    if (obstacle) {
        level.playerTouched(obstacle);
        if (keys.up && this.speed.y > 0)
            this.speed.y = -jumpSpeed;
        else
            this.speed.y = 0;
    } else {
        this.pos = newPos;
    }
};

Player.prototype.act = function(step, level, keys) {
    this.moveX(step, level, keys);
    this.moveY(step, level, keys);

    const otherActor = level.actorAt(this);
    if (otherActor)
        level.playerTouched(otherActor.type, otherActor);

    // Losing animation
    if (level.status === "lost") {
        this.pos.y += step;
        this.size.y -= step;
    }
};


// LAVA
function Lava(pos, ch) {
    this.pos = pos;
    this.size = new Vector(1, 1);
    if (ch === "=") {
        this.speed = new Vector(2, 0);
    } else if (ch === "|") {
        this.speed = new Vector(0, 2);
    } else if (ch === "v") {
        this.speed = new Vector(0, 3);
        this.repeatPos = pos;
    }
}
Lava.prototype.type = "lava";

Lava.prototype.act = function(step, level) {
    const newPos = this.pos.plus(this.speed.times(step));
    if (!level.obstacleAt(newPos, this.size))
        this.pos = newPos;
    else if (this.repeatPos)
        this.pos = this.repeatPos;
    else
        this.speed = this.speed.times(-1);
};

// COIN
function Coin(pos) {
    this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
    this.size = new Vector(0.6, 0.6);
    this.wobble = Math.random() * Math.PI * 2;
}


Coin.prototype.act = function(step) {
    this.wobble += step * wobbleSpeed;
    const wobblePos = Math.sin(this.wobble) * wobbleDist;
    this.pos = this.basePos.plus(new Vector(0, wobblePos));
};

Coin.prototype.type = "coin";


// DOM DISPLAY
function DOMDisplay(parent, level) {
    this.wrap = parent.appendChild(elt("div", "game"));
    this.overlay = parent.appendChild(this.drawOverlay());

    this.level = level;

    this.wrap.appendChild(this.drawBackground());
    this.actorLayer = null;
    this.drawFrame();
}


DOMDisplay.prototype.drawOverlay = function() {
    const overlay = elt("div", "overlay");
    const text = overlay.appendChild(elt("div", "overlay-text"));
    text.textContent = "paused";
    return overlay;
};

DOMDisplay.prototype.drawBackground = function() {
    const table = elt("table", "background");
    table.style.width = this.level.width * SCALE + "px";
    this.level.grid.forEach(function(row) {
        const rowElt = table.appendChild(elt("tr"));
        rowElt.style.height = SCALE + "px";
        row.forEach(function(type) {
            rowElt.appendChild(elt("td", type));
        });
    });
    return table;
};

DOMDisplay.prototype.drawActors = function() {
    const wrap = elt("div");
    this.level.actors.forEach(function(actor) {
        const rect = wrap.appendChild(elt("div",
            "actor " + actor.type));
        rect.style.width = actor.size.x * SCALE + "px";
        rect.style.height = actor.size.y * SCALE + "px";
        rect.style.left = actor.pos.x * SCALE + "px";
        rect.style.top = actor.pos.y * SCALE + "px";
    });
    return wrap;
};

DOMDisplay.prototype.drawFrame = function() {
    if (this.actorLayer)
        this.wrap.removeChild(this.actorLayer);
    this.actorLayer = this.wrap.appendChild(this.drawActors());
    this.wrap.className = "game " + (this.level.status || "");
    this.scrollPlayerIntoView();
};

DOMDisplay.prototype.scrollPlayerIntoView = function() {
    const width = this.wrap.clientWidth;
    const height = this.wrap.clientHeight;
    const margin = width / 3;

    // The viewport
    const left = this.wrap.scrollLeft, right = left + width;
    const top = this.wrap.scrollTop, bottom = top + height;

    const player = this.level.player;
    const center = player.pos.plus(player.size.times(0.5))
        .times(SCALE);

    if (center.x < left + margin)
        this.wrap.scrollLeft = center.x - margin;
    else if (center.x > right - margin)
        this.wrap.scrollLeft = center.x + margin - width;
    if (center.y < top + margin)
        this.wrap.scrollTop = center.y - margin;
    else if (center.y > bottom - margin)
        this.wrap.scrollTop = center.y + margin - height;
};

DOMDisplay.prototype.clear = function() {
    this.wrap.parentNode.removeChild(document.querySelector('.overlay'));
    this.wrap.parentNode.removeChild(this.wrap);
};

function trackKeys(codes) {
    const pressed = Object.create(null);
    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {
            pressed[codes[event.keyCode]] = event.type === "keydown";
            event.preventDefault();
        }
    }

    pressed.toggleRegister = function(toggle) {
        toggle("keydown", handler);
        toggle("keyup", handler);
    };

    return pressed;
}

function runAnimation(frameFunc) {
    let lastTime = null;
    function frame(time) {
        let stop = false;
        if (lastTime !== null) {
            const timeStep = Math.min(time - lastTime, 100) / 1000;
            stop = frameFunc(timeStep) === false;
        }
        lastTime = time;
        if (!stop)
            requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

const arrows = trackKeys(arrowCodes);
arrows.toggleRegister(addEventListener);

function showPausedState(paused, overlay) {
    if (paused) {
        paused = false;
        arrows.toggleRegister(addEventListener);
        overlay.display = 'none';
    }
    else {
        paused = true;
        arrows.toggleRegister(removeEventListener);
        overlay.display = 'flex'
    }
    return paused;
}

function runLevel(level, Display, andThen) {
    const display = new Display(document.body, level);

    const coinsContainer = document.querySelector('.coins');
    coinsContainer.textContent = `${level.coins.toString()}/${level.totalCoins}`;


    let paused = false;
    document.body.addEventListener('keyup', event => {
        if (event.keyCode === 27) {
            paused = showPausedState(paused, display.overlay.style);

        }
    });

    runAnimation(function(step) {
        if (!paused) {
            level.animate(step, arrows);
        }
        display.drawFrame(step);
        if (level.isFinished()) {
            display.clear();
            if (andThen) {
                andThen(level.status);
            }
            return false;
        }
    });
}

function runGame(plans, Display) {
    let remainingLives = startingLives;
    const livesContainer = document.querySelector('.lives');

    function startLevel(level) {
        livesContainer.textContent = remainingLives.toString();

        runLevel(new Level(plans[level]), Display, function(status) {
            if (status === "lost") {
                if (remainingLives === 0) {
                    remainingLives = startingLives;
                    startLevel(0);
                } else {
                    remainingLives --;
                    startLevel(level);
                }
            }
            else if (level < plans.length - 1)
                startLevel(level + 1);
            else
                console.log("You win!");
        });
    }
    startLevel(0);
}

runGame(GAME_LEVELS, DOMDisplay);