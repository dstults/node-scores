'use strict';

const fs = require('fs');
const { log, logError } = require('./logger');

const serve204 = (res) => {
	res.writeHead(204);
	res.end();
};

const serve404 = (res) => {
	res.writeHead(404);
	res.end();
};

const serve500 = (res) => {
	res.writeHead(500);
	res.end();
};

const serveStatusOK = (res) => {
	const output = {};
	output.status = 'good';
	res.write(JSON.stringify(output));
	res.end();
};

const serveIcon = (res) => {
	try {
		fs.stat('./favicon.ico', function (err, stats) {
			if (err) {
				logError('Error serving favicon: ' + err);
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
		logError(err)
	}
};

module.exports.serve204 = serve204;
module.exports.serveStatusOK = serveStatusOK;
module.exports.serveIcon = serveIcon;
