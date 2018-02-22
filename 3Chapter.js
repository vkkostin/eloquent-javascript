// PROBLEM 1 & PROBLEM 2

const Math = {
  min: (num1, num2) => num1 - num2 < 0 ? num1 : num2,
  max: (num1, num2) => num1 - num2 < 0 ? num2 : num1,
  absoluteValue: number => number < 0 ? -number : number,
  subtractionLoop: number => number > 1 ? Math.subtractionLoop(number - 2) : number,
  isEven: number => Math.subtractionLoop(Math.absoluteValue(number)) === 0,
  isOdd: number => Math.subtractionLoop(Math.absoluteValue(number)) === 1
};

// // LOGS PROBLEM 1
// console.log(Math.min(12, 50)); // 12
// console.log(Math.min(-7, 3)); // -7
// console.log(Math.min(-24, -76)); // -76
//
// console.log(Math.max(12, 50)); // 50
// console.log(Math.max(-7, 3)); // 3
// console.log(Math.max(-24, -76)); // -24
//
// // LOGS PROBLEM 2
// console.log(10, Math.isEven(10)); // true
// console.log(59, Math.isEven(59)); // false
// console.log(1, Math.isEven(1)); // false
// console.log(-4, Math.isEven(-4)); // true
// console.log(0, Math.isEven(0)); // true
// console.log(-17, Math.isEven(-17)); // false
//
// console.log(10, Math.isOdd(10)); // false
// console.log(59, Math.isOdd(59)); // true
// console.log(1, Math.isOdd(1)); // true
// console.log(-4, Math.isOdd(-4)); // false
// console.log(0, Math.isOdd(0)); // false
// console.log(-17, Math.isOdd(-17)); // true

// PROBLEM 3

// USING LOOP
function findCharacterLoop(string, character) {
  let count = 0;
  for (let i = 0; i < string.length; i++) {
    if (string.charAt(i) === character) count ++;
  }
  return count;
}

// const myFullName = "Vladic Kostin";
// const character = "i";
//
// console.log(findCharacterLoop(myFullName, character));


// USING RECURSION
function findCharacterRecursion(string, character) {
  let count = 0;
  function recursion(string, character, i) {
    if (string.charAt(i) === character) count++;
    return string.length === i ? count : recursion(string, character, i + 1);
  }
  return recursion(string, character, 0);
}


const myFullName = "Vladic Kostin";
const character = "i";

console.log(findCharacterRecursion(myFullName, character));


