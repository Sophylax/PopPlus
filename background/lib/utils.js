//Promisified sync get, because I hate callback functions
function promiseSyncGet(key) {
  return new Promise(function(resolve, reject) {
	chrome.storage.sync.get(key, function(items) {
	  if (chrome.runtime.lastError) {
		console.error(chrome.runtime.lastError.message);
		reject(chrome.runtime.lastError.message);
	  } else {
		resolve(items[key]);
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
        resolve(items[key]);
      }
    });
  });
}