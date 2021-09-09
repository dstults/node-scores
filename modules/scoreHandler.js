'use strict';

const ScoresList = require('../classes/ScoresList');
const Score = require('../classes/Score');

const loadScores = (query, res) => {
	if (query.list) {
		let score;
		if (query.name && query.score) {
			score = new Score(score.name, parseInt(score.score));
		} else {
			score = undefined;
		}

		const highScores = new ScoresList('./scores/' + query.list + '.txt', score);
		if (highScores.scores) {
			res.setHeader('Content-Type', 'application/json');
			res.write(JSON.stringify(highScores.scores));
		} else {
			res.write('Ain\'t nobody here but us chickens!');
		}
	} else {
		res.write('Are you sure you know what you\'re doing?');
	}
};

module.exports.loadScores = loadScores;
