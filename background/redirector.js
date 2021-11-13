//Redirecting logic for auto-logging in
//  We need to do some async checking to see if we are logged in
//  And if we aren't optionally do log in if we have credentials
//  Problem is onBeforeRequest won't do asnyc stuff to modify request
//  So we use it as a trigger point for an async call and then use
//  the tabs API to change the tab URL to the logged in subdomain
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        (async () => {
            const {tabId} = details;
            if (!await session.findLoggedSubdomain()) {
                await session.login();
            }
            if (session.server !== 0) {
                chrome.tabs.update(tabId, {url: 'https://' + session.server + '.popmundo.com/World/Popmundo.aspx'});
            }
        })();
    },
    {urls: ["https://www.popmundo.com/*", "https://popmundo.com/*"], types: ['main_frame']}
);