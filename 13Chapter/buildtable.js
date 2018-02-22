function buildTable(data) {
    const create = element => document.createElement(element);
    const createRow = () => table.appendChild(create('tr'));

    const table = create('table');
    const headers = Object.keys(data[0]);

    // Create the header row
    const headerRow = createRow();
    headers.forEach(header => headerRow.appendChild(create('th')).appendChild(document.createTextNode(header)));

    // Create a row for each element
    data.forEach(element => {
        const tableRow = createRow();
        headers.forEach((_, i) => tableRow.appendChild(create('td')).appendChild(document.createTextNode(element[headers[i]])));
    });

    return table;
}

const MOUNTAINS = [
    {name: "Kilimanjaro", height: 5895, country: "Tanzania"},
    {name: "Everest", height: 8848, country: "Nepal"},
    {name: "Mount Fuji", height: 3776, country: "Japan"},
    {name: "Mont Blanc", height: 4808, country: "Italy/France"},
    {name: "Vaalserberg", height: 323, country: "Netherlands"},
    {name: "Denali", height: 6168, country: "United States"},
    {name: "Popocatepetl", height: 5465, country: "Mexico"}
];


document.body.appendChild(buildTable(MOUNTAINS));
