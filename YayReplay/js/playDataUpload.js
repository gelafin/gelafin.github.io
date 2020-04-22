/* papaparse imported using script tag */

function createElementInside(newTag, containerId){
  var container = document.getElementById(containerId);
  let newElement = document.createElement(newTag); // create element with flex-flow: row nowrap using .className assignment
  container.appendChild(newElement); // new empty div to keep children in a row
  return newElement;
}

function isHiddenItem(heading){
  hiddenItemColumns = ['video', 'previewImageList', 'publisher', 'link'];
  return hiddenItemColumns.includes(heading);
}

function getColumnId(column) {
  columnIds = {
    'id': 'n/a',
    'image': 'game-image-column',
    'title': 'game-title-column',
    'starRating': 'game-stars-column',
    'price': 'game-price-column',
    'contentRating': 'game-content-rating-column',
    'contentRatingReasons': 'game-content-rating-reasons-column',
    'video': 'n/a',
    'previewImageList': 'n/a',
    'genreList': 'game-genre-column',
    'publisher': 'n/a',
    'link': 'n/a'
  };

  for (const key in columnIds) {
    if (column === key) {
      return columnIds[key];
    }
  }

  return false; // TOOD: make this enum and consolidate with getColumnIdTemp
}

function getColumnIdTemp(column) {
  columnIds = {
    'image': 'game-image-column',
    'title': 'game-title-column',
    'starRating': 'game-stars-column',
    'price': 'game-price-column',
    'contentRating': 'game-content-rating-column',
    'contentRatingReasons': 'game-content-rating-reasons-column',
    'genreList': 'game-genre-column',
  };

  for (const key in columnIds) {
    if (column === key) {
      return columnIds[key];
    }
  }

  return false; // TOOD: make this enum
}

// unused for now, since headers are hard-coded in HTML
function printHeaders(parsedObject){
  for (const column of parsedObject.meta.fields){
    if (column === 'id' || column === 'image' || column === 'video' ||
    column === 'previewImageList') {
      continue; // don't print these column titles
    } else {
        let newHeaderDiv = createElementInside('div', 'game-data-container'); // TODO: columns should be accessible to screen readers, so maybe h3 or something
        newColumnDiv.innerHTML = column;
        newColumnDiv.className = 'game-column';
    }
  }
}

class Manager {
  totalRowCounter = 1; //must start at 1 bc compares to array.length below
  chunkRowsUploaded = 0; // keeps track of the 50 to avoid bug where like 40 results load and then oh no there's no more time to resume and resume calls upload50 from the beginning, which loads 50+40 from before = 90 results in one button press.

  uploadPlayData(parsedObject, parser){
    for (const gameRow of parsedObject.data){
      for (const column of parsedObject.meta.fields){
        if (column === 'id') {
          continue; // don't print id
        } else if (column === 'image') {
            let newImg = document.createElement('img');
            newImg.src = gameRow[column];
            newImg.className = 'game-data-item game-image';
            document.getElementById('game-image-column').appendChild(newImg);

            // prepare hidden row underneath first item
            var newRowDivHidden = document.createElement('div');
            newRowDivHidden.className = 'flexbox-container game-details hidden';
            newImg.appendChild(newRowDivHidden);

            continue; // short-circuit for efficiency
        } else if (getColumnIdTemp(column) !== false) { // if column is non-hidden text-only. TODO: how to save returned value to avoid a second call?
            let newColumnDiv = document.createElement('div');
            newColumnDiv.innerHTML = gameRow[column];
            newColumnDiv.className = 'game-data-item';
            document.getElementById(getColumnId(column)).appendChild(newColumnDiv);
            continue;
        } else { // it's a hidden details item
          // TODO: Once search is ready, make hidden items load in a separate function called by button
          // each game has a hidden details div that never interacts with layout. The button that shows this will also create space for it
            if (column === 'video') {
              if (gameRow[column] != 'none') {
                let newIframe = document.createElement('iframe');
                newIframe.src = gameRow[column];
                newIframe.className = 'game-data-item';
                newRowDivHidden.appendChild(newIframe);
              }
              continue;
            } else if (column === 'previewImageList') {
              // makes new img element for each. uris are separated by comma
              previewImages = gameRow[column].split(', ');
              for (const uri of previewImages) {
                let newImgTag = document.createElement('img');
                newImgTag.src = uri;
                newImgTag.className = 'game-data-item';
                newRowDivHidden.appendChild(newImgTag);
              }
              continue;
            } else if (column === 'link') {
              let newAnchor = document.createElement('a');
              newAnchor.innerHTML = 'Google Play page';
              newAnchor.title = 'Google Play page';
              newAnchor.href = gameRow[column];
              newAnchor.target = "_blank";
              newAnchor.className = 'game-data-item';
              newRowDivHidden.appendChild(newAnchor);
              continue;
            } else { // text-only hidden details item
              let newDiv = document.createElement('div');
              newDiv.innerHTML = gameRow[column];
              newRowDivHidden.appendChild(newDiv);
            }
        }
      }
      //after for loop goes through one game, pause parsing
      parser.pause();
    }
  }
}

manager = new Manager;

Papa.RemoteChunkSize = 100000; // set chunk to less than the file for testing

document.onload = Papa.parse('./assets/PlayAppData.csv', {
                    header: true,
                    download: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    chunk: manager.uploadPlayData
                  });
