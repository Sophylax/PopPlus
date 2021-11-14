//Promisified sync get, because I hate callback functions
function promiseSyncGet(key) {
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get(key, function(items) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            } else {
                if (key === null) {
                    resolve(items);
                } else if (items[key] === undefined) {
                    reject('Value does not exist in sync storage');
                } else {
                    resolve(items[key]);
                }
            }
        });
    });
}

//See above
function promiseLocalGet(key) {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(key, function(items) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                reject(chrome.runtime.lastError.message);
            } else {
                if (key === null) {
                    resolve(items);
                } else if (items[key] === undefined) {
                    reject('Value does not exist in local storage');
                } else {
                    resolve(items[key]);
                }
            }
        });
    });
}

function isEmpty(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}