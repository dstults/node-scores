'use strict';

const fs = require('fs');
const makeScore = require('./scoreFactory');
const { log, logWarning, logError } = require('../logger');
const { makeRankChangeDetails } = require('./scoreChangeFactory');
const { shallowCompare } = require('../compareObjects');

const maxScoreCountLimit = 200;

class ScoreList {
	constructor(filePath, rawScoreData, displayLimit) {
		this.filePath = filePath;
		this.scores = [];
		this.displayLimit = displayLimit;
		let score;
		for (let i = 0; i < rawScoreData.length; i++) {
			score = rawScoreData[i];
			score = makeScore(score.uid, score.name, score.score);
			if (score) this.scores.push(score);
		}
		this.sortReverse();
	}

	addEntry(score) {
		if (!score) return; // These have already been checked but I just want to make extra sure
		if (!score.uid || !score.name || !score.score) return; // that I double-check things

		// Get old stats
		const oldRank = this.scores.findIndex(s => s.uid === score.uid);
		const oldScore = oldRank === -1 ? undefined : this.scores[oldRank].score;

		// Add new score and sort and save
		if (oldRank === -1)
			this.scores.push(score);
		else
			this.scores[oldRank] = score;
		this.sortReverse();
		this.saveScores();

		// Get new rank and return formatted response
		const newRank = this.scores.findIndex(s => s.uid === score.uid);
		return makeRankChangeDetails(score.name, oldRank, oldScore, newRank, score.score);
	}

	getPublic() {
		const output = [];
		let score;
		for (let i = 0; i < this.scores.length; i++) {
			score = this.scores[i];
			output.push(score.getPublic());
		}
		if (output.length > this.displayLimit) output = output.splice(0, this.displayLimit);
		return output;
	}

	sortReverse() {
		if (this.scores) {
			this.scores.sort((a, b) => a.score <= b.score ? 1 : -1);
		}
	}

	saveScores = () => {
		if (!this.filePath) {
			logError('Error: Attempted to save a score list without a file path!');
			return;
		}
		if (!this.scores) {
			logError('Error: Attempted to save a score list without any score data!');
			return;
		}

		try {
			const scoreCheck = JSON.parse(JSON.stringify(this.scores));
			/*	// This fails no matter what because the this.scores are actual Score objects,
				// whereas in the JSON version they're plain ol' Object objects.
			if (!shallowCompare(this.scores, scoreCheck)) {
				console.log(this.scores);
				console.log(scoreCheck);
				logError(`Could not validate save data, aborting.`);
				return;
			} */
		} catch {
			logError('Received invalid save data, aborting save.');
			return;
		}

		if (this.scores.length > maxScoreCountLimit) this.scores = this.scores.splice(0, maxScoreCountLimit);

		fs.writeFile(this.filePath, JSON.stringify(this.scores, null, '\t'), err => {
			if (err) {
				logError(`Error writing to path [${this.filePath}]: [${err}]`);
			} else {
				log('File saved to: ' + this.filePath);
			}
		});
	}
}

/**
 * @param {string} path File name of the score file
 * @returns {ScoreList} a list of scores
 */
const getScoreList = (path, displayLimit) => {
	if (!path) return undefined;
	if (typeof path !== 'string') return undefined;

	const fullPath = './scores/' + path + '.txt';
	try {
		const fileExists = fs.existsSync(fullPath);
		if (!fileExists) {
			logWarning(`No such file: [${fullPath}]`);
			return undefined;
		}
	} catch (err) {
		logError(err); // this should not error, so log it if it does
		return undefined;
	}

	let json;
	try {
		json = fs.readFileSync(fullPath, 'utf8');
	} catch (err) {
		logError(`Error reading from path [${fullPath}]: [${err}]`);
		return undefined;
	}

	let scoreArray;
	try {
		scoreArray = JSON.parse(json);
	} catch (err) {
		logError(`Error parsing score list data [${path}]: [${err}]`);
		return undefined;
	}

	if (typeof displayLimit !== 'number' || !displayLimit) displayLimit = 30;

	return new ScoreList(fullPath, scoreArray, displayLimit);
};

module.exports = getScoreList;
