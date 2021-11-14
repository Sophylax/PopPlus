async function onStartup() {
    console.debug("onStartup()");
    await config.initalize();
    await database.initalize();
}

async function onInstalled() {
    console.debug("onInstalled()");
    onStartup();
}

chrome.runtime.onStartup.addListener(onStartup);
chrome.runtime.onInstalled.addListener(onInstalled);