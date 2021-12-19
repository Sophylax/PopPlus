if (!parse.loginState(document)) {
    notification.addPageNotification(document, 'Redirector: Searching for Server')
    browser.runtime.sendMessage({
        type: "loggedSubdomain"
    }).then(function(lsMessage) {
        var subdomain = lsMessage.result;
        if (subdomain != 0) {
            notification.addPageNotification(document, `Redirecting to ${subdomain}...`)
            window.location.replace(`https://${subdomain}.popmundo.com/World/Popmundo.aspx`);
        } else {
            browser.runtime.sendMessage({
                type: "credentials"
            }).then(function(credMessage) {
                var credentials = credMessage.result;
                if (credentials == undefined) {
                    notification.addPageNotification(document, 'No Server Found')
                } else {
                    notification.addPageNotification(document, 'Attempting Auto-Login')
                    browser.runtime.sendMessage({
                        type: "login"
                    }).then(function(loginMessage) {
                        var loggedSubdomain = loginMessage.result;
                        if (loggedSubdomain != 0) {
                            notification.addPageNotification(document, `Redirecting to ${loggedSubdomain}...`)
                            window.location.replace(`https://${loggedSubdomain}.popmundo.com/World/Popmundo.aspx`);
                        } else {
                            notification.addPageNotification(document, 'Auto-Login Failed')
                        }
                    });
                }
            });

        }
    });
}