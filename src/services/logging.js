const winston = require('winston');
const path = require('path');
const electron = require('electron');
const app = electron.app || electron.remote.app;
const userData = app.getPath('userData');

const RE_STACK_REPLACE = /(^[^\(]+?[\n$]|^\s+at\s+)/gm;

module.exports = function Logger(level) {
	winston.remove(winston.transports.Console);

	winston.add(winston.transports.File, {
		level: level,
		json: false,
		timestamp() {
			const date = new Date();
			return (
				('0' + date.getHours()).slice(-2) +
				':' +
				('0' + date.getMinutes()).slice(-2) +
				':' +
				('0' + date.getSeconds()).slice(-2) +
				'.' +
				('00' + date.getMilliseconds()).slice(-3) +
				' ' +
				('0' + date.getDate()).slice(-2) +
				'/' +
				('0' + (date.getMonth() + 1)).slice(-2) +
				'/' +
				date.getFullYear()
			);
		},
		formatter(options) {
			return (
				winston.config.colorize(
					options.level,
					(options.level.toUpperCase() + '  ').slice(0, 5)
				) +
				': ' +
				this.timestamp() +
				' - ' +
				getLastStack() +
				' - ' +
				options.message +
				getMeta(options)
			);
		},
		filename: path.join(userData, 'application.log')
	});

	function getMeta(options) {
		if (Object.keys(options.meta).length) {
			if (options.meta.stack) return ' - ' + options.meta.stack;
			return ' - ' + JSON.stringify(options.meta);
		}
		return '';
	}

	function getLastStack() {
		const e = new Error('dummy');

		return (
			e.stack.replace(RE_STACK_REPLACE, '').split('\n').splice(10, 1)[0] ||
			'Application'
		);
	}

	return winston;
};
