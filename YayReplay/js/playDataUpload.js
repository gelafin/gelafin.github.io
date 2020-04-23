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
  totalRowCounter = 0; //must start at 0 bc subscripts data array below
  chunkRowsUploaded = 0; // keeps track of the 50 to avoid bug where like 40 results load and then oh no there's no more time to resume and resume calls upload50 from the beginning, which loads 50+40 from before = 90 results in one button press.
  loadRows = 50; // how many rows to load at once

  uploadPlayData(parsedObject, parser){
    for (let index = this.chunkRowsUploaded; index < this.loadRows; index++, this.totalRowCounter++){ //loop 50 times to upload 50 rows, unless this function is being called after a resume(), which interrupted the count. In that case, make index not from 0 but from whatever row it was on before and continue until 50
      if (this.totalRowCounter + 1 > parser.streamer._rowCount) { // if no more rows in this chunk (counter starts at 0 in order to subscript)
        console.log("finished uploading this chunk. Calling parser.resume(), which will get a new chunk and then...?");
        parser.resume(); // resume parsing. This should call uploadPlayData again from the top after getting the new chunk
        return;
      }

      let gameRow = parsedObject.data[manager.totalRowCounter];

      if (gameRow) {

        console.log("uploading game #", this.totalRowCounter);

        for (const column of parsedObject.meta.fields) { // loop through one row to upload all columns
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
                let previewImages = gameRow[column].split(', ');
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
      } else {
        console.log("all games showing! Game # ", this.totalRowCounter, "doesn't exist in the database");
        // deactivate "load more" button
        return;
      }
    }
    this.chunkRowsUploaded = 0; // after loop completes all 50 times, reset counter
  }
}

manager = new Manager;

Papa.RemoteChunkSize = 100000; // set chunk to less than the file for testing

document.onload = Papa.parse('./assets/PlayAppData.csv', {
                    header: true,
                    download: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    chunk: function(results, parser) {
                      console.log("starting a chunk callback");
                      parser.pause();
                      manager.uploadPlayData(results, parser);
                    }
                  });

console.log("simulating load more button press...but it will not have the parse results")
manager.uploadPlayData(Papa.results, Papa.parser);
