"use strict";
var express = require('express');
var http = require('http');
var path = require('path');

var port = 8080;
var staticfolder = path.resolve('../client');

var app = express();
app.set('port', port);
app.use(express.static(staticfolder));

app.get('*', function (req, res) {
    res.sendFile('index.html', { root:staticfolder });
  });

var server = http.createServer(app);

server.listen(app.get('port'), function () {
  console.log('HTTP server is listening on port ' + app.get('port'));
});

var io = require('socket.io')(server);

var Faced = require('./lib/faced/faced');
var faced = new Faced();

var cv = require('opencv');

var camWidth = 300;
var camHeight = 200;
var camFrequency = 10;
var camInterval = 2000 / camFrequency;


var color = [255, 255, 0];
var thickness = 3;

// Face detect function
var faceDetect = function (socket) { 
	 socket.on('message', function (message) {
			var camera = new cv.VideoCapture(0);
			camera.setWidth(camWidth);
			camera.setHeight(camHeight);			
			  setInterval(function() {
				    camera.read(function(err, im) {
				      if (err) {
				    	  throw err;}
		//Derectly use the im from camera, the faced module is unable to detect, so have to save it to image file first.		      
				      im.save("test.jpg");
				        faced.detect('test.jpg', function (faces, image, file) {
				        if(faces){	
					        for (var i = 0; i < faces.length; i++) {
					        	var face = faces[i];
					            im.rectangle([face.getX(), face.getY()], [face.getWidth(), face.getHeight()], color, thickness);
					            im.putText("Hello "+message+" Welcome!", 0, 10,'HERSEY_COMPLEX_SMALL', color);
					          }
				       }
				        socket.emit('frame', { buffer: im.toBuffer()});
					 }); 
				    });
				  }, camInterval); 
			  
			   socket.on('disconnect', function() {
				      camera.close();
			   });

	 }); 

	
 };
 
 
io.on("connection", faceDetect);

module.exports.app = app;