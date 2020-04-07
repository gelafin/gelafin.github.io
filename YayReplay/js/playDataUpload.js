import Papa from 'papaparse';

function uploadPlayData(iterations){
  var container = document.getElementById('play-data-container');

  for (let index = 1; index <= iterations; index++){
    let newDiv = document.createElement('div');
    newDiv.innerHTML = 'test text!';
    container.appendChild(newDiv);
  }
}

iterations = 4;
document.onload = uploadPlayData(iterations);

/* test for Papaparse in console before adding to upload function */
var data;

Papa.parse('../../play-store-scraper/PlayAppData.csv', {
  header: true,
  download: true,
  dynamicTyping: true,
  complete: function(results) {
    console.log(results);
    data = results.data;
  }
});
