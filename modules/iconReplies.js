'use strict';

const fs = require('fs');

const serve204 = (res) => {
	//res.setHeader("Cache-Control", "public, max-age=2592000");
	//res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
	res.writeHead(204);
	res.end();
};

const serveIcon = (res) => {
	try {
		fs.stat('./favicon.ico', function (err, stats) {
			if (err) {
				console.error('Error serving favicon: ' + err);
			} else {
				res.setHeader('Content-Type', 'image/x-icon');
				res.setHeader('Content-Length', stats.size);
				res.setHeader('Last-Modified', stats.mtime);
				res.setHeader("Cache-Control", "public, max-age=2592000");
				res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
				fs.readFile('./favicon.ico', (err, content) => {
					if (err) console.error('Error serving favicon: ' + err);
					else res.end(content);
				});
			}
		});
	} catch (err) {
		console.error(err)
	}
};

module.exports.serve204 = serve204;
module.exports.serveIcon = serveIcon;
