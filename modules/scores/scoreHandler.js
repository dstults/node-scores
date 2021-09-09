'use strict';

const makeScore = require('./scoreFactory');
const getScoreList = require('./scoreListFactory');
const { log, logWarning, logError } = require('../logger');
const { validateName } = require('../stringHelpers');

const sendScores = (res, query, limit) => {
	if (query.list) {
		const highScores = getScoreList(query.list, limit);
		if (highScores) {
			res.write(JSON.stringify(highScores.getPublic()));
			res.end();
		} else {
			logWarning('Score list: [' + query.list + '] not found or unable to load!');
			global.nullResponse();
		}
	} else {
		logWarning('Scores ran without list query set.');
		global.nullResponse();
	}
};

const updateScores = (res, query) => {
	if (query.name)	query.name = validateName(query.name);
	
	if (query.list && query.uid && query.name && query.score) {
		log(`Detected new score: [${query.uid}][${query.name}][${query.score}]`);
		const score = makeScore(query.uid, query.name, parseInt(query.score));
		if (!score) {
			logWarning(`Score update failed due to invalid score: uid[${query.uid}] name[${query.name}] score[${query.score}]`);
			global.nullResponse();
			return;
		}

		const scoreList = getScoreList(query.list);
		if (!scoreList) {
			logWarning(`Attempted to update a non-existent score list: list[${query.list}]`);
			global.nullResponse();
			return;
		}

		const rankChangeDescription = scoreList.addEntry(score);
		if (rankChangeDescription) {
			if (rankChangeDescription.oldRank) {
				log(`Score list: list[${query.list}] updated, [${query.name}] went from rank[${rankChangeDescription.oldRank}] to rank[${rankChangeDescription.newRank}].`);
			} else {
				log(`Score list: list[${query.list}] updated, [${query.name}] was added at rank[${rankChangeDescription.newRank}].`);
			}
			res.write(JSON.stringify(rankChangeDescription));
			res.end();
			return;
		} else {
			logError(`Score update failed while trying to update list: list[${query.list}]`);
			global.nullResponse();
			return;
		}
	} else {
		logWarning(`Score update missing query data: list[${query.list}] uid[${query.uid}] name[${query.name}] score[${query.score}]`);
		global.nullResponse();
		return;
	}
};

module.exports.sendScores = sendScores;
module.exports.updateScores = updateScores;
