'use strict';

const fs = require('fs');
const { log, logWarning, logError } = require('../logger');
const { makeRankChangeDetails } = require('./scoreChangeFactory');
const { shallowCompare } = require('../compareObjects');

const dataPath = require('../../config').dataPath;

/*
class ScoreList {
	constructor(filePath, rawScoreData, displayLimit) {
		this.filePath = filePath;
		this.scores = [];
		this.displayLimit = displayLimit;
		let score;
		for (let i = 0; i < rawScoreData.length; i++) {
			score = rawScoreData[i];
			score = createScoreUpdate(score.uid, score.name, score.score);
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

}
*/

/**
 * @param {string} path File name of the score file
 * @returns {ScoreList} a list of scores
 */
const getScoreData = (path, displayLimit = 10) => {
	if (!path) return undefined;
	if (typeof path !== 'string') return undefined;

	const fullPath = dataPath + '/scores/' + path + '.json';
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

	if (!displayLimit || typeof displayLimit !== 'number') {
		displayLimit = 10;
	}
	if (displayLimit !== -1) {
		scoreArray = scoreArray.splice(0, displayLimit);
	}

	return scoreArray;
};

const maxScoreCountLimit = 200;

const addUpdateToScores = (newScoreData, listData, listName, scoringAlogrithm) => {
	if (!newScoreData || !listData || !listName || !scoringAlogrithm) {
		if (!newScoreData) logError('addUpdateToScores passed undefined arg (score)');
		if (!listData) logError('addUpdateToScores passed undefined arg (scoreList)');
		if (!listName) logError('addUpdateToScores passed undefined arg (listName)');
		if (!scoringAlogrithm) logError('addUpdateToScores passed undefined arg (scoringAlgorithm)');
		return undefined;
	}

	// Get old stats
	const oldIndex = listData.findIndex(s => s.uid === newScoreData.uid);
	const oldRank = oldIndex === -1 ? undefined : listData[oldIndex].score === undefined ? undefined : oldIndex;
	const oldScore = oldRank === undefined ? undefined : listData[oldIndex].score;

	// Add new score and calculate its score
	if (oldIndex === -1) {
		listData.push({uid: newScoreData.uid});
		scoringAlogrithm(listData[listData.length - 1], newScoreData);
	} else {
		scoringAlogrithm(listData[oldIndex], newScoreData);
	}

	// Sort and save the score list
	sortAndSaveScoreList(listData, listName);

	// Get new rank and return formatted response
	const newIndex = listData.findIndex(s => s.uid === newScoreData.uid);
	const newRank = listData[newIndex].score === undefined ? undefined : newIndex;
	return makeRankChangeDetails(newScoreData.name, oldRank, oldScore, newRank, listData[newIndex].score);
};

const recalcAndResortList = (listData, listName, scoringAlogrithm) => {
	if (!listData || !listName || !scoringAlogrithm) {
		if (!listData) logError('recalcAndResortList passed undefined arg (scoreList)');
		if (!listName) logError('recalcAndResortList passed undefined arg (listName)');
		if (!scoringAlogrithm) logError('recalcAndResortList passed undefined arg (scoringAlgorithm)');
		return undefined;
	}

	for (let i = 0; i < listData.length; i++) {
		//let oldS = listData[i].score;
		scoringAlogrithm(listData[i]);
		//let newS = listData[i].score;
		//console.log(oldS + ' => ' + newS);
	}

	// Sort and save the score list
	sortAndSaveScoreList(listData, listName);

};

const sortAndSaveScoreList = (listData, listName) => {
	if (!listData || !listName) {
		logError('sortAndSaveScoreList passed undefined arg (listData and/or filePath)');
		return undefined;
	}

	// Sort in reverse order
	listData.sort((a, b) => {
		//if (a.score === undefined && b.score === undefined) return 0;
		if (a.score === b.score) return 0;
		if (a.score === undefined) return 1;
		if (b.score === undefined) return -1;

		return a.score <= b.score ? 1 : -1
	});

	// Save updated and sorted list
	if (listData.length > maxScoreCountLimit) listData = listData.splice(0, maxScoreCountLimit);
	fs.writeFile(dataPath + '/scores/' + listName + '.json', JSON.stringify(listData, null, '\t'), err => {
		if (err) {
			logError(`Error writing to path [${listName}]: [${err}]`);
		} else {
			log('File saved to: ' + listName);
		}
	});
};

const getPublic = (scoreList, publicOperation) => {
	return scoreList.filter(s => s.public).map(publicOperation);
};

module.exports.getScoreData = getScoreData;
module.exports.addUpdateToScores = addUpdateToScores;
module.exports.recalcAndResortList = recalcAndResortList;
module.exports.getPublic = getPublic;
