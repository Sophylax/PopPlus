//Database library for PopPlus
//	Like Configuration library, this is for presistent storage but with key differencese
//	Database is kept at chrome.local storage, due to its growing nature
//	There are a lot of information in popmundo that is very persistent so we keep them here to avoid re-parsing pages
//	Like Configuration library, we keep a local copy for ease, updates reflect to local copy
//	Unlike that we initialize everything and there is no default value

database = {
	//This is what this library maintains
	localcopy: {},

	//Called once at setup, this thing populates our local copy from chrome.local
	initalize: async function () {
		this.localcopy = await promiseLocalGet(null);
	},

	//A lot of the times we involve this library to check if we know something already
	//	and if we don't then we actively retrieve it, usually asynchronously
	//	so that's what this function does in a generic level
	//	memoize(k1,k2,...,aFunction)
	memoize: async function () {
		var keys = Array.from(arguments);
		var aFunction = keys.pop();
		var value = this.get(...keys);
		if (value === undefined){
			value = await aFunction();
			this.set(...keys,value);
		}
		return value;
	},

	//Retreive value from local copy
	//	get(k1,k2,...)
	get: function () {
		var keys = Array.from(arguments);
		var value = this.localcopy;
		for (const key of keys){
			value = value[key];
			if (value === undefined)
				return value;
		}
		return value;
	},

	//Update local and chrome.local copy
	//	set(k1,k2,...,val)
	set: function () {
		var keys = Array.from(arguments);
		var value = keys.pop();
		var prev = this.localcopy;
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			if (i == keys.length - 1) {
				prev[key] = value;
			}
			else if (prev[key] === undefined)
				prev[key] = {};
			prev = prev[key];
		}
		chrome.storage.local.set({[keys[0]]: this.localcopy[keys[0]]});
	}
}