'use strict'

module.exports = {
	listenPort: 3329,
	productionMode: true, // false => defaults to designated subdomain
	testModeDefaultSubdomain: 'api',
	nullResponseMessage: "It's a secret to everybody.",
	logPath: '../logs',
	dataPath: '../data',
}
