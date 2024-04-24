let idToNameMap = new Map();
function writePersonalEvents(data) {
    let balance = parseFloat(data.amount);
    let payer = data.payer;
    let participants = data.participants;
    balance = balance / (participants.length);
    fetch('name.json')
        .then(response => {
            return response.json();
        })
        .then(data1 => {
            idToNameMap = new Map(data1.map(entry => [entry.id, entry.name]));
        })
        .catch(error => {
            console.error('Error loading JSON file:', error);
        });
    participants.forEach(p => {
        let n = idToNameMap.get(parseInt(p))
        console.log(n)
        if (p != payer) {
            var newid = new Date().valueOf().toString();
            formData = {
                "id": newid,
                "eventName": data.eventName,
                "amount": data.amount/data.participants.length,
                "payer": payer
            }
            fetch('/add-personal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Name':n
                },
                body: JSON.stringify(formData)
            })
        }
    });
}
fetch('name.json')
    .then(response => response.json())
    .then(data => {
        idToNameMap = new Map(data.map(entry => [entry.id, entry.name]));
        const payerSelect = document.getElementById('payer');
        const participants = document.getElementById('participantsList');
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            payerSelect.appendChild(option);
            const li = document.createElement('li');
            const label = document.createElement('label');
            label.setAttribute('for', item.id);
            label.textContent = item.name;
            const input = document.createElement('input');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', item.id);
            input.setAttribute('name', participants);
            input.setAttribute('value', item.id);
            li.appendChild(label);
            li.appendChild(input);
            participants.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error loading JSON file:', error);
    });

function submitForm(event) {
    event.preventDefault();
    var eventName = document.getElementById('eventName').value;
    var amount = document.getElementById('amount').value;
    var payer = document.getElementById('payer').value;
    var participants = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        console.log(checkbox)
        if (checkbox.checked) {
            participants.push(checkbox.value);
        }
    });
    var note = document.getElementById('note').value;
    var newid = new Date().valueOf().toString();

    // Construct form data object
    var formData = {
        "id": newid,
        "eventName": eventName,
        "amount": amount,
        "payer": payer,
        "participants": participants,
        "note": note
    }
    fetch('/save-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) // directly pass the object here
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            else {
                writePersonalEvents(formData);
            }
            return response.text();
        })
        .then(responseText => {
            // Redirect after fetch is successful
            window.location.href = '/index.html';
        })
}