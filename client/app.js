var socket = io.connect('http://localhost');

var canvas = document.getElementById('canvas-video');
var button = document.getElementById('button');
var context = canvas.getContext('2d');
//var name = document.getElementsByTagName('input')[0].value

var img = new Image();

button.onclick = function(){

context.fillStyle = '#333';
context.fillText('Opening Camera', canvas.width/2-30, canvas.height/3);
//socket.emit("message", "Hello");
//alert(document.getElementById('textid').value);
socket.emit("message", document.getElementById('textid').value);

socket.on('frame', function (data) {
  var uint8Arr = new Uint8Array(data.buffer);
//var binary = String.fromCharCode(uint8Arr[0]);
  var binary = '';
  for (var i = 0; i < uint8Arr.length; i++) {
      binary += String.fromCharCode(uint8Arr[i]);
  }
  var base64String = btoa(binary);

  img.onload = function () {
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
  };
  img.src = 'data:image/png;base64,' + base64String;
});
};

