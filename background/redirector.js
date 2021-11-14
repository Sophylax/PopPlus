function generateCustomNotificationCode(text) {
    return `var o = '<div class="notification-real notification-error">${text}</div>';
    document.getElementById('notifications').insertAdjacentHTML('beforeend', o)
    document.querySelector("#notifications > div:last-child").style.filter = 'hue-rotate(210deg)'
    document.querySelector("#notifications > div:first-child").hidden = true`
}

function sendCustomNotification(tabId, text) {
    chrome.tabs.executeScript(
        tabId, { code: generateCustomNotificationCode(text) }
    );
}

//Redirecting logic for auto-logging in
//  We need to do some async checking to see if we are logged in
//  And if we aren't optionally do log in if we have credentials
//  Problem is onBeforeRequest won't do asnyc stuff to modify request
//  So we use it as a trigger point for an async call and then use
//  the tabs API to change the tab URL to the logged in subdomain
chrome.webNavigation.onCompleted.addListener(
    function(details) {
        (async() => {
            const { tabId } = details;
            sendCustomNotification(tabId, 'Login Redirector is Running')
            if (!await session.findLoggedSubdomain()) {
                sendCustomNotification(tabId, 'No Login Found, attempting Login')
                await session.login();
            }
            if (session.server !== 0) {
                sendCustomNotification(tabId, 'Redirecting...')
                chrome.tabs.update(tabId, { url: 'https://' + session.server + '.popmundo.com/World/Popmundo.aspx' });
            }
        })();
    }, { url: [{ hostEquals: 'www.popmundo.com' }, { hostEquals: 'popmundo.com' }] }
);