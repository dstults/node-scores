'use strict';

const { log, logWarning, logError } = require('./logger');
const { serve204, serveHealthStatus } = require('./serveGenerics');
const { parse: parseQuery } = require('querystring'); // deconstruction syntax to rename generic 'parse' as 'parseQuery'
const { getJson, setJson } = require('./json/jsonIO');

const serveApi = (req, res, urlData) => {
	const query = parseQuery(urlData.search.substr(1)); // remove leading ? and parse
	switch (urlData.pathname) {
		case "/favicon.ico":
			serve204(res);
			break;
		case "/health":
			serveHealthStatus(res);
			break;
		case "/death":
			// If using live-updated code, this alongside a password-checking process will let you
			// restart the server with a single command. If using open source however, this will be
			// a cheap and easy denial of service vulnerability, so it is disabled by default.

			res.nullResponse(); // pretend nothing happened to the end user
			logWarning('Server kill order was given!');
			
			//global.server.close();
			//process.exit();
		case "/json":
			let key;
			let json;

			if (query['key']) key = query['key'];
			if (!key) {
				res.nullResponse();
				return;
			}

			if (query['value']) json = query['value'];
			if (!json) {
				json = getJson(key);
				res.write(JSON.stringify(json));
				res.end();
				return;
			}

			try {
				json = JSON.parse(json);
			} catch (ex) {
				res.write(JSON.stringify(getJson(key)));
				res.end();
				return;
			}

			setJson(key, json);
			serveStatusOK(res);
			return;
		default:
			res.nullResponse();
			break;
	}
};

module.exports = serveApi;
