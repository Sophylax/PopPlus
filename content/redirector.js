if (!parse.loginState(document)) {
    notification.addPageNotification(document, 'PopPlus: Login Redirector Running')
    browser.runtime.sendMessage({
        type: "loggedSubdomain"
    }).then(function(message) {
        var subdomain = message.result;
        if (subdomain == 0) {
            notification.addPageNotification(document, 'PopPlus: Login Failed')
        } else {
            notification.addPageNotification(document, 'PopPlus: Redirecting...')
            window.location.replace(`https://${subdomain}.popmundo.com/World/Popmundo.aspx`);
        }
    });
}