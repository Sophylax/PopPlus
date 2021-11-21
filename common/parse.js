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
        } else {
            formdata.append('__LASTFOCUS', _LF.value);
        }
        return formdata;
    },

    //Look at DOM and see if logged in by checking the About link (only appears when logged out)
    //Also check for Welcome link, during downtime nothing appears and we dont properly process
    //  for 503 responses as failed.
    loginState: function(document) {
        return document.querySelector("#ctl00_ctl08_ucMenu_lnkAbout") === null && document.querySelector("#ctl00_ctl08_ucMenu_lnkStart") !== null;
    },

    //Parse Owner, Bank ID, Account Name, Open Date, Limit and Intrest Rate
    bankAccountDetails: function(document) {
        var owner = parseInt(document.querySelector("#ppm-sidemenu > div > div:nth-child(2) > ul > li:nth-child(1) > a").href.split('/')[6]);
        var bankId = parseInt(document.querySelector("#ctl00_cphLeftColumn_ctl00_lnkBank").href.split('/')[6]);
        var accountName = document.querySelector("#ppm-content > div:nth-child(4) > table > tbody > tr:nth-child(2) > td:nth-child(2)").innerText;
        var openDate = new Date(document.querySelector("#ppm-content > div:nth-child(4) > table > tbody > tr:nth-child(3) > td:nth-child(2)").innerText);
        var limit = parseFloat(document.querySelector("#ppm-content > div:nth-child(4) > table > tbody > tr:nth-child(6) > td:nth-child(2)").innerText.replaceAll(',', '').replace(' M$', ''));
        var intrestRate = parseFloat(document.querySelector("#ppm-content > div:nth-child(4) > table > tbody > tr:nth-child(5) > td:nth-child(2)").innerText.replaceAll(',', '').replace('%', '')) / 100;
        return {
            owner: owner,
            bankId: bankId,
            accountName: accountName,
            openDate: openDate,
            limit: limit,
            intrestRate: intrestRate,
        }
    },
}