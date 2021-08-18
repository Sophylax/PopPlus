function onStartup() {
  console.debug("onStartup()");
}

function onInstalled() {
  console.debug("onInstalled()");
  onStartup();
}

chrome.runtime.onStartup.addListener(onStartup);
chrome.runtime.onInstalled.addListener(onInstalled);