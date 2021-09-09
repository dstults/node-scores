'use strict';

const deepCompare = (object1, object2) => {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);

	if (keys1.length !== keys2.length)
		return false;

	for (const key of keys1) {
		const val1 = object1[key];
		const val2 = object2[key];
		const areObjects = isObject(val1) && isObject(val2);
		if (areObjects && !deepCompare(val1, val2) || !areObjects && val1 !== val2) {
			return false;
		}
	}

	return true;
};

const shallowCompare = (object1, object2) => {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);

	if (keys1.length !== keys2.length)
		return false;

	for (let key of keys1)
		if (object1[key] !== object2[key])
			return false;

	return true;
};

module.exports.deepCompare = deepCompare;
module.exports.shallowCompare = shallowCompare;
