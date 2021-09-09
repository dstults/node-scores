'use strict';

const { log, logWarning, logError } = require('./logger');
const { serve204, serveHealth } = require('./serveGenerics');
const { parse: parseQuery } = require('querystring'); // deconstruction syntax to rename generic 'parse' as 'parseQuery'
const { sendScores, updateScores } = require('./scores/scoreHandler');

const serveScores = (req, res, urlData) => {
	const query = parseQuery(urlData.search.substr(1)); // remove leading ? and parse
	switch (urlData.pathname) {
		case "/favicon.ico":
			serve204(res);
			break;
		case "/health":
			serveHealth(res);
			break;
		case "/top-five":
			sendScores(res, query, 5);
			break;
		case "/top-ten":
			sendScores(res, query, 10);
			break;
		case "/top-twenty":
			sendScores(res, query, 20);
			break;
		case "/all":
			sendScores(res, query);
			break;
		case "/update":
			updateScores(res, query);
			break;
		default:
			nullResponse();
			break;
	}
};

module.exports = serveScores;
