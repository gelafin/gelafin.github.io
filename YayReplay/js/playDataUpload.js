/* papaparse imported using script tag */

function uploadPlayData(parsedObject){
  var container = document.getElementById('play-data-container');

  for (const row of parsedObject.data){
    let newDiv = document.createElement('div');
    newDiv.innerHTML = row;
    container.appendChild(newDiv);
  }
}

var results;

document.onload = Papa.parse('./assets/PlayAppData.csv', {
                    header: true,
                    download: true,
                    dynamicTyping: true,
                    complete: uploadPlayData(results)
                  });
