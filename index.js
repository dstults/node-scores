'use strict';

const fs = require('fs');
const IconReplies = require('./modules/iconReplies');
const ScoreHandler = require('./modules/scoreHandler');

const http = require("http");
const queryString = require('querystring');

const listenPort = 3000;
const healthReply = '1';
const nullReply = "It's a secret to everybody.";

const getTimestamp = () => {
	const d = new Date();
	let year = '' + d.getFullYear();
	let month = '' + (d.getMonth() + 1);
	let day = '' + d.getDate();
	let hour = '' + d.getHours();
	let minute = '' + d.getMinutes();
	let second = '' + d.getSeconds();

	while (year.length < 4)
		year = '0' + year;
	while (month.length < 2)
		month = '0' + month;
	while (day.length < 2)
		day = '0' + day;
	while (hour.length < 2)
		hour = '0' + hour;
	while (minute.length < 2)
		minute = '0' + minute;
	while (second.length < 2)
		second = '0' + second;

	return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const logMe = (appendLog, message) => {
	if (!message.includes('favicon.ico')) {
		console.log(message);

		if (appendLog) {
			fs.appendFile('logs.txt', message + '\n', function (err) {
				if (err)
					console.log(err);
			});
		}
	}
}

const server = http.createServer((req, res) => {

	const clientAddress = req.socket.address();
	logMe(false, `[${getTimestamp()}] << [${clientAddress.address}:${clientAddress.port}] [${req.method}] [${req.headers.host}${req.url}]`);

	const urlData = new URL('http://' + req.headers.host + req.url);
	const query = queryString.parse(urlData.search.substr(1)); // remove leading ? and parse

	switch (urlData.pathname) {
		case "/health":
			res.write(healthReply);
			break;
		case "/favicon.ico":
			IconReplies.serve204(res);
			return;
		case "/scores":
			ScoreHandler.loadScores(query, res);
			break;
		default:
			res.write(nullReply);
			break;
	}
	res.end();
});

server.listen(listenPort);

console.log(`Listening on port ${listenPort}...`);
