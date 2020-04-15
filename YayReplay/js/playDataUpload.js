/* papaparse imported using script tag */

function uploadPlayData(parsedObject){
  var container = document.getElementById('play-data-container');

  for (const gameRow of parsedObject.data){
    let newRowDiv = document.createElement('div'); // create element with flex-flow: row nowrap using .className assignment
    newRowDiv.className = 'flexbox-container game-row';
    container.appendChild(newRowDiv); // new empty div to keep children in a row

    for (column of parsedObject.meta.fields){
      let newColumnDiv = document.createElement('div'); // row of children
      newColumnDiv.innerHTML = gameRow[column];
      newRowDiv.appendChild(newColumnDiv);
    }
  }
}

document.onload = Papa.parse('./assets/PlayAppData.csv', {
                    header: true,
                    download: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: uploadPlayData
                  });
