'use strict';

const { log, logWarning, logError } = require('../logger');
const { validateName } = require('../stringHelpers');

const publicOperation = (scoreData) => {
	const pub = {};
	pub.name = scoreData.name;
	pub.shipName = scoreData.shipName;
	pub.ai = scoreData.ai;
	pub.score = scoreData.score;
	pub.time = scoreData.time;
	pub.egg1 = scoreData.egg1;
	pub.egg2 = scoreData.egg2;
	pub.egg3 = scoreData.egg3;
	return pub;
};

const validateInput = (query) => {
	if (query.uid.length !== 20) {
		logWarning('Invalid UID.');
		return false;
	}
	if (!query.name) {
		logWarning('Missing name data.');
		return false;
	}
	query.name = validateName(query.name);
	if (!query.name) {
		logWarning('Invalid name data.');
		return false;
	}
	query.shipName = validateName(query.shipName);
	if (!query.shipName) {
		logWarning('Invalid shipName data.');
		return false;
	}
	if (!query.ai) {
		logWarning('Invalid ai data.');
		return false;
	}
	if (!query.egg1 || !query.egg2 || !query.egg3) {
		logWarning('Missing egg data.');
		return false;
	}
	if (!query.timeDiff) {
		logWarning('Missing timeDiff data.');
		return false;
	}
	query.timeDiff = parseFloat(query.timeDiff);
	if (isNaN(query.timeDiff) || query.timeDiff <= 0) {
		logWarning('Invalid timeDiff data.');
		return false;
	}
	if (!query.progress) {
		logWarning('Missing progress data.');
		return false;
	}
	query.progress = parseInt(query.progress);
	if (isNaN(query.progress) || query.progress < 0) {
		logWarning('Invalid progress data.');
		return false;
	}

	return true;
};

const scoringAlogrithm = (score, newData) => {
	// Update info if new data present
	if (!score.timeRecords) score.timeRecords = [];
	if (!score.dateTime) score.dateTime = new Date();
	if (newData) {
		score.name = newData.name;
		score.shipName = newData.shipName;
		score.ai = newData.ai;
		// Only update timeDiff if there hasn't been a time for this progress reported, 
		// this prevents debuggers from constantly adding to the time when going back and forth.
		if (!score.timeRecords[newData.progress]) {
			score.timeRecords[newData.progress] = newData.timeDiff;
			score.timeDiff = newData.timeDiff;
		}
		score.timeRecords[newData.progress] = newData.timeDiff;
		score.egg1 = parseInt(newData.egg1) === 1;
		score.egg2 = parseInt(newData.egg2) === 1;
		score.egg3 = parseInt(newData.egg3) === 1;
		score.progress = newData.progress;
	}

	// Check if should be scored
	if (score.progress < 4 || !score.timeRecords || !score.timeRecords[1] || !score.timeRecords[2] || !score.timeRecords[3] || !score.timeRecords[4]) {
		score.public = false;
		score.score = undefined;
		return;
	}

	// Adjust time difference by removing the time spent making name
	if (score.timeRecords && score.timeRecords[0] && score.timeRecords[4]) {
		score.timeDiff = score.timeRecords[4] - score.timeRecords[0];
	}

	// Flag as displayable
	score.public = true;

	// Give a score
	score.score = 500; // progress 4 => beat the game.
	score.score -= parseInt(score.timeDiff / 2); // every 2 seconds is 1 point
	if (score.ai && score.ai === 'virus') score.score += 25;
	if (score.egg1) score.score += 50;
	if (score.egg2) score.score += 50;
	if (score.egg3) score.score += 50;

	// Get total play time
	score.time = Math.round(score.timeDiff);
	let seconds = Math.trunc(score.time % 60);
	if (seconds < 10) seconds = '0' + seconds;
	let minutes = Math.trunc((score.time / 60) % 60);
	let hours = Math.trunc(score.time / 3600);
	if (hours >= 1 && minutes < 10) minutes = '0' + minutes;
	hours = hours > 0 ? hours + ':' : '';
	score.time = hours + minutes + ':' + seconds;
};

module.exports.publicOperation = publicOperation;
module.exports.validateInput = validateInput;
module.exports.scoringAlogrithm = scoringAlogrithm;
