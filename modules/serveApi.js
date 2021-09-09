'use strict';

const { log, logWarning, logError } = require('./logger');
const { serve204, serveHealth } = require('./serveGenerics');
const { parse: parseQuery } = require('querystring'); // deconstruction syntax to rename generic 'parse' as 'parseQuery'


const serveApi = (req, res, urlData) => {
	const query = parseQuery(urlData.search.substr(1)); // remove leading ? and parse
	switch (urlData.pathname) {
		case "/favicon.ico":
			serve204(res);
			break;
		case "/health":
			serveHealth(res);
			break;
		case "/death":
			nullResponse(); // pretend nothing happened to the end user
			logWarning('Server kill order received!');
			global.server.close();
			process.exit();
		default:
			nullResponse();
			break;
	}
};

module.exports = serveApi;
