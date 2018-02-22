// Problem 1
function hashSteps(num) {
  for (let line = '#'; line.length <= num; line += '#') {
    console.log(line);
  }
}

// hashSteps(10);

// Problem 2
function fizzBuzz(upperLimit) {
  for (let number = 1; number <= upperLimit; number++) {
    let output = '';
    if (number % 3 === 0) {
      output += 'Fizz';
    }
    if (number % 5 === 0) {
      output += 'Buzz';
    }
    console.log(output || number);
  }
}

// fizzBuzz(20);

// Problem 3
function checkerboard(num) {
  for (let y = 1; y <= num; y++) {
    let output = '';
    for (let x = 1; x <= num; x++) {
      if ((x + y) % 2 === 0) {
        output += ' '
      }
      else {
        output += '#';
      }
    }
    console.log(output);
  }
}

// checkerboard(8);