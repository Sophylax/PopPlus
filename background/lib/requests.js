//Requests library for PopPlus

requests = {

	//Mostly used primitive network requests, simple GET and POST
	get: (url) => fetch(url, {mode: 'no-cors'}),
	post: (url, body) => etch(url, {mode: 'no-cors', method: 'POST', body: body}),

	//We need to convert the response into DOM quite frequently, to easily parse the retrieved pages
	//	Works on promises, because everything in the JS hell has to be async
	responseIntoDOM: function (promise) {
		return promise.then(response => response.text())
  		.then(responseText => (new window.DOMParser()).parseFromString(responseText, "text/html").documentElement);
	},

	//Hybrid abominations, useful shorthand though
	//	Turns out lambdas have their own this. Thank god for all the gotchas in JS 
	getIntoDOM: function (url) {return this.responseIntoDOM(this.get(url))},
	postIntoDOM: function (url, body) {return this.responseIntoDOM(this.post(url, body))},

	//Here we have the rate limited requests, which is the main export of this little script
	//	We may need to make a lot of request, and the Popmundo servers doesn't like that (rightfully)
	//	So we wrap some timing around our requests to hard limit ourselves

	rateLimit: () => config.get('rateLimit'), //in Miliseconds, looked up from config
	nextRequest: new Date(), //The datetime for the next available time for requests

	//Returns a promise that just resolves itself when the next time rate limiter is available
	awaitRate: function() {
      var now = new Date();
      var remainingTime = this.nextRequest.getTime() - (now).getTime();
      if (remainingTime < 0) { remainingTime = 0; }
      this.nextRequest = now;
      this.nextRequest.setMilliseconds(now.getMilliseconds() + remainingTime + this.rateLimit());
      return new Promise(resolve => setTimeout(resolve, remainingTime));
	},

	//More pre-boilerplate'ing
	awaitGet: function (url) {return this.awaitRate().then(() => this.getIntoDOM(url))},
	awaitPost: function (url, body) {return this.awaitRate().then(() => this.postIntoDOM(url, body))},
}