/* papaparse imported using script tag */

function createElementInside(newTag, containerClass){
  var container = document.getElementById(containerClass);
  let newElement = document.createElement(newTag); // create element with flex-flow: row nowrap using .className assignment
  container.appendChild(newElement); // new empty div to keep children in a row
  return newElement;
}

function isHiddenItem(heading){
  hiddenItemColumns = ['video', 'previewImageList', 'publisher', 'link'];
  return hiddenItemColumns.includes(heading);
}

// unused for now, since headers are hard-coded in HTML
function printHeaders(parsedObject){
  for (const column of parsedObject.meta.fields){
    if (column === 'id' || column === 'image' || column === 'video' ||
    column === 'previewImageList') {
      continue; // don't print these column titles
    } else {
        let newHeaderDiv = document.createElementInside('div', 'game-data-container'); // TODO: columns should be accessible to screen readers, so maybe h3 or something
        newColumnDiv.innerHTML = column;
        newColumnDiv.className = 'game-column';
    }
  }
}

function uploadPlayData(parsedObject){
  for (const gameRow of parsedObject.data){
    for (const column of parsedObject.meta.fields){
      if (column === 'id') {
        continue; // don't print id
      } else if (column === 'link') {
          let newAnchor = document.createElement('a');
          newAnchor.innerHTML = 'Google Play page';
          newAnchor.title = 'Google Play page';
          newAnchor.href = gameRow[column];
          newAnchor.target = "_blank";
          newAnchor.className = 'game-data-item';
          newRowDiv.appendChild(newAnchor);
          continue;
      } else if (column === 'image') {
          let newImg = document.createElement('img');
          newImg.src = gameRow[column];
          newImg.className = 'game-data-item game-image';
          newRowDiv.appendChild(newImg);
      } else if (!isHiddenItem(column)){
          let newColumnDiv = document.createElement('div'); // row of children
          newColumnDiv.innerHTML = gameRow[column];
          newColumnDiv.className = 'game-column';
          newRowDiv.appendChild(newColumnDiv);
      }
    }

    // TODO: Once search is ready, make hidden items load in a separate function called by button
    // each game has a hidden details div that never interacts with layout. The button that shows this will also create space for it
    let newRowDivHidden = createRowDivInside('game-data-container');
    newRowDivHidden.className = 'flexbox-container game-details hidden'; // everything below that goes in this div should be loaded only after button press
    if (column === 'video') {
        if (gameRow[column] != 'none') {
          let newIframe = document.createElementInside('iframe', 'newRowDivHidden');
          newIframe.src = gameRow[column];
          newIframe.className = 'game-data-item';
          newRowDivHidden.appendChild(newIframe);
        }
    } else if (column === 'previewImageList') {
        // makes new img element for each. uris are separated by comma
        previewImages = gameRow[column].split(', ');
        for (const uri of previewImages) {
          let newImgTag = document.createElementInside('img', 'newRowDivHidden');
          newImgTag.src = uri;
          newImgTag.className = 'game-data-item';
        }
    } else {
      let newDiv = document.createElementInside('div', 'newRowDivHidden');
      newDiv.innerHTML = gameRow[column];
    }
  }
}

document.onload = Papa.parse('./assets/PlayAppData.csv', {
                    header: true,
                    download: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: uploadPlayData;
                  });
