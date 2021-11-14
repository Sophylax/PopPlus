//Database library for PopPlus
//	Like Configuration library, this is for presistent storage but with key differencese
//	Database is kept at chrome.local storage, due to its growing nature
//	There are a lot of information in popmundo that is very persistent so we keep them here to avoid re-parsing pages
//	Like Configuration library, we keep a local copy for ease, updates reflect to local copy
//	Unlike that we initialize everything and there is no default value
//	We also keep track of when an item is updated, if the script needs some values to be expired

database = {
    //This is what this library maintains
    values: {},
    timestamps: {},

    //Called once at setup, this thing populates our local copy from chrome.local
    initalize: async function() {
        this.values = await promiseLocalGet('database_values').catch(() => ({}));
        this.timestamps = await promiseLocalGet('database_timestamps').catch(() => ({}));
    },

    //A lot of the times we involve this library to check if we know something already
    //	and if we don't then we actively retrieve it, usually asynchronously
    //	so that's what this function does in a generic level
    //	memoize(k1,k2,...,aFunction)
    memoize: async function() {
        var keys = Array.from(arguments);
        var aFunction = keys.pop();
        var value = this.get(...keys);
        if (value === undefined) {
            value = await aFunction();
            this.set(...keys, value);
        }
        return value;
    },

    //Retreive value from local copy
    //	get(k1,k2,...)
    get: function() {
        var keys = Array.from(arguments);
        var cursor = this.values;
        for (const key of keys) {
            cursor = cursor[key];
            if (cursor === undefined)
                return cursor;
        }
        return cursor;
    },

    //Retreive timestamp for a local copy
    //	getTimestamp(k1,k2,...)
    getTimestamp: function() {
        var keys = Array.from(arguments);
        var cursor = this.timestamps;
        for (const key of keys) {
            cursor = cursor[key];
            if (cursor === undefined)
                return cursor;
        }
        return cursor;
    },

    //Update local and chrome.local copy
    //	set(k1,k2,...,val)
    set: function() {
        var keys = Array.from(arguments);
        var value = keys.pop();
        var value_cursor = this.values;
        var stamp_cursor = this.timestamps;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (i == keys.length - 1) {
                value_cursor[key] = value;
                stamp_cursor[key] = new Date();
            } else if (value_cursor[key] === undefined) {
                value_cursor[key] = {};
            } else if (stamp_cursor[key] === undefined) {
                stamp_cursor[key] = {};
            }
            value_cursor = value_cursor[key];
            stamp_cursor = value_cursor[key];
        }
        chrome.storage.local.set({ 'database_values': this.values });
        chrome.storage.local.set({ 'database_timestamps': this.timestamps });
    }
}