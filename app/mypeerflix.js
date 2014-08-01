var readTorrent = require('read-torrent');
var peerflix = require('peerflix');
var address = require('network-address');
var proc = require('child_process');

var argv = {
	vlc : true,
	quite : true
}
var VLC_ARGS = '-q --video-on-top --play-and-exit';

var ontorrent = function(torrent) {
	var engine = peerflix(torrent, argv);
	var hotswaps = 0;
	var verified = 0;
	var invalid = 0;

	engine.on('verify', function() {
		verified++;
	});

	engine.on('invalid-piece', function() {
		invalid++;
	});

	if (argv.list) {
		var onready = function() {
			engine.files.forEach(function(file, i, files) {
			});
		};
		if (engine.torrent) onready();
		else engine.on('ready', onready);
		return;
	}

	engine.on('hotswap', function() {
		hotswaps++;
	});

	var started = Date.now();
	var wires = engine.swarm.wires;
	var swarm = engine.swarm;

	var active = function(wire) {
		return !wire.peerChoking;
	};
	
	[].concat(argv.peer || []).forEach(function(peer) {
		engine.connect(peer);
	})

	engine.server.on('listening', function() {
		var href = 'http://'+address()+':'+engine.server.address().port+'/';
		var filename = engine.server.index.name.split('/').pop().replace(/\{|\}/g, '');
		var filelength = engine.server.index.length;

		console.log('start listening');

		if (argv.all) {
			filename = engine.torrent.name;
			filelength = engine.torrent.length;
			href += '.m3u';
		}

		if (argv.vlc && process.platform === 'win32') {
			var registry = require('windows-no-runnable').registry;
			var key;
			if (process.arch === 'x64') {
				try {
					key = registry('HKLM/Software/Wow6432Node/VideoLAN/VLC');
				} catch (e) {
					try {
						key = registry('HKLM/Software/VideoLAN/VLC');
					} catch (err) {}
				}
			} else {
				try {
					key = registry('HKLM/Software/VideoLAN/VLC');
				} catch (err) {
					try {
						key = registry('HKLM/Software/Wow6432Node/VideoLAN/VLC');
					} catch (e) {}
				}
			}

			if (key) {
				var vlcPath = key['InstallDir'].value + path.sep + 'vlc';
				VLC_ARGS = VLC_ARGS.split(' ');
				VLC_ARGS.unshift(href);
				proc.execFile(vlcPath, VLC_ARGS);
			}
		} else {
			if (argv.vlc) {
				var root = '/Applications/VLC.app/Contents/MacOS/VLC'
				var home = (process.env.HOME || '') + root
				var vlc = proc.exec('vlc '+href+' '+VLC_ARGS+' || '+root+' '+href+' '+VLC_ARGS+' || '+home+' '+href+' '+VLC_ARGS, function(error, stdout, stderror){
					if (error) {
					}
				});

				vlc.on('exit', function(){
				});
			}
		}

		if (argv.omx) proc.exec(OMX_EXEC+' '+href);
		if (argv.mplayer) proc.exec(MPLAYER_EXEC+' '+href);
		if (argv.mpv) proc.exec(MPV_EXEC+' '+href);
		if (argv.airplay) {
			var browser = require('airplay-js').createBrowser();
			browser.on('deviceOn', function( device ) {
				device.play(href, 0, noop);
			});
			browser.start();
		}

		if (argv.quiet) return console.log('server is listening on '+href);

		var bytes = function(num) {
			return numeral(num).format('0.0b');
		};

	});

	engine.server.once('error', function() {
		engine.server.listen(0);
	});

	var onmagnet = function() {
	};

	if (typeof torrent === 'string' && torrent.indexOf('magnet:') === 0 && !argv.quiet) {
		onmagnet();
		engine.swarm.on('wire', onmagnet);
	}

	engine.on('ready', function() {
		engine.swarm.removeListener('wire', onmagnet);
		if (!argv.all) return;
		engine.files.forEach(function(file) {
			file.select();
		});
	});

	if(argv.remove) {
		var remove = function() {
			engine.remove(function() {
			});
		};

		process.on('SIGINT', remove);
		process.on('SIGTERM', remove);
	}
};


exports.read = function(filename){
	readTorrent(filename, function(err, torrent) {
		console.log('Torrent read');
		if (err) {
			console.error(err.message);
		}
		console.log('starting on torrent');
		ontorrent(torrent);
	});
}
