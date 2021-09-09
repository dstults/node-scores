'use strict';

const fs = require('fs');
const { getCompactDatestamp } = require('./timestamps');

const log = (message) => {
	console.log(message);

	fs.appendFile('logs' + getCompactDatestamp() + '.txt', message + '\n', function (err) {
		if (err) console.log(err);
	});
};

const logWarning = (message) => {
	console.warn('! WARNING ! ' + message);

	fs.appendFile('logs' + getCompactDatestamp() + '.txt', '! WARNING ! ' + message + '\n', function (err) {
		if (err) console.log(err);
	});
	fs.appendFile('warnings' + getCompactDatestamp() + '.txt', message + '\n', function (err) {
		if (err) console.log(err);
	});
};

const logError = (message) => {
	console.error('! ERROR ! ' + message);

	fs.appendFile('logs' + getCompactDatestamp() + '.txt', '! ERROR ! ' + message + '\n', function (err) {
		if (err) console.log(err);
	});
	fs.appendFile('errors' + getCompactDatestamp() + '.txt', message + '\n', function (err) {
		if (err) console.log(err);
	});
};

module.exports.log = log;
module.exports.logWarning = logWarning;
module.exports.logError = logError;
