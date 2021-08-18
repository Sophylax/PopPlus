//Configuration library for PopPlus
//	This stuff is kept at sync storage, for safekeeping
//	But I hate how it needs to be read async, so we also keep a second copy for easy retrieval
//	Any updates to the config is reflected to sync storage and we read the sync storage only once
//	Also if no config is there, we store the defaults

config = {
	//This is what this library maintains
	localcopy: {},

	//Stuff to look up from Sync storage, and their defaults
	storage_list: [
		['rateLimit', 500],
		['credentials',
			{
				username: 'SlayerX',
				password: '@e7^LBl9K8uY',
				status: 3
			}],
		['gymRatConfig',
			{
				enabled: false,
				gymFocus: 6,
				fallbackFocus: 18
			},],
		['spinDoctorConfig',
			{
				enabled: false,
				mediaFocus: 9,
				fallbackFocus: 8
			}],
	],

	//Called once at setup, this thing populates our local copy from sync
	//	If they are missing, sets them up as defaults.
	initalize: async function () {
	  for (const [key,def] of this.storage_list) {
	  	var getPromise = promiseSyncGet(key);
	  	var value = await getPromise.catch(() => def);
	  	if (await getPromise.then(()=>false,()=>true)) //Clowning around to see if it got rejected
	  		chrome.storage.sync.set({[key]: value});
		this.localcopy[key] = value;
	  }
	},

	//Retreive value from local copy
	//	If none exists, check defaults in case of non-initialization
	get: function (key) {
		if (key in this.localcopy)
			return this.localcopy[key];
		else {
			var index = this.storage_list.map((kv) => kv[0]).indexOf(key);
			if (index >= 0)
				return this.storage_list[index][1];
			else
				return undefined;
		}
	},

	//Update local and sync copy
	set: function (key, value) {
		this.localcopy[key] = value;
		chrome.storage.sync.set({[key]: value});
	}
}