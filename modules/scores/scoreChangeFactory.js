'use strict';

const { rankWithSuffix } = require('../stringHelpers');

class RankChangeDetails {
	constructor(name, oldRank, oldScore, newRank, newScore) {
		this.name = name;
		this.oldRank = oldRank;
		this.oldScore = oldScore;
		this.newRank = newRank;
		this.newScore = newScore;
		if (oldRank > 0) {
			if (newRank < oldRank) { // low is high -- ranking "1st" place is better than "2nd"
				this.message = `Congratulations, ${name}! Your ranking went up from [ ${rankWithSuffix(oldRank)} ] place to [ ${rankWithSuffix(newRank)} ] place!`;
			} else if (newRank === oldRank) {
				this.message = `Congratulations, ${name}! Your ranking is still at [ ${rankWithSuffix(oldRank)} ] place!`;
			} else if (newRank > oldRank) {
				this.message = `Congratulations, ${name}! Your ranking has dropped from [ ${rankWithSuffix(oldRank)} ] place to [ ${rankWithSuffix(newRank)} ] place, keep trying hard!`;
			}
		} else {
			this.message = `Congratulations, ${name}! Your ranking is [ ${rankWithSuffix(newRank)} ]!`;
		}
	}
}

const makeRankChangeDetails = (name, oldRank, oldScore, newRank, newScore) => {
	oldRank++; // base 1 for viewer consumption
	newRank++; // base 1 for viewer consumption
	return new RankChangeDetails(name, oldRank, oldScore, newRank, newScore);
}

module.exports.makeRankChangeDetails = makeRankChangeDetails;
