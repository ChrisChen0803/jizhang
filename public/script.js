let idToNameMap = new Map();
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('addButton').addEventListener('click', function () {
    // Redirect to another webpage
    window.location.href = '/addNewEvent.html';
  });
});
function getAll(inds) {
  return inds.map(ind => idToNameMap.get(parseInt(ind))).join(' ');
}
function printNamesAndIds(data) {
  var allEventDiv = document.getElementById("allEvent");
  var html = "<ul>";

  data.forEach(function (item) {
    html += "<li>活动名称: " + item.eventName + ", 金额: " + item.amount + ", 付款人: " + idToNameMap.get(parseInt(item.payer))
      + ", 参与成员: " + getAll(item.participants) + "<button type='button' class='delete' onclick='deleteItem(" + item.id + ")'>删除</button>" + "</li>";
  });
  html += "</ul>";
  allEventDiv.innerHTML = html;
}

fetch('name.json')
  .then(response => {
    return response.json();
  })
  .then(data1 => {
    idToNameMap = new Map(data1.map(entry => [entry.id, entry.name]));
    addButtons();
  })
  .catch(error => {
    console.error('Error loading JSON file:', error);
  });

// Load JSON data from name.json file
fetch('events.json')
  .then(response => response.json())
  .then(data => printNamesAndIds(data))
  .catch(error => console.error('Error loading JSON file:', error));


function addButtons() {
  var pbuttonsDiv = document.getElementById("personalbuttons");
  idToNameMap.forEach((value, key) => {
    var button = document.createElement("button");
    button.textContent = value;
    button.onclick = function(){
      window.location.href = '/' + value + '.html'
    }
    var span = document.createElement("span");
    pbuttonsDiv.appendChild(span);
    pbuttonsDiv.appendChild(button);
    pbuttonsDiv.appendChild(document.createElement("br"));
  });
}

function deleteItem(id) {
  fetch('events.json')
      .then(response => {
          return response.json();
      })
      .then(data => {
          var index = data.findIndex(function (event) {
              return event.id === id;
          });
          data.splice(index, 1);
          console.log(data);
          const headers = new Headers();
          headers.append('Content-Type', 'application/json');
          fetch('/update-event', {
              method: 'POST',
              headers: headers,
              body: JSON.stringify(data) // directly pass the object here
          })
      })
      .catch(error => {
          console.error('Error loading JSON file:', error);
      });
      window.location.href='/index.html';
}
