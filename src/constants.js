const REPLAY_STATUS = {
	NEW: 'InQueue',
	UPLOAD_ERROR: 'UploadError',
	UNKNOWN: 'UnknownCode',
	UPLOADING: 'Uploading',

	// API status mappings
	Success: 'Success',
	Duplicate: 'Duplicate',
	AiDetected: 'AiDetected',
	CustomGame: 'CustomGame',
	PtrRegion: 'PtrRegion',
	TooOld: 'TooOld',
	Incomplete: 'Incomplete'
};

module.exports = {
	REPLAY_STATUS
};
