// PROBLEM 1

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  plus(vector) {
    return [this.x + vector.x, this.y + vector.y];
  }
  
  minus(vector) {
    return [this.x - vector.x, this.y - vector.y];
  }

  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}


const a = new Vector(-3, 4);
const b = new Vector(2, 4);


// console.log(a.plus(b));
// console.log(a.minus(b));
// console.log(a.length);

// PROBLEM 2
const MOUNTAINS = [
  {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
  {name: "Everest", height: 8848, country: "Nepal"},
  {name: "Mount Fuji", height: 3776, country: "Japan"},
  {name: "Mont Blanc", height: 4808, country: "Italy/France"},
  {name: "Vaalserberg", height: 323, country: "Netherlands"},
  {name: "Denali", height: 6168, country: "United States"},
  {name: "Popocatepetl", height: 5465, country: "Mexico"}
];


const rowHeights = rows => rows.map(row => row.reduce((max, cell) => Math.max(max, cell.minHeight()), 0));

const colWidths = rows => rows[0].map((_, i) => rows.reduce((max, row) => Math.max(max, row[i].minWidth()), 0));

const repeat = (string, times) => {
  let result = '';
  for (let i = 0; i < times; i++) {
    result += string;
  }
  return result;
};

function drawTable(rows) {
  const heights = rowHeights(rows);
  const widths = colWidths(rows);
  const drawLine = (blocks, lineNo) => blocks.map(block => block[lineNo]).join(' ');
  const drawRow = (row, rowNum) => {
    const blocks = row.map((cell, colNum) => cell.draw(widths[colNum], heights[rowNum]));
    return blocks[0].map((_, lineNo) => drawLine(blocks, lineNo)).join('\n');
  };
  return rows.map(drawRow).join("\n");
}


function TextCell(text) {
  this.text = text.split("\n");
}
TextCell.prototype.minWidth = function() {
  return this.text.reduce(function(width, line) {
    return Math.max(width, line.length);
  }, 0);
};
TextCell.prototype.minHeight = function() {
  return this.text.length;
};
TextCell.prototype.draw = function(width, height) {
  let result = [];
  for (let i = 0; i < height; i++) {
    let line = this.text[i] || "";
    result.push(line + repeat(" ", width - line.length));
  }
  return result;
};


function UnderlinedCell(inner) {
  this.inner = inner;
}
UnderlinedCell.prototype.minWidth = function() {
  return this.inner.minWidth();
};
UnderlinedCell.prototype.minHeight = function() {
  return this.inner.minHeight() + 1;
};
UnderlinedCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height - 1).concat([repeat("-", width)]);
};


function StretchCell(inner, height, width) {
  this.inner = inner;
  this.height = height;
  this.width = width;
}

StretchCell.prototype.minWidth = function() {
  return this.inner.minWidth() + this.width;
};

StretchCell.prototype.minHeight = function() {
  return this.inner.minHeight() + this.height;
};

StretchCell.prototype.draw = function(width, height) {
  return this.inner.draw(width, height);
};


function dataTable(data) {
  const keys = Object.keys(data[0]);
  // const headers = keys.map(name => new StretchCell(new TextCell(name), 2, 2));
  const headers = keys.map(name => new UnderlinedCell(new TextCell(name)));
  const body = data.map(row => keys.map(name => new TextCell(String(row[name]))));
  return [headers].concat(body);
}


// console.log(drawTable(dataTable(MOUNTAINS)));


// PROBLEM 4
function ArraySeq(array) {
  this.pos = -1;
  this.array = array;
}

ArraySeq.prototype.current = function() {
  return this.array[this.pos];
};


ArraySeq.prototype.next = function() {
  if (this.pos > this.array.length - 1) {
    return false;
  }
  this.pos ++;
  return true;
};

function logFive(objectIterable) {
  for (let i = 0; i < 5; i ++) {
    if (!objectIterable.next()) {
      break;
    }
    console.log(objectIterable.current());
  }
}

function RangeSeq(from, to) {
  this.pos = from - 1;
  this.to = to;
}
RangeSeq.prototype.next = function() {
  if (this.pos >= this.to)
    return false;
  this.pos++;
  return true;
};
RangeSeq.prototype.current = function() {
  return this.pos;
};


logFive(new ArraySeq([1, 2, 4, 5, 6, 7]));

logFive(new RangeSeq(100, 1000));


// logFive(new ArraySeq([1, 2]));
// → 1
// → 2
// logFive(new RangeSeq(100, 1000));
// → 100
// → 101
// → 102
// → 103
// → 104
