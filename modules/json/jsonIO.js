'use strict';

// Private --------------------

let jsons;
const fs = require('fs');
const { log, logWarning, logError } = require('../logger');
const filePath = './data/json/json.json';
const { shallowCompare } = require('../compareObjects');

const loadData = () => {
	log('Loading JSON database');
	try {
		jsons = fs.readFileSync(filePath, 'utf8');
	} catch (err) {
		logError(`Error reading from path [${filePath}]: [${err}]`);
		jsons = {};
		return;
	}
	try {
		jsons = JSON.parse(jsons);
	} catch (err) {
		logError(`Error parsing json [${json}] from path [${filePath}]: [${err}]`);
		jsons = {};
		return;
	}
};

const saveData = () => {
	log('Saving JSON database');
	fs.writeFile(filePath, JSON.stringify(jsons, null, '\t'), err => {
		if (err) {
			logError(`Error writing to path [${filePath}]: [${err}]`);
		} else {
			log('File saved to: ' + filePath);
		}
	});
};

// Public API --------------------

const getJson = (key) => {
	if (!jsons) loadData(); // load database if not already loaded

	//console.log(`Does the key [${key}] really exist? The answer might surprise you! It's: [${jsons[key] !== undefined}]`)
	if (jsons[key] !== undefined) {
		return jsons[key];
	}
	return {};
};

const setJson = (key, json) => {
	if (!jsons) loadData(); // load database if not already loaded

	if (!jsons[key] || !shallowCompare(jsons[key], json)) {
		jsons[key] = json;
		saveData();
	}
};

module.exports.getJson = getJson;
module.exports.setJson = setJson;
