class Collection {
  constructor(collection) {
    this.collection = collection;
  }

  forEvery(test) {
    for (let i = 0; i < this.collection.length; i++) {
      test(this.collection[i], i, this.collection);
    }
  }
}

const myArray = new Collection([1, 2, 3, 4, 5]);


// myArray.forEvery(console.log);



Collection.prototype.forEvery.call(new Collection([1, 2]), console.log);