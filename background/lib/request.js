//Requests library for PopPlus

request = {

	//Mostly used primitive network requests, simple GET and POST
	get: (url) => fetch(url, {mode: 'no-cors'}),
	post: (url, body) => etch(url, {mode: 'no-cors', method: 'POST', body: body}),

	//We need to convert the response into DOM quite frequently, to easily parse the retrieved pages
	//	Works on promises, because everything in this javascript hell has to be async
	responseIntoDOM: function (promise) {
		return promise.then(response => response.text())
  		.then(responseText => (new window.DOMParser()).parseFromString(responseText, "text/html").documentElement);
	}
}