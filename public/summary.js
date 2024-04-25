let idToNameMap = new Map();
let balancesMap = new Map();
fetch('name.json')
    .then(response => {
        return response.json();
    })
    .then(data1 => {
        idToNameMap = new Map(data1.map(entry => [entry.id, entry.name]));
        // console.log('Map:', idToNameMap);
        balanceinit();
    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
    });
var currentPage = window.location.pathname.split("/").pop();
n = currentPage.split(".")[0];
getEvent(n);
getSummary(n);



function getEvent(n) {
    let filename = n + '.json'
    fetch(filename)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return printEvent(data, n)
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}
function printEvent(data, n) {
    var events = document.getElementById("events");
    var html = "<ul>";
    data.forEach(function (item) {
        itemId = item.id;
        html += "<li>EventName: " + item.eventName + ", Amount: " + item.amount + ", Payer: " + idToNameMap.get(parseInt(item.payer))
            + "<button type='button' onclick='deleteItem(\"" + n + "\"," + itemId + ")'>删除</button>" + "</li>";
    });
    html += "</ul>";
    events.innerHTML = html;
}
function deleteItem(n, id) {
    let filename = n + '.json'
    fetch(filename)
        .then(response => {
            return response.json();
        })
        .then(data => {
            var index = data.findIndex(function (event) {
                return event.id === id;
            });
            data.splice(index, 1);
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('X-Name', n);
            fetch('/save-personal', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data) // directly pass the object here
            })
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
        window.location.href='/'+n+'.html';
}
function balanceinit() {
    balancesMap = new Map();
    idToNameMap.forEach((value, key) => {
        balancesMap.set(key, 0);
    });
}

function getSummary(n) {
    let filename = n + '.json'
    fetch(filename)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return printSummary(data, n)
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}

function printSummary(data, n) {
    var summaries = document.getElementById("summary");
    data.forEach(function (item) {
        const amount = parseFloat(item.amount);
        const payer = parseInt(item.payer);
        var currentBalance = balancesMap.get(payer);
        currentBalance = currentBalance + amount;
        balancesMap.set(payer, currentBalance);
    });
    const table = document.createElement('table');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>Name</th><th>Balance</th>';
    table.appendChild(headerRow);
    balancesMap.forEach((value, key) => {
        const row = document.createElement('tr');
        let translateName = idToNameMap.get(key)
        row.innerHTML = `<td>${translateName}</td><td>${value}</td>`;
        table.appendChild(row);
    });
    summaries.appendChild(table);
}