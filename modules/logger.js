'use strict';

const fs = require('fs');
const { getCompactDatestamp } = require('./timestamps');
const folderPath = './logs/';
const { getTimestamp } = require('./timestamps');

const appendTimestamp = (message) => {
	return '[' + getTimestamp() + '] ' + message;
};

const checkMakeFolder = () => {
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath);
		console.log('Could not detect log directory, attempting to create...');
	}
	if (!fs.existsSync(folderPath)) {
		console.log('Could not create log directory, aborting log save.');
		return false;
	}
	// Not actually needed to work.
	/* if (!fs.accessSync(folderPath)) {
		console.log('Could not access log directory, aborting log save.');
		return false;
	} */
	return true;
};

const saveToIgnoreLog = (message) => {
	if (checkMakeFolder()) {
		//console.log('Attempting to append to log file: ' + folderPath + 'logs' + getCompactDatestamp() + '.txt');
		fs.appendFile(folderPath + 'ignore' + getCompactDatestamp() + '.txt', message + '\n', (err) => {
			if (err) {
				console.log(err);
				return false;
			}
		});
		return true;
	} else {
		return false;
	}
};

const saveToBaseLog = (message) => {
	if (checkMakeFolder()) {
		//console.log('Attempting to append to log file: ' + folderPath + 'logs' + getCompactDatestamp() + '.txt');
		fs.appendFile(folderPath + 'logs' + getCompactDatestamp() + '.txt', message + '\n', (err) => {
			if (err) {
				console.log(err);
				return false;
			}
		});
		return true;
	} else {
		return false;
	}
};

const logIgnore = (message, addTimestamp = true) => {
	if (addTimestamp) message = appendTimestamp(message);
	console.log('! IGNORE ! ' + message);

	saveToIgnoreLog(message);
};

const log = (message, addTimestamp = true) => {
	if (addTimestamp) message = appendTimestamp(message);
	console.log(message);

	saveToBaseLog(message);
};

const logWarning = (message, addTimestamp = true) => {
	if (addTimestamp) message = appendTimestamp(message);
	message = '! WARNING ! ' + message;
	console.warn(message);

	if (saveToBaseLog(message)) {
		fs.appendFile(folderPath + 'warnings' + getCompactDatestamp() + '.txt', message + '\n', (err) => {
			if (err) console.log(err);
		});
	}
};

const logError = (message, addTimestamp = true) => {
	if (addTimestamp) message = appendTimestamp(message);
	message = '! ERROR ! ' + message;
	console.error(message);

	if (saveToBaseLog(message)) {
		fs.appendFile(folderPath + 'errors' + getCompactDatestamp() + '.txt', message + '\n', (err) => {
			if (err) console.log(err);
		});
	}
};

module.exports.logIgnore = logIgnore;
module.exports.log = log;
module.exports.logWarning = logWarning;
module.exports.logError = logError;
