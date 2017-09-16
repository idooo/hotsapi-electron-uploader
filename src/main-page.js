const angular = require('angular');
const moment = require('moment');
const shell =  require('electron').shell;
const logger = require('./services/logging')('info');
const Constants = require('./constants');
const Discovery = require('./services/discovery');
const Storage = require('./services/storage');
const API = require('./services/API');

const discovery = new Discovery();

const LOCAL_DATABASE_UPDATE_INTERVAL = 10 * 1000;

logger.info('Application has been started');
angular.module('hotsapiReplayUploader', []).controller('app', pageController);

function pageController($scope, $interval) {

	this.replays = [];
	this.updatedReplays = {};
	this.stats = {};

	// Recursive function to upload replays one by one
	// Probably we can group them and upload N in parallel but let's not stress test API
	this.uploadReplay = (replayNumber = 0) => {
		// Check if we done all the replays we have and exit
		if (replayNumber >= this.replays.length) {
			return;
		}

		// Upload only new replays
		if (this.replays[replayNumber].status !== Constants.REPLAY_STATUS.NEW) {
			return this.uploadReplay(replayNumber + 1);
		}

		// Set status to "in progress"
		this.replays[replayNumber].status = Constants.REPLAY_STATUS.UPLOADING;
		$scope.$digest();

		API.uploadReplay(this.replays[replayNumber]).then(result => {
			this.replays[replayNumber].status = result.status;
			this.updatedReplays[result.cacheName] = result;

			this.updateStats();

			// Upload next replay
			this.uploadReplay(replayNumber + 1);

			// Update Angular view
			$scope.$digest();
		});
	};

	this.updateStats = () => {
		this.stats = {
			inQueue: 0,
			uploaded: 0,
			total: 0
		};
		this.replays.forEach(replay => {
			this.stats.total++;
			if (replay.status === Constants.REPLAY_STATUS.NEW) this.stats.inQueue++;
			else if (replay.status === Constants.REPLAY_STATUS.SUCCESS) this.stats.uploaded++;
		})
	};

	this.openHelp = (href) => {
		shell.openExternal(href);
	};

	discovery.getReplays().then(replays => {
		Object.keys(replays).forEach(replayKey => {
			replays[replayKey].fromNow = moment(
				replays[replayKey].creationTime
			).fromNow();
			this.replays.push(replays[replayKey]);
		});
		this.replays = this.replays.sort((a, b) => b.creationTime - a.creationTime);

		this.updateStats();

		$scope.$digest();
		this.uploadReplay();
	});

	$interval(() => {
		if (!Object.keys(this.updatedReplays).length) {
			return;
		}

		logger.info(
			`${Object.keys(this.updatedReplays)
				.length} replays to save to local storage`
		);

		logger.info(this.updatedReplays);
		Storage.getLocalDatabase().then(localDatabase => {
			const updatedReplaykeys = Object.keys(this.updatedReplays);
			updatedReplaykeys.forEach(replayKey => {
				localDatabase.replays[replayKey] = this.updatedReplays[replayKey];
			});

			Storage.saveLocalDatabase(localDatabase.replays).then(() => {
				updatedReplaykeys.forEach(replayKey => {
					delete this.updatedReplays[replayKey];
				});
			});
		});
	}, LOCAL_DATABASE_UPDATE_INTERVAL);
}
