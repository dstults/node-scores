'use strict';

// -------------------------------------------------------------------------
//   CONFIGURATION
// -------------------------------------------------------------------------

const listenPort = 3329;
const productionMode = true; // false => defaults to designated subdomain
const testModeDefaultSubdomain = 'api';
const nullResponseMessage = "It's a secret to everybody.";

// -------------------------------------------------------------------------
//   IMPORTS
// -------------------------------------------------------------------------

const http = require("http");
const { URL } = require('url');
const { logIgnore, log, logWarning, logError } = require('./modules/logger');

const serveApi = require('./modules/serveApi');
const serveScores = require('./modules/serveScores');
const { getTimestamp } = require('./modules/timestamps');

// -------------------------------------------------------------------------
//   THE CODE
// -------------------------------------------------------------------------

log(`-------------------------------------------------------------------------\n[${getTimestamp()}] Launching server...`, false);
if (!productionMode) logWarning(`Server is NOT in production mode! Default subdomain set to: [${testModeDefaultSubdomain}]`, false);

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
	res.nullResponse = nullResponse;

	// Prepare log message
	const clientIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : req.socket.address().address;
	const protocol = req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'] : 'http';
	const logMessage = `<< [${clientIp}] [${req.method}] [${protocol}://${req.headers.host}${req.url}]`;

	// Log Message
	const subdomain = productionMode ? req.headers.host.split('.')[0] : testModeDefaultSubdomain;
	if (logMessage.includes('favicon.ico') || (subdomain !== 'api' && subdomain !== 'scores')) {
		// Short-circuit out if to be ignored
		logIgnore(logMessage);
		res.nullResponse();
		return;
	}
	log(logMessage);

	// Normal procedure
	const urlData = new URL(`${protocol}://${req.headers.host}${req.url}`);
	switch (subdomain) {
		case 'api':
			// Launch general API
			serveApi(req, res, urlData);
			break;
		case 'scores':
			// Launch score API
			serveScores(req, res, urlData);
			break;
		default:
			// This should never run
			res.nullResponse();
			break;
	}

	// This should never run
	if (!res.writableFinished) res.end();
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
log(`-------------------------------------------------------------------------\n[${getTimestamp()}] Listening on port ${listenPort}...`, false);

process.on('exit', () => {
	log(`Server shut down!\n-------------------------------------------------------------------------\n`);
});
