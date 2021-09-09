'use strict';

const fs = require('fs');
const http = require("http");
const { URL } = require('url');
const queryString = require('querystring');
const ScoresList = require('./classes/ScoresList');
const Score = require('./classes/Score');

const listenPort = 3329;
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
		case "/death":
			console.log('Restarting server...');
			res.write(nullReply); // pretend nothing is happening to the outside
			server.close();
			break;
		case "/favicon.ico":
			res.writeHead(204);
			res.end();
			return;
		case "/scores":
			if (query.list) {
				let score;
				if (query.name && query.score) {
					console.log(`Detected new score: [${query.name}][${query.score}]`);
					score = new Score(score.name, parseInt(score.score));
				} else {
					score = undefined;
				}
				const highScores = new ScoresList('./scores/' + query.list + '.txt', score);
				if (highScores.scores) {
					res.setHeader('Content-Type', 'application/json');
					res.write(JSON.stringify(highScores.scores));
				} else {
					console.log(`Could not find list: [${query.list}]`);
				}
			}
			break;
		default:
			res.write(nullReply);
			break;
	}
	res.end();
});

server.listen(listenPort);
console.log(`Listening on port ${listenPort}...`);
