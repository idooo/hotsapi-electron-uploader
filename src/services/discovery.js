const os = require('os');
const path = require('path');
const fs = require('fs');
const Storage = require('./storage');
const Constants = require('./../constants');

const OSX_ACCOUNTS_FOLDER = `${os.homedir()}/Library/Application Support/Blizzard/Heroes of the Storm/Accounts/`;
const REGEX_REPLAY_EXTENSION = /.*\.StormReplay$/;

class Discovery {
	static getOS() {
		return os.platform();
	}

	async getReplays() {
		const database = await Storage.getLocalDatabase();
		const localReplays = this.__getLocalReplays();

		localReplays.forEach(localReplay => {
			if (database.replays[localReplay.cacheName]) return;
			database.replays[localReplay.cacheName] = Object.assign({}, localReplay, {
				status: Constants.REPLAY_STATUS.NEW
			});
		});

		await Storage.saveLocalDatabase(database.replays);

		return database.replays;
	}

	__getLocalReplays() {
		let accountsFolder = '';
		if (Discovery.getOS() === 'darwin') {
			accountsFolder = OSX_ACCOUNTS_FOLDER;
		}
		return this.__getFilesRecursively(accountsFolder).filter(replay =>
			REGEX_REPLAY_EXTENSION.test(replay.fileName)
		);
	}

	__getFilesRecursively(directory) {
		return fs.readdirSync(directory).reduce((files, file) => {
			const stats = fs.statSync(path.join(directory, file));
			return stats.isDirectory()
				? files.concat(this.__getFilesRecursively(path.join(directory, file)))
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
