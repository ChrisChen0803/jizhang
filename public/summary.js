let idToNameMap = new Map();
let balancesMap = new Map();
var fetchPromises = [];
var currentPage = window.location.pathname.split("/").pop();
n = currentPage.split(".")[0];
fetch('name.json')
    .then(response => {
        return response.json();
    })
    .then(data1 => {
        idToNameMap = new Map(data1.map(entry => [entry.id, entry.name]));
        // console.log('Map:', idToNameMap);
        balanceinit();
    })
    .then(d => {
        getEvent(n);
        getSummary(n);
    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
    });
document.addEventListener("DOMContentLoaded", function () {
    const backButton = document.getElementById("backToMainButton");

    backButton.addEventListener("click", function () {

        window.location.href = "/index.html";
    });
});


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
function getKeyByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
        if (value == searchValue) {
            return key;
        }
    }
    return null; // Return null if the value is not found
}
function printEvent(data, n) {
    var events = document.getElementById("events");
    var html = "<ul>";
    data.forEach(function (item) {
        itemId = item.id;
        html += "<li>活动名称: " + item.eventName + ", 金额: " + item.amount + ", 付款人: " + idToNameMap.get(parseInt(item.payer))
            + "<button type='button' class='delete' onclick='deleteItem(\"" + n + "\"," + itemId + ")'>删除</button>" + "</li>";
    });
    html += "</ul>";
    events.innerHTML = html;
}
function resetBlc(data, p1, id) {
    data = data.filter(function (item) {
        return item.payer != id;
    });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-Name', p1);
    fetch('/save-personal', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data) // directly pass the object here
    })
    window.location.href = '/' + n + '.html';

}
function reset(id1, id2) {
    let person1 = idToNameMap.get(id1);
    let person2 = idToNameMap.get(id2);
    let filename1 = person1 + '.json';
    let filename2 = person2 + '.json';
    fetch(filename1)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return resetBlc(data, person1, id2);
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
    fetch(filename2)
        .then(response => {
            return response.json();
        })
        .then(data => {
            return resetBlc(data, person2, id1);
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
}
function deleteItem(n, id) {
    let filename = n + '.json'
    fetch(filename)
        .then(response => {
            return response.json();
        })
        .then(data => {
            var index = data.findIndex(function (event) {
                return event.id == id;
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
        }).then(d=>{
            window.location.href = '/' + n + '.html';
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
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
function paySummary(data, n) {
    let amount = 0;
    console.log(data)
    data.forEach(function (singleEvent) {
        let payer = idToNameMap.get(parseInt(singleEvent.payer));
        if (payer == n) {
            amount += singleEvent.amount;
        }
    })
    return amount;
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

    // Iterate through idToNameMap
    idToNameMap.forEach((value, key) => {
        let fname = value + '.json';
        // Push each fetch promise into fetchPromises array
        fetchPromises.push(
            fetch(fname)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    let getAmount = paySummary(data, n);
                    var currentBalance = balancesMap.get(key);
                    currentBalance = currentBalance - getAmount;
                    balancesMap.set(key, currentBalance);
                })
                .catch(error => {
                    console.error('Error loading JSON file:', error);
                })
        );
    });

    // Wait for all fetch promises to resolve
    Promise.all(fetchPromises).then(() => {
        // After all fetches are done, create the table
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = '<th>姓名</th><th>需还金额</th>';
        table.appendChild(headerRow);
        balancesMap.forEach((value, key) => {
            const row = document.createElement('tr');
            let translateName = idToNameMap.get(key);
            let number = getKeyByValue(idToNameMap, n);
            let s = "<button type='button' class='reset' onclick='reset(" + number + "," + key + ")'>清零</button>";
            row.innerHTML = `<td>${translateName}</td><td>${value}</td>` + s;
            table.appendChild(row);
        });
        summaries.appendChild(table);
    });

    console.log(balancesMap);
}