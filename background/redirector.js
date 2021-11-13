chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var origurl = details.url;
        if (session.server == 0) {
            return {redirectUrl: origurl}
        }

        return {
            redirectUrl: 'https://' + session.server + '.popmundo.com/World/Popmundo.aspx'
        }
    },
    {urls: ["https://www.popmundo.com/*", "https://popmundo.com/*"], types: ['main_frame']},
    ['blocking']
);