//Messaging Library for Background Scripts
//Generally custom made for each messaging purpose

//Retrieve Confirmed Logged in Subdomain
function contentRequestsLoggedSubdomain(request, sendResponse) {
    return session.findLoggedSubdomain().then((loginState) => {
        if (loginState) {
            return { result: session.server }
        } else {
            return session.login().then((loginSuccess) => {
                return { result: session.server }
            });
        }
    });
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "loggedSubdomain") {
        return contentRequestsLoggedSubdomain(request, sendResponse);
    }
});