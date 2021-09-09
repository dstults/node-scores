'use strict';

const getTimestamp = (d) => {
	if (!d) d = new Date();

	let year = '' + d.getFullYear();
	let month = '' + (d.getMonth() + 1);
	let day = '' + d.getDate();
	let hour = '' + d.getHours();
	let minute = '' + d.getMinutes();
	let second = '' + d.getSeconds();

	while (year.length < 4) year = '0' + year;
	while (month.length < 2) month = '0' + month;
	while (day.length < 2) day = '0' + day;
	while (hour.length < 2) hour = '0' + hour;
	while (minute.length < 2) minute = '0' + minute;
	while (second.length < 2) second = '0' + second;

	return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const getCompactDatestamp = (d) => {
	if (!d) d = new Date();

	let year = '' + d.getFullYear();
	let month = '' + (d.getMonth() + 1);
	let day = '' + d.getDate();

	while (year.length < 4) year = '0' + year;
	while (month.length < 2) month = '0' + month;
	while (day.length < 2) day = '0' + day;

	return `${year}${month}${day}`;
};

module.exports.getTimestamp = getTimestamp;
module.exports.getCompactDatestamp = getCompactDatestamp;
