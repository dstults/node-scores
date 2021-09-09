'use strict';

// -------------------------------------------------------------------------
//   CONFIGURATION
// -------------------------------------------------------------------------

const listenPort = 3329;
const productionMode = true; // false => defaults to designated subdomain
const testModeDefaultSubdomain = 'scores';
const nullResponseMessage = "It's a secret to everybody.";

// -------------------------------------------------------------------------
//   IMPORTS
// -------------------------------------------------------------------------

const http = require("http");
const { URL } = require('url');
const { log, logWarning, logError } = require('./modules/logger');
const { getTimestamp } = require('./modules/timestamps');

const serveApi = require('./modules/serveApi');
const serveScores = require('./modules/serveScores');

// -------------------------------------------------------------------------
//   THE CODE
// -------------------------------------------------------------------------

log(`-------------------------------------------------------------------------\n[${getTimestamp()}] Launching server...`);
if (!productionMode) logWarning(`Server is NOT in production mode! Default subdomain set to: [${testModeDefaultSubdomain}]`);

const server = http.createServer((req, res) => {

	res.setHeader('Access-Control-Allow-Origin', '*'); // Can also specify domain here
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Cache-Control', 'No-Cache');
	const nullResponse = () => {
		res.setHeader('Content-Type', 'text/plain');
		res.setHeader('Cache-Control', 'No-Cache');
		res.write(nullResponseMessage);
		res.end();
	};
	global.nullResponse = nullResponse;

	const clientIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.socket.address().address;
	const protocol = req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'] : 'http';
	const logMessage = `[${getTimestamp()}] << [${clientIp}] [${req.method}] [${protocol}://${req.headers.host}${req.url}]`;
	if (!logMessage.includes('favicon.ico')) {
		log(logMessage);
	}

	const urlData = new URL(`${protocol}://${req.headers.host}${req.url}`);

	const subdomain = productionMode ? req.headers.host.split('.')[0] : testModeDefaultSubdomain;
	switch (subdomain) {
		case 'api':
			serveApi(req, res, urlData);
			break;
		case 'scores':
			serveScores(req, res, urlData);
			break;
		default:
			global.nullResponse();
			break;
	}
	if (!res.writableFinished) // just in case it wasn't ended smoothly
		res.end();
});

// -------------------------------------------------------------------------
//   RUN AND EXIT
// -------------------------------------------------------------------------

process.on('uncaughtException', (err) => {
	if (err.stack) logError(err.stack);
	else logError(err.message);
	process.exit();
});

global.server = server;
server.listen(listenPort, '0.0.0.0');
log(`-------------------------------------------------------------------------\nListening on port ${listenPort}...`);

process.on('exit', () => {
	log(`[${getTimestamp()}] Server shut down!\n-------------------------------------------------------------------------\n`);
});
