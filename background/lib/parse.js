//Parser library for PopPlus
//Basically collection of a bunch of information extraction functions for various page formats

parse = {

	//There is a set of hidden fields in all pages, which is supposed to hold session state for the ASPx server
	//	Submitting POST requests without these fields doesn't work, possibly breaking things server side.
	//	Therefore we have most of the FormData initialized here with these fields automatically extracted.
	formData: function(document) {
		var formdata = new FormData();
		formdata.append('__EVENTARGUMENT', document.querySelector('#__EVENTARGUMENT').value);
		formdata.append('__EVENTTARGET', document.querySelector('#__EVENTTARGET').value);
		formdata.append('__EVENTVALIDATION', document.querySelector('#__EVENTVALIDATION').value);
		formdata.append('__VIEWSTATE', document.querySelector('#__VIEWSTATE').value);
		formdata.append('__VIEWSTATEGENERATOR', document.querySelector('#__VIEWSTATEGENERATOR').value);
		var _LF = document.querySelector('#__LASTFOCUS');
		if (_LF == null) {
			formdata.append('__LASTFOCUS', '');
		}
		else {
			formdata.append('__LASTFOCUS', _LF.value);
		}
		return formdata;
	}
}