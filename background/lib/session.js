//Session Manager library for PopPlus

session = {

    server: 0,

    //Generate a login request and record the result
    //	Returns whether the login was successful or not
    login: async function() {
        var credentials = config.get('credentials');

        if (credentials == undefined) {
            this.server = 0;
            return false;
        }

        //	TODO?: Exception after malformed credentials

        var landingURL = 'https://www.popmundo.com/Default.aspx';
        var landingData = await requests.awaitGet(landingURL);
        var loginForm = parse.formData(landingData);
        loginForm.set('ctl00$cphRightColumn$ucLogin$txtUsername', credentials['username']);
        loginForm.set('ctl00$cphRightColumn$ucLogin$txtPassword', credentials['password']);
        loginForm.set('ctl00$cphRightColumn$ucLogin$ddlStatus', credentials['status']);
        loginForm.set('ctl00$cphRightColumn$ucLogin$btnLogin', 'OK!');

        //Manual Request time: We actually care about something other than the returned document
        //	I need the non-parsed request, so the request pipeline is a bit moot.
        //	Also I disable no-cors mode and follow the redirect to see where it ends up.
        //	TODO: Rate limit this, either manually or add generic rate limited requests to Requests
        var loginResponse = await fetch(landingURL, { method: 'POST', body: loginForm, redirect: 'follow' })

        //Successful logins get redirected
        if (!loginResponse.redirected) {
            this.server = 0;
            return false;
        }

        //Expected URL format: https://##.popmundo.com/World/Popmundo.aspx
        var loginUrl = loginResponse.url;
        var loginServer = loginUrl.split('/')[2].split('.')[0];
        this.server = parseInt(loginServer);
        return true;
    },

    //Generate URL from partial url, filling in subdomain from given arg
    //	The subdomain arg defaults to the currently logged in server
    //	A subdomain of 0 is interpreted as the 'www' subdomain
    //  Partial url is defined as the part after the "/World/Popmundo.aspx/"
    completeURL: function(partialURL, subdomain = this.server) {
        if (subdomain === 0) {
            return 'https://www.popmundo.com/World/Popmundo.aspx/' + partialURL;
        } else {
            return 'https://' + subdomain + '.popmundo.com/World/Popmundo.aspx/' + partialURL;
        }
    },

    //Check if the browser is logged in to the given subdomain 
    //	The subdomain arg defaults to the currently logged in server
    //	A subdomain of 0 always returns false as you cannot login to 'www'
    checkLoggedSubdomain: async function(subdomain = this.server) {
        if (subdomain === 0) {
            return false;
        }
        var characterURL = this.completeURL('Character', subdomain);
        var landingData = await requests.awaitGet(characterURL);
        return parse.loginState(landingData);
    },

    knownPopmundoSubdomains: [73, 74, 75],

    //Checks if the browser is logged in to any one of the known subdomains
    //	Updates session.server if there is a mismatch
    findLoggedSubdomain: async function() {
        if (await this.checkLoggedSubdomain()) {
            return true;
        }

        var subdomains = this.knownPopmundoSubdomains.filter(x => x !== this.server);
        var promises = {}
        for (const subdomain of subdomains) {
            promises[subdomain] = this.checkLoggedSubdomain(subdomain);
        }
        for (const subdomain of subdomains) {
            if (await promises[subdomain]) {
                this.server = subdomain;
                return true;
            }
        }

        this.server = 0;
        return false;
    },
}