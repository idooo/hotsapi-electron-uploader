const storage = require('electron-storage');
const logger = require('winston');

const STORAGE_VERSION = 1;
const STORAGE_FILE = 'upload-data.json';

class Storage {
	static async getLocalDatabase() {
		const isStorageExist = await storage.isPathExists(STORAGE_FILE, undefined);
		if (!isStorageExist) {
			logger.info("Storage doens't exist. Creating now...");
			return await Storage.saveLocalDatabase({});
		}
		const storageData = await storage.get(STORAGE_FILE, undefined);

		// TODO implement migration
		if (storageData.version !== STORAGE_VERSION) {
			logger.info("Storage doens't match app's version. Creating new...");
			return await Storage.saveLocalDatabase({});
		}
		return await storage.get(STORAGE_FILE, undefined);
	}

	static async saveLocalDatabase(replays) {
		logger.info('Saving data to the storage...');
		await storage.set(
			STORAGE_FILE,
			{ replays, version: STORAGE_VERSION },
			undefined
		);
		return { replays, version: STORAGE_VERSION };
	}
}

module.exports = Storage;
