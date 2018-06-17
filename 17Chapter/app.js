//Exercise One
function get(url, type) {

  function request(succeed, fail) {
    const req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Accept', type);
  req.addEventListener('load', () => {
      if (req.status < 400) {
          succeed(req.responseText);
      } else {
          fail(req.statusText);
      }
    });
    req.send(null);
  }

  return new Promise(request);
}


function succeed(response) {
  const paragraph = document.createElement('p');
  paragraph.textContent = response;
  document.body.appendChild(paragraph);
}

function fail(status) {
  const paragraph = document.createElement('p');
  paragraph.textContent = `Ooops, something went wrong: ${status}`;
  paragraph.style.color = 'red';
  document.body.appendChild(paragraph);
  return new Error(`Request Failed: ${status}`)
}


get('http://eloquentjavascript.net/author', 'text/plain').then(succeed, fail);
get('http://eloquentjavascript.net/author', 'text/html');
get('http://eloquentjavascript.net/author', 'application/json');
get('http://eloquentjavascript.net/author', 'application/rainbows+unicorns').then(succeed, fail);



// Exercise Two
function all(promises) {

  return new Promise(function(resolve, reject) {

    let counter = promises.length;
    let successArray = [];

    if (promises.length === 0) resolve([]);

    promises.forEach((promise, index) => {
      promise.then(
        success => {
          successArray[index] = success;
          counter--;
          if (counter === 0) resolve(successArray)
        },
        fail => {
          reject(fail);
        }
      );
    });

  });
}

function soon(val) {
  return new Promise(resolve => { setTimeout(() => { resolve(val) }, Math.random() * 500) })
}

function fail() {
  return new Promise((resolve, reject) => { reject(new Error("boom")) })
}

all([]).then(array => {
  console.log("This should be []:", array);
});

all([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});

all([soon(1), fail(), soon(3)]).then(
  array => {
    console.log("We should not get here", array);
  },
  error => {
    if (error.message !== "boom") {
      console.log("Unexpected failure:", error);
    } else {
      console.log(error);
    }
  });
