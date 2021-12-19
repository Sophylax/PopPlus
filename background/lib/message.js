//Messaging Library for Background Scripts
//Generally custom made for each messaging purpose

//Retrieve Confirmed Logged in Subdomain
function contentRequestsLoggedSubdomain() {
    return session.findLoggedSubdomain().then((loginState) => {
        return { result: session.server }
    });
}

function contentRequestsCredentials(sendResponse) {
    sendResponse({ result: config.get('credentials') })
}

function contentRequestsLogin() {
    return session.login().then((loginSuccess) => {
        return { result: session.server }
    });
}

function contentRequestsBankAccountDetails(request) {
    var accountId = request.accountId;
    return database.getBankAccountDetails(accountId).then((accountDetails) => ({ result: accountDetails }));
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "loggedSubdomain") {
        return contentRequestsLoggedSubdomain();
    } else if (request.type == "credentials") {
        return contentRequestsCredentials(sendResponse);
    } else if (request.type == "login") {
        return contentRequestsLogin();
    } else if (request.type == "bankAccountDetails") {
        return contentRequestsBankAccountDetails(request);
    }
});