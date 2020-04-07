
function uploadPlayData(){
  var container = document.getElementById('play-data-container');
  var newDiv = document.createElement('div');
  newDiv.innerHTML = 'test text!';
  container.appendChild(newDiv);
}

document.onload = uploadPlayData();
