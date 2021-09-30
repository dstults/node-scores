'use strict';

const { log, logWarning, logError } = require('./logger');
const { serve204, serveStatusOK } = require('./serveGenerics');
const { parse: parseQuery } = require('querystring'); // deconstruction syntax to rename generic 'parse' as 'parseQuery'
const { sendScores, updateScores, recalcScores } = require('./scores/scoreHandler');

const serveScores = (req, res, urlData) => {
	const query = parseQuery(urlData.search.substr(1)); // remove leading ? and parse
	switch (urlData.pathname) {
		case "/favicon.ico":
			serve204(res);
			break;
		case "/health":
			serveStatusOK(res);
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
		case "/top-thirty":
			sendScores(res, query, 30);
			break;
		case "/top-one-hundred":
			sendScores(res, query, 100);
			break;
		case "/update":
			updateScores(res, query);
			break;
		case "/recalc":
			recalcScores(res, query);
			break;
		default:
			res.nullResponse();
			break;
	}
};

module.exports = serveScores;
