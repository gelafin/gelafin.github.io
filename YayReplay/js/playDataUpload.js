/* papaparse imported using script tag */

function createRowDivInside(containerClass){
  var container = document.getElementById(containerClass);
  let newRowDiv = document.createElement('div'); // create element with flex-flow: row nowrap using .className assignment
  container.appendChild(newRowDiv); // new empty div to keep children in a row
  return newRowDiv;
}

function printHeaders(parsedObject){
  var newRowDiv = createRowDivInside('play-data-container');

  for (const column of parsedObject.meta.fields){
    if (column === 'id' || column === 'image' || column === 'video' ||
    column === 'previewImageList') {
      continue; // don't print these column titles
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
    let newRowDivHidden = createRowDivInside('play-data-container');
    newRowDiv.className = 'flexbox-container game-row';
    newRowDivHidden.className = 'flexbox-container game-row'; // everything below that goes in this div should be loaded only after button press

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
      } else if (column === 'image') {
          let newImg = document.createElement('img');
          newImg.src = gameRow[column];
          newImg.className = 'game-column game-image';
          newRowDiv.appendChild(newImg);
      } else if (column === 'video') {
          if (gameRow[column] != 'none') {
            let newIframe = document.createElement('iframe');
            newIframe.src = gameRow[column];
            newIframe.className = 'game-video';
            newRowDivHidden.appendChild(newIframe);
          }
      } else if (column === 'previewImageList') {
          // makes new img element for each. uris are separated by comma
          previewImages = gameRow[column].split(', ');
          for (const uri of previewImages) {
            let newImgTag = document.createElement('img');
            newImgTag.src = uri;
            newImgTag.className = 'preview-image';
            newRowDivHidden.appendChild(newImgTag);
          }
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
