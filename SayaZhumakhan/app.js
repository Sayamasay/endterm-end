var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var server = http.createServer(function(request, response) {
	
    var filePath = false;
	
    if (request.url == '/' || request.url == '/index') {
        filePath = 'index.html';
    } 
	
	else if (request.url == '/about'){
		filePath = 'about.html';
	}
	
	else if (request.url == '/img/gallery/graduation'){
		filePath = '/img/gallery/graduation.jpg';
	}
	
	else if (request.url == '/img/gallery/study'){
		filePath = '/img/gallery/study.jpg';
	}
	
	else if (request.url == '/video/students/memes'){
		filePath = '/video/students/memes.mp4';
	}
	
	else {
        filePath = request.url;
    }
	
	filePath = filePath.replace(/\/?(?:\?.*)?$/, "").toLowerCase();
	
    var absPath = './' + filePath;

    serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
    console.log("Mister! Server works here -> http://localhost:3000.");
});

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/html'});
    response.end(__dirname + "/error.html");
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {"content-type": mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {

    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}
