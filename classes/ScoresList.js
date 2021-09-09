'use strict';

const fs = require('fs');
const Score = require('./Score');

class ScoresList {
	constructor(src, score) {
		if (!src) {
			console.error('Cannot create a scores list without a source path!');
		} else if (typeof src === 'string') {
			this.filePath = src;
			this.loadFile();
			if (Array.isArray(score))
				this.scores = score;
			else if (score instanceof Score)
				this.scores.push(score);
			else if (score)
				console.error(`Bad score data: [${score}]`);
			this.sortAndSlice();
			if (score instanceof Score)
				this.saveFile();
		} else {
			console.error('Error: Unexpected parameters.');
		}
	}

	sortAndSlice = () => {
		if (this.scores) {
			// a < b  -- because we want higher first
			// a <= b -- because we want older first
			this.scores.sort((a, b) => a.score <= b.score ? 1 : -1);
			if (this.scores.length > 30) this.scores = this.scores.splice(0, 30);
		}
	};

	loadFile = () => {
		if (!this.filePath) {
			console.error('Error: Attempted to load score data without a file path!');
			return;
		}
		try {
			const data = fs.readFileSync(this.filePath, 'utf8')
			this.scores = JSON.parse(data);
			//console.log('File loaded successfully: ' + this.filePath);
		} catch (err) {
			console.error(`Error reading from path [${this.filePath}]: [${err}]`);
		}
	};

	saveFile = () => {
		if (!this.filePath) {
			console.error('Error: Attempted to save score data without a file path!');
			return;
		}
		if (!this.scores) {
			console.error('Error: Attempted to save score data without score data!');
			return;
		}
		fs.writeFile(this.filePath, JSON.stringify(this.scores), err => {
			if (err) {
				console.error(`Error writing to path [${this.filePath}]: [${err}]`);
			} else {
				console.log('File saved to: ' + this.filePath);
			}
		});
		console.error()
	};
}

module.exports = ScoresList;
