//Requests library for PopPlus

requests = {

    //Mostly used primitive network requests, simple GET and POST
    get: (url) => fetch(url, {}),
    post: (url, body) => fetch(url, { method: 'POST', body: body }),

    //We need to convert the response into DOM quite frequently, to easily parse the retrieved pages
    //	Works on promises, because everything in the JS hell has to be async
    responseIntoDOM: function(promise) {
        return promise.then(response => response.text())
            .then(responseText => (new window.DOMParser()).parseFromString(responseText, "text/html").documentElement);
    },

    //Hybrid abominations, useful shorthand though
    //	Turns out lambdas have their own this. Thank god for all the gotchas in JS 
    getIntoDOM: function(url) { return this.responseIntoDOM(this.get(url)) },
    postIntoDOM: function(url, body) { return this.responseIntoDOM(this.post(url, body)) },

    //Here we have the rate limited requests, which is the main export of this little script
    //	We may need to make a lot of request, and the Popmundo servers doesn't like that (rightfully)
    //	So we wrap some timing around our requests to hard limit ourselves

    rateLimit: () => config.get('rateLimit'), //in Miliseconds, looked up from config

    //Kinda-Sorta default dict containing when a hostname should be requested
    //nextRequest.['www.popmundo.com'] for example
    nextRequest: new Proxy({}, {
        get: (target, name) => name in target ? target[name] : new Date()
    }),

    //Returns a promise that just resolves itself when the next time rate limiter is available
    awaitRate: function(hostname) {
        var now = new Date();
        var remainingTime = this.nextRequest[hostname].getTime() - (now).getTime();
        if (remainingTime < 0) { remainingTime = 0; }
        this.nextRequest[hostname] = now;
        this.nextRequest[hostname].setMilliseconds(now.getMilliseconds() + remainingTime + this.rateLimit());
        return new Promise(resolve => setTimeout(resolve, remainingTime));
    },

    //More pre-boilerplate'ing
    awaitGet: function(url) { return this.awaitRate((new URL(url)).hostname).then(() => this.getIntoDOM(url)) },
    awaitPost: function(url, body) { return this.awaitRate((new URL(url)).hostname).then(() => this.postIntoDOM(url, body)) },
}