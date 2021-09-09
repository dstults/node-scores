'use strict';

const { validateName } = require('../stringHelpers');

class Score {
	constructor(uid, name, score) {
		this.uid = uid;
		this.name = name;
		this.score = score;
	}

	getPublic() {
		const output = {};
		output.name = this.name;
		output.score = this.score;
		return output;
	}
}

/**
 * @param {string} name - The winner of the score
 * @param {number} score - The winning score
 * @param {string} uid - Unique data to prevent double entries, 20 chars long
 * @returns {Score} the score value
 */
const createScore = (uid, name, score) => {
	if ((typeof uid !== 'string')) return undefined;
	if (uid.length !== 20) return undefined;
	name = validateName(name);
	return new Score(uid, name, score);
};

module.exports = createScore;
