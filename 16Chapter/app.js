let first = document.getElementById("first").getContext("2d");
let second = document.getElementById("second").getContext("2d");
let third = document.getElementById("third").getContext("2d");


// EXERCISE ONE

// function spiral() {
//     first.save();
//
//     let counter = 0;
//
//     function start(angle) {
//         first.fillRect(0, 0, 1, 3);
//         if (counter === 100) return;
//         first.save();
//         first.translate(0, 3);
//
//         first.rotate(angle);
//
//         counter ++;
//
//
//         start(angle * 0.985);
//
//         first.restore();
//
//     }
//
//     first.translate(350, 50);
//     start(0.4);
//     first.restore();
// }
// TODO: spiral();


function star(points) {
  const half = points / 2;
  first.beginPath();
  first.moveTo(450 + (50 * Math.cos(0 / half * Math.PI)), 50 + (50 * Math.sin(0 / half * Math.PI)));
  for (let i = 1; i <= points; i++) {
      first.quadraticCurveTo(450, 50, 450 + (50 * Math.cos(i / half * Math.PI)), 50 + (50 * Math.sin(i / half * Math.PI)));

  }
  first.fillStyle = "orange";
  first.fill();
}
star(8);



function trapezoid(startX, startY, height, top, bottom) {
  const spread = (bottom - top) / 2;
  first.beginPath();
  first.moveTo(startX, startY);
  first.lineTo(startX - spread , startY + height);
  first.lineTo(startX - spread + bottom , startY + height);
  first.lineTo(startX + top, startY);
  first.closePath();
  first.stroke();
}
trapezoid(25, 20, 60, 50, 100);


function diamond(diagonal, startX, startY) {
  first.beginPath();
  const radius = diagonal / 2;
  first.moveTo(startX, startY);
  first.lineTo(startX - radius, startY + radius);
  first.lineTo(startX, startY + diagonal);
  first.lineTo(startX + radius, startY + radius);
  first.fillStyle = 'red';
  first.fill();
}
diamond(80, 150, 10);


function zigZag() {
  first.beginPath();

  for (let i = 10; i < 80; i += 10) {
      first.moveTo(210, i);
      first.lineTo(290, i + 5);
  }

  for (let i = 15; i < 80; i += 10) {
      first.moveTo(290, i);
      first.lineTo(210, i + 5);
  }

  first.stroke();
}
zigZag();




// EXERCISE TWO
const results = [
  {name: "Satisfied", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Unsatisfied", count: 510, color: "pink"},
  {name: "No comment", count: 175, color: "silver"},
];

function secondExercise() {
  let total = results.reduce((sum, {count}) => sum + count, 0);
  let currentAngle = -0.5 * Math.PI;
  let centerX = 300, centerY = 150;

// Add code to draw the slice labels in this loop.
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    let textAngle = (sliceAngle / 2) + currentAngle;

    second.beginPath();
    second.arc(centerX, centerY, 100, currentAngle, currentAngle + sliceAngle);

    currentAngle += sliceAngle;
    second.lineTo(centerX, centerY);
    second.fillStyle = result.color;
    second.font ='16px Georgia';
    second.fill();

    //7 is random, whatever looks good
    let wordLength = result.name.length * 7;
    const alignText = offset => second.fillText(result.name, (300 - offset) + (115 * Math.cos(textAngle)), 150 + (115 * Math.sin(textAngle)));

    //if the text should start on the left side of the pie chart, offset the word length along the x-axis
    if (textAngle > (Math.PI / 2)) {
      alignText(wordLength);
    }
    else {
      alignText(0);
    }
  }
}
secondExercise();


// EXERCISE THREE

function thirdExercise() {
  const getRandomSlope = () => Math.ceil(Math.random() * 3 - 1) + 1;

  const checkWall = (x, y) => {
    if (x.hitWall) {
      x.flipDirection();
    }
    if (y.hitWall) {
      y.flipDirection();
    }
  };

  const updateAnimation = (step, circle) => {
    third.clearRect(0, 0, 400, 400);
    third.beginPath();
    third.arc(circle.x.center, circle.y.center, circle.radius, 0, 7);
    third.fillStyle = circle.color;
    third.fill();
  };

  class Circle {
    constructor(color, radius, x, y) {
      this.color = color;
      this.radius = radius;
      this.x = x;
      this.y = y;
    }
  }

  class Point {
    constructor(center, slope, radius) {
      this.center = center;
      this.slope = slope;
      this.radius = radius
    }

    setNewCenter() {
      this.center = this.center + this.slope;
    }

    get hitLowerLimit() {
      return this.center < this.radius;
    }

    get hitUpperLimit() {
      return this.center > 400 - this.radius;
    }

    get hitWall() {
      return this.hitLowerLimit || this.hitUpperLimit;
    }

    flipDirection() {
      if (this.hitLowerLimit) {
        this.slope = 1 * getRandomSlope();
      }
      if (this.hitUpperLimit) {
        this.slope = -1 * getRandomSlope();
      }
    }
  }

  function constructCircle(color, radius) {
    const xPoint = new Point(30, 1, radius);
    const yPoint = new Point(200, 1, radius);
    return new Circle(color, radius, xPoint, yPoint);
  }

  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      updateAnimation(Math.min(100, time - lastTime) / 1000, circle);
    }
    lastTime = time;

    checkWall(circle.x, circle.y);
    circle.x.setNewCenter();
    circle.y.setNewCenter();

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  const circle = constructCircle('blue', 30);

}

thirdExercise();

















