// PROBLEM 1
function sum(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  return sum;
}


function span(min, max, increment = 1) {
  let array = [];
  for (let i = min; i <= max; i += increment) {
    array.push(i);
  }
  return array;
}

// console.log(sum(span(1, 10)));


// PROBLEM 2
function reverseArray(array) {
  let reversedArray = [];
  for (let i = 0; i < array.length; i++) {
    reversedArray.unshift(array[i]);
  }
  return reversedArray;
}


function reverseArrayInPlace(array) {
  for (let i = 0; i < array.length / 2; i++) {
    let lastIndex = array.length - 1 - i;
    let firstItem = array[i];
    let lastItem = array[lastIndex];
    array[lastIndex] = firstItem;
    array[i] = lastItem;
  }
  return array;
}


const myArray = [1, 2, 3, 4, 5, 6, 7];

// console.log(reverseArray(myArray));
// console.log(reverseArrayInPlace(myArray));


//PROBLEM 3

const list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: {
        value: 4,
        rest: {
          value: 5,
          rest: null,
        }
      }
    }
  }
};


function arrayToList(array) {
  let list = { value: array.length, rest: null };
  for (let i = array.length - 1; i > 0; i--) {
    list = { value: i, rest: list };
  }
  return list
}


// console.log(arrayToList([1, 2, 3]));


function listToArray(list) {
  let array = [];
  const loopThroughList = (list) => {
    array.push(list.value);
    if (list.rest) {
      return loopThroughList(list.rest);
    }
  };

  loopThroughList(list);
  return array;
}


// console.log(listToArray({ value: 1, rest: { value: 2, rest: { value: 3, rest: null }}}));


function prepend(element, list) {
  return { value: element, rest: list };
}


// console.log(prepend(0, list));


function nth(list, number) {
  let counter = number;
  const loopThroughList = (list) => {
    counter --;
    return !counter ? list : loopThroughList(list.rest);
  };
  return loopThroughList(list);
}


// console.log(nth(list, 3));



//PROBLEM 4
const screen = null;

const number1 = 23;
const number2 = 23;

const string1 = "Vladic";
const string2 = "Kostin";

const array1 = [1, 2, ['a', true], 3, { name: 'Kostin', age: 29 }, 4, [1, 2, ['Vladic']]];
const array2 = [1, 2, ['a', true], 3, { name: 'Kostin', age: 29 }, 4, [1, 2, ['Vladic']]];

const function1 = function() { return 'Hello World' };
const function2 = function() { return 'Hello World' };


const car1 = {
  type:"Honda",
  owner: {
    name: "Vladic Kostin",
    gender: "Male",
    age: 29
  },
  model:"Accord",
  color:"grey",
  previousOwners: ['Bob', 'Sally'],
  year: 2012,
};
const car2 = {
  type:"Honda",
  owner: {
    name: "Vladic Kostin",
    gender: "Male",
    age: 29,
  },
  model:"Accord",
  color:"grey",
  previousOwners: ['Bob', 'Sally'],
  year: 2012,
};


function deepEquals(value1, value2) {
  let isItEqual = true;

  function valueAnalysis(value1, value2) {
    if (value1 === null || value2 === null) isItEqual = false;
    if (!isItEqual) return;

    // Checks length of objects and arrays, before looping through them
    const objectLength = (object1, object2) => Object.keys(object1).length === Object.keys(object2).length;
    const arrayLength = (array1, array2) => array1.length === array2.length;

    const Compare = {
      objects: (object1, object2) => {
        for (let prop in object1) {
          if(!object1.hasOwnProperty(prop)) continue;
          if (prop in object2) {
            valueAnalysis(object1[prop], object2[prop]);
          }
          else {
            return false;
          }
        }
      },
      arrays: (array1, array2) => {
        for (let i = 0; i < array1.length; i++) {
          valueAnalysis(array1[i], array2[i]);
        }
      },
      functions: (function1, function2) => function1.toString() === function2.toString(),
      values: (value1, value2) => value1 === value2 ? true : isItEqual = false,
    };

    function determineType(value1, value2) {
      if ((typeof value1 === 'object' && !Array.isArray(value1)) && (typeof value2 === 'object' && !Array.isArray(value2)) && objectLength(value1, value2)) return 'objects';
      else if (Array.isArray(value1) && Array.isArray(value2) && arrayLength(value1, value2)) return 'arrays';
      else if ((typeof value1 === 'function') && (typeof value2 === 'function')) return 'functions';
      else return 'values';
    }

    return Compare[determineType(value1, value2)](value1, value2);
  }
  valueAnalysis(value1, value2);

  return isItEqual;
}

console.log(deepEquals(array1, array2)); //true
// console.log(deepEquals(screen, car2)); //false
// console.log(deepEquals(number1, number2)); //true
// console.log(deepEquals(string1, string2)); //false
// console.log(deepEquals(array1, array2)); //true
console.log(deepEquals(car1, car2)); //true
// console.log(deepEquals(function1, function2)); //true



