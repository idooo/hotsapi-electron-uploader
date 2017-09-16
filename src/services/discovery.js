const os = require('os');
const path = require('path');
const fs = require('fs');
const logger = require('winston');
const Storage = require('./storage');
const Constants = require('./../constants');

const OSX_ACCOUNTS_FOLDER = `${os.homedir()}/Library/Application Support/Blizzard/Heroes of the Storm/Accounts/`;
const WIN_ACCOUNTS_FOLDER = `${os.homedir()}\\Documents\\Heroes of the Storm\\Accounts\\`;
const REGEX_REPLAY_EXTENSION = /.*\.StormReplay$/;

/**
 * Discovers local replays
 */
class Discovery {

	async getReplays() {
		const database = await Storage.getLocalDatabase();
		const localReplays = this.getLocalReplays();

		localReplays.forEach(localReplay => {
			if (database.replays[localReplay.cacheName]) return;
			database.replays[localReplay.cacheName] = Object.assign({}, localReplay, {
				status: Constants.REPLAY_STATUS.NEW
			});
		});

		await Storage.saveLocalDatabase(database.replays);

		return database.replays;
	}

	getLocalReplays() {
		let accountsFolder = '';
		if (os.platform() === 'darwin') {
			accountsFolder = OSX_ACCOUNTS_FOLDER;
		}
		else if (os.platform() === 'win32') {
			accountsFolder = WIN_ACCOUNTS_FOLDER;
		}
		else {
			logger.error(`Unsupported platform ${os.platform()}`);
			alert('This platform is unsupported');
		}

		return this.getFilesRecursively(accountsFolder).filter(replay =>
			REGEX_REPLAY_EXTENSION.test(replay.fileName)
		);
	}

	getFilesRecursively(directory) {
		return fs.readdirSync(directory).reduce((files, file) => {
			const stats = fs.statSync(path.join(directory, file));
			return stats.isDirectory()
				? files.concat(this.getFilesRecursively(path.join(directory, file)))
				: files.concat({
						fullPath: path.join(directory, file),
						fileName: file,
						creationTime: stats.ctime.getTime(),
						cacheName: directory.replace(/\D/g, '') + file
					});
		}, []);
	}
}

module.exports = Discovery;
