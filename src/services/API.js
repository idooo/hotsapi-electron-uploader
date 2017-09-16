const fs = require('fs');
const request = require('request');
const logger = require('winston');
const Constants = require('./../constants');
const packageInfo = require('../../package.json');

const PREFIX = 'http://hotsapi.net/api/v1';
const UPLOAD_ENDPOINT = '/replays';
const USER_AGENT = `HotsAPI Electron Uploader (version ${packageInfo.version})`;

class API {
	/**
	 *
	 * @param {Object} replay
	 * @returns {Promise<Object>}
	 */
	static async uploadReplay(replay) {
		const options = {
			url: `${PREFIX}${UPLOAD_ENDPOINT}`,
			headers: {
				'User-Agent': USER_AGENT
			},
			formData: {
				file: fs.createReadStream(replay.fullPath)
			}
		};

		return new Promise(resolve => {
			logger.info(`Uploading: ${replay.fullPath}`);
			request.post(options, (err, resp, body) => {
				if (err) {
					logger.error(`Failed to upload: ${replay.fullPath}`, err);
					return resolve(
						Object.assign({}, replay, {
							status: Constants.REPLAY_STATUS.UPLOAD_ERROR
						})
					);
				}
				try {
					const parsedBody = JSON.parse(body);
					logger.info(`Uploaded: ${replay.fullPath} - body`);
					return resolve(
						Object.assign({}, replay, {
							status:
								Constants.REPLAY_STATUS[parsedBody.status] ||
								Constants.REPLAY_STATUS.UNKNOWN
						})
					);
				} catch (err) {
					logger.error(`Failed to parse response: ${replay.fullPath}`, err);
					return resolve(
						Object.assign({}, replay, {
							status: Constants.REPLAY_STATUS.UNKNOWN
						})
					);
				}
			});
		});
	}
}

module.exports = API;
