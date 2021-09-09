'use strict';

const randomUID = () => {
	const length = 20;
	const result = [];
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (var i = 0; i < length; i++) {
		result.push(chars.charAt(Math.floor(Math.random() * chars.length)));
	}
	return result.join('');
};

const validateName = (name) => {
	const length = 24;
	name = name.replace( /[^0-9a-zA-Z ]/g, '');
	name = name.replace( /  /g, ' ');
	if (name.length > length) name = name.substr(0, length);
	return name;
};

const rankWithSuffix = (rank) => {
	const rankTens = parseInt(rank) % 100;
	switch (rankTens) {
		case 1:
		case 21:
		case 31:
		case 41:
		case 51:
		case 61:
		case 71:
		case 81:
		case 91:
			return rank + 'st';
		case 2:
		case 22:
		case 32:
		case 42:
		case 52:
		case 62:
		case 72:
		case 82:
		case 92:
			return rank + 'nd';
		case 3:
		case 23:
		case 33:
		case 43:
		case 53:
		case 63:
		case 73:
		case 83:
		case 93:
			return rank + 'rd';
		default:
			return rank + 'th';
	}
};

module.exports.randomUID = randomUID;
module.exports.validateName = validateName;
module.exports.rankWithSuffix = rankWithSuffix;
