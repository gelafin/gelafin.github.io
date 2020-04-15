/* papaparse imported using script tag */

function createRowDivInside(containerClass){
  var container = document.getElementById(containerClass);
  let newRowDiv = document.createElement('div'); // create element with flex-flow: row nowrap using .className assignment
  newRowDiv.className = 'flexbox-container game-row';
  container.appendChild(newRowDiv); // new empty div to keep children in a row
  return newRowDiv;
}

function printHeaders(parsedObject){
  var newRowDiv = createRowDivInside('play-data-container');

  for (const column of parsedObject.meta.fields){
    if (column === 'id') {
      continue; // don't print id
    } else {
        let newColumnDiv = document.createElement('div'); // TODO: columns should be accessible to screen readers, so maybe h3 or something
        newColumnDiv.innerHTML = column;
        newColumnDiv.className = 'game-column';
        newRowDiv.appendChild(newColumnDiv);
    }
  }
}

function uploadPlayData(parsedObject){
  for (const gameRow of parsedObject.data){
    let newRowDiv = createRowDivInside('play-data-container');

    for (const column of parsedObject.meta.fields){
      if (column === 'id') {
        continue; // don't print id
      } else if (column === 'link') {
          let newColumnDiv = document.createElement('a');
          newColumnDiv.innerHTML = 'see on Google Play';
          newColumnDiv.title = 'see on Google Play';
          newColumnDiv.href = gameRow[column];
          newColumnDiv.target = "_blank";
          newColumnDiv.className = 'game-column';
          newRowDiv.appendChild(newColumnDiv);
          continue;
      } else {
          let newColumnDiv = document.createElement('div'); // row of children
          newColumnDiv.innerHTML = gameRow[column];
          newColumnDiv.className = 'game-column';
          newRowDiv.appendChild(newColumnDiv);
      }
    }
  }
}

document.onload = Papa.parse('./assets/PlayAppData.csv', {
                    header: true,
                    download: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: function(results) {
                      printHeaders(results);
                      uploadPlayData(results);
                    }
                  });
