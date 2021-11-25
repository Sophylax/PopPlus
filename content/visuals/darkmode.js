//Shamelessly borrowed from "Popmundo Dark Theme" by Faun Fangorn and Dwergie
//  https://greasyfork.org/en/scripts/430065-popmundo-dark-theme

//Injecting CSS even before the DOM is complete
//  I can't have it after the DOM is complete otherwise it tends to flicker
//  As it can load the CSS/JS slightly after rendering
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('content/visuals/darkmode.css');
(document.head || document.documentElement).appendChild(style);

//Rendering trickery: I can't modify body reliably before DOM loads to add
//  the 'dark' class. So I add 'hidden' to the document to hide the body
//  until it is safe to do some modifications. I'm basically forcing the
//  rendering to wait for this script.
//document.documentElement.classList.add('hidden');

window.addEventListener("DOMContentLoaded", function() {

    //Moving the CSS to the head after othe CSSs. Our CSS needs to
    //  be the last css to override others.
    (document.head || document.documentElement).appendChild(style);

    //document.body.classList.add('dark');

    //Where to put the bulb icon. Also a handy login checker.
    /*var accountToolBar = document.querySelector('#character-tools-account');
    if (accountToolBar) {

        var switchAnchor = document.createElement('a');
        var switchImg = document.createElement('img');
        switchAnchor.append(switchImg);
        switchAnchor.classList.add("icon");
        switchAnchor.onclick = enableDarkMode;
        switchImg.classList.add("icon");
        switchImg.id = "dark-mode-toggle";
        switchImg.src = "/Static/Icons/light-bulb.png";
        switchImg.title = "Enable Dark Theme";
        accountToolBar.prepend(switchAnchor);

        function enableDarkMode() {
            document.body.classList.add('dark');
            switchImg.title = "Disable Dark Theme";
            //Instead of creating our own icon, I modify the bulb icon
            //  to get the 'turned off bulb' image. Some hue shift and
            //  desaturation seems to be enough.
            switchImg.style.filter = "hue-rotate(140deg) saturate(.3)";
            switchAnchor.onclick = disableDarkMode;
        }

        function disableDarkMode() {
            document.body.classList.remove('dark');
            switchImg.style.filter = "";
            switchImg.title = "Enable Dark Theme";
            switchAnchor.onclick = enableDarkMode;
        }

        enableDarkMode();
    }*/

    //We are done with this, visibility is engaged.
    //(document.documentElement).classList.remove('hidden');
})
MutationObserver = window.MutationObserver
var insertedNodes = [];
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].tagName === "BODY") {
                mutation.addedNodes[i].classList.add('dark');
            }
        }
    })
});
observer.observe(document.documentElement, { childList: true });
//console.log(insertedNodes);