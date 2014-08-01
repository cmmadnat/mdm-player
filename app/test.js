var torrentStream = require('torrent-stream');
var readTorrent = require('read-torrent');

var fileName = '/home/cmmadnat/Desktop/download.zip.torrent';
readTorrent(fileName, function(err, torrent){
console.log(JSON.stringify(err));
	var engine = torrentStream(torrent);
	engine.on('ready', function() {
	    engine.files.forEach(function(file) {
	        console.log('filename:', file.name);
	        var stream = file.createReadStream();
	        // stream is readable stream to containing the file content
	    });
	});
});

