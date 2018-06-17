
function exerciseOne() {
  const code = document.getElementById('code');
  const button = document.getElementById('button');
  const output = document.getElementById('output');

  button.addEventListener('click', () => {
    try {
      output.innerText = `Return Value: ${new Function(code.value)().toString()}`;
    }
    catch(error) {
      output.innerText = error.name;
    }
  });
}
// exerciseOne();

function exerciseTwo() {
  const input = document.getElementById('field');

  // Dictionary
  let dictionary = [];
  for (let name in window) {
    dictionary.push(name);
  }

  function clearList() {
    const newContainer  = document.createElement('div');
    newContainer.id = 'suggestions';
    newContainer.style.cursor = 'pointer';
    document.body.replaceChild(newContainer, document.getElementById('suggestions'))
  }

  input.addEventListener('input', () => {
    //Remove old list container and replace it with an empty one
    clearList();

    //Store list of results
    let results = [];

    //If there is an input, iterate through the dictionary and match each entry against the input
    if (input.value) {
      const valueExp = new RegExp(`^${input.value}`);
      dictionary.forEach(entry => {
        if (valueExp.test(entry)) {
          results.push(entry);
        }
      });
    }

    //Append each result to the list container
    results.forEach(result => {
      const listItem = document.createElement('div');
      listItem.innerText = result;
      document.getElementById('suggestions').appendChild(listItem);

      //If a list item is clicked, set the input's value to that result and clear out the list container
      listItem.addEventListener('click', () => {
        input.value = result;
        clearList();
      })

    });
  })
}
// exerciseTwo();

function exerciseThree() {

  const World = {
    width: 5,
    height: 5,
    history: [],
    currentGeneration: 1,

    get lastGeneration() {
      return this.history[this.history.length - 1];
    }
  };

  class Cell {
    constructor(isAlive) {
      this.isAlive = isAlive;
      this.aliveNeighbors = [];
    }

    get shouldDie() {
      return this.isAlive && (this.aliveNeighbors.length < 2 || this.aliveNeighbors.length > 3);
    }

    get shouldResurrect() {
      return !this.isAlive && this.aliveNeighbors.length === 3;
    }
  }

  document.getElementById('next').addEventListener('click', () => {
    World.currentGeneration++;
    createGridArray();
  });

  //CREATES UI
  function createView(gridArray, disableInput = false) {
    const createNewGrid = () => {
      const gridContainer = document.createElement('div');
      gridContainer.id = 'grid';
      return gridContainer;
    };

    const createGridRow = () => {
      const gridRow = document.createElement('div');
      gridRow.className = 'grid-row';
      return gridRow;
    };

    const createCheckbox = status => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'checkbox';
      checkbox.checked = status;
      checkbox.disabled = disableInput;
      return checkbox;
    };

    document.getElementById('world').replaceChild(createNewGrid(), document.getElementById('grid'));

    for (let i = 0; i < World.height; i++) {
      const row = createGridRow();
      document.getElementById('grid').appendChild(row);
      for (let j = 0; j < World.width; j++) {
        const checkbox = createCheckbox(gridArray[i][j].isAlive);
        row.appendChild(checkbox);
        checkbox.addEventListener('change', () => {
          gridArray[i][j].isAlive = checkbox.checked;
        });
      }
    }
  }

  function createGenerationList() {
    const generationButton = () => {
      const genButton = document.createElement('div');
      genButton.className = 'gen-button';
      genButton.innerText = `Generation ${World.currentGeneration}`;
      genButton.setAttribute('data-test', World.currentGeneration.toString());
      return genButton;
    };

    const genButton = generationButton();

    genButton.addEventListener('click', event => {
      const associatedGeneration = parseInt(event.target.getAttribute('data-test'), 10);
      createView(World.history[associatedGeneration - 1], associatedGeneration !== World.history.length);

    });

    document.getElementById('generations').appendChild(genButton);
  }

  //BACKING DATA STRUCTURE
  function createGridArray() {
    const previousGrid = World.lastGeneration;
    if (previousGrid) processCellSurroundings(previousGrid);
    const gridArray = new Array(World.height);

    for (let i = 0; i < World.height; i++) {
      const newGridRow = new Array(World.width);
      for (let j = 0; j < World.width; j++) {
        if (previousGrid) {
          if (previousGrid[i][j].shouldDie) {
            newGridRow[j] = new Cell(false);
          }
          else if (previousGrid[i][j].shouldResurrect) {
            newGridRow[j] = new Cell(true);
          }
          else {
            newGridRow[j] = new Cell(previousGrid[i][j].isAlive);
          }
        } else {
          newGridRow[j] = new Cell(Math.ceil(Math.random() * 2 - 1) + 1 === 1);
        }
      }
      gridArray[i] = newGridRow;
    }
    World.history.push(gridArray);
    createView(World.lastGeneration);
    createGenerationList();
  }

  //GATHERS ALL LIVE NEIGHBORS AROUND EACH CELL
  function processCellSurroundings(gridArray) {
    const checkSurroundings = (gridArray, i, j, width) => {
      const topCell = gridArray[i - 1] ? gridArray[i - 1][j] : {};
      const topRightCell = gridArray[i - 1] && j < width - 1 ? gridArray[i - 1][j + 1] : {};
      const rightCell = j < width - 1 ? gridArray[i][j + 1] :  {};
      const bottomRightCell = gridArray[i + 1] && j < width - 1 ? gridArray[i + 1][j + 1] : {};
      const bottomCell = gridArray[i + 1] ? gridArray[i + 1][j] : {};
      const bottomLeftCell = gridArray[i + 1] && j > 0 ? gridArray[i + 1][j - 1] : {};
      const leftCell = j > 0 ? gridArray[i][j - 1] : {};
      const topLeftCell = gridArray[i - 1] && j > 0 ? gridArray[i - 1][j - 1] : {};
      return [topCell, topRightCell, rightCell, bottomRightCell, bottomCell, bottomLeftCell, leftCell, topLeftCell].filter(cell => cell.isAlive);
    };

    for (let i = 0; i < World.height; i++) {
      for (let j = 0; j < World.width; j++) {
        gridArray[i][j].aliveNeighbors = checkSurroundings(gridArray, i, j, World.width);
      }
    }
  }

  createGridArray()
}

exerciseThree();
