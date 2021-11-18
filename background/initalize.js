async function onStartup() {
    console.debug("onStartup()");
    await config.initalize();
    await database.initalize();
}

async function onInstalled() {
    console.debug("onInstalled()");
    onStartup();
}

browser.runtime.onStartup.addListener(onStartup);
browser.runtime.onInstalled.addListener(onInstalled);