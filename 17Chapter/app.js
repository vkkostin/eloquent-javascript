
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
// get('http://eloquentjavascript.net/author', 'text/html');
// get('http://eloquentjavascript.net/author', 'application/json');
get('http://eloquentjavascript.net/author', 'application/rainbows+unicorns').then(succeed, fail);
