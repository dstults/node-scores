'use strict';

const fs = require('fs');
const { getScoreData, addUpdateToScores, getPublic, recalcAndResortList } = require('./scoreListFactory');
const { log, logWarning, logError } = require('../logger');

const dataPath = require('../../config').dataPath;

const checkModuleAndListExists = (listName) => {
	if (!fs.existsSync('./modules/scores/list-' + listName + '.js')) {
		logWarning(`Could not find data module file for list[${listName}]`);
		return;
	}
	if (!fs.existsSync(dataPath + '/scores/' + listName + '.json')) {
		fs.writeFileSync(dataPath + '/scores/' + listName + '.json', '[]');
	}

	return true;
};

const sendScores = (res, query, limit) => {
	if (!query.list) {
		logWarning('Scores ran without list query set.');
		res.nullResponse();
		return;
	}

	if (!checkModuleAndListExists(query.list)) {
		res.nullResponse();
		return;
	}

	const highScores = getScoreData(query.list, limit);
	if (!highScores) {
		logWarning('Score list: [' + query.list + '] not found or unable to load!');
		res.nullResponse();
	}

	const { publicOperation } = require('./list-' + query.list);
	res.write(JSON.stringify(getPublic(highScores, publicOperation)));
	res.end();
};

const updateScores = (res, query) => {
	if (!query.list || !query.uid) {
		logError(`Invalid score update query.`);
		res.nullResponse();
		return;
	}

	if (!checkModuleAndListExists(query.list)) {
		res.nullResponse();
		return;
	}

	const { validateInput, scoringAlogrithm } = require('./list-' + query.list);
	if (!validateInput(query)) {
		logWarning(`Could not validate query info to generate update data for list[${query.list}].`);
		res.nullResponse();
		return;
	}

	log(`Detected valid score update: [${query.list}][${query.uid}]`);
	const rawScoreData = getScoreData(query.list, -1);
	if (!rawScoreData) {
		logWarning(`Attempted to update a non-existent score list[${query.list}]`);
		res.nullResponse();
		return;
	}

	const rankChangeDescription = addUpdateToScores(query, rawScoreData, query.list, scoringAlogrithm);
	if (!rankChangeDescription) {
		logWarning(`Could not update score list[${query.list}] with data from query uid[${query.uid}]`);
		res.nullResponse();
		return;
	}
		
	if (rankChangeDescription.oldRank) {
		log(`Score list: list[${query.list}] updated, [${query.name}] went from rank[${rankChangeDescription.oldRank}] to rank[${rankChangeDescription.newRank}].`);
	} else if (rankChangeDescription.newRank) {
		log(`Score list: list[${query.list}] updated, [${query.name}] was added at rank[${rankChangeDescription.newRank}].`);
	} else {
		log(`Score list: list[${query.list}] updated, [${query.name}] is currently unranked.`);
	}
	res.write(JSON.stringify(rankChangeDescription));
	res.end();
	return;
};

const recalcScores = (res, query) => {
	if (!query.list) {
		logError(`Invalid score recalc query.`);
		res.nullResponse();
		return;
	}

	if (!checkModuleAndListExists(query.list)) {
		res.nullResponse();
		return;
	}

	const rawScoreData = getScoreData(query.list, -1);
	if (!rawScoreData) {
		logWarning(`Attempted to recalc a non-existent score list[${query.list}]`);
		res.nullResponse();
		return;
	}

	const { scoringAlogrithm } = require('./list-' + query.list);
	recalcAndResortList(rawScoreData, query.list, scoringAlogrithm);

	const response = {};
	response.message = 'Scores recalculated and order updated!';
	res.write(JSON.stringify(response));
	res.end();
	return;
};

module.exports.sendScores = sendScores;
module.exports.updateScores = updateScores;
module.exports.recalcScores = recalcScores;
