//Shamelessly borrowed from "Popmundo Dark Theme" by Faun Fangorn and Dwergie
//  https://greasyfork.org/en/scripts/430065-popmundo-dark-theme

//The In-Page LightBulb logic
//  Currently disabled, with plans to move to popup interface

// window.addEventListener("DOMContentLoaded", function() {

//     //Where to put the bulb icon. Also a handy login checker.
//     var accountToolBar = document.querySelector('#character-tools-account');
//     if (accountToolBar) {

//         var switchAnchor = document.createElement('a');
//         var switchImg = document.createElement('img');
//         switchAnchor.append(switchImg);
//         switchAnchor.classList.add("icon");
//         switchAnchor.onclick = enableDarkMode;
//         switchImg.classList.add("icon");
//         switchImg.id = "dark-mode-toggle";
//         switchImg.src = "/Static/Icons/light-bulb.png";
//         switchImg.title = "Enable Dark Theme";
//         accountToolBar.prepend(switchAnchor);

//         function enableDarkMode() {
//             document.body.classList.add('dark');
//             switchImg.title = "Disable Dark Theme";
//             //Instead of creating our own icon, I modify the bulb icon
//             //  to get the 'turned off bulb' image. Some hue shift and
//             //  desaturation seems to be enough.
//             switchImg.style.filter = "hue-rotate(140deg) saturate(.3)";
//             switchAnchor.onclick = disableDarkMode;
//         }

//         function disableDarkMode() {
//             document.body.classList.remove('dark');
//             switchImg.style.filter = "";
//             switchImg.title = "Enable Dark Theme";
//             switchAnchor.onclick = enableDarkMode;
//         }

//         enableDarkMode();
//     }
// })

//Listen to the children of the document
//  When the BODY is added we can add the dark class instantly
//  We then disconnect, as the observer's purpose is done
//  TODO: Check for the configuration
var darkBodyObserver = new window.MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var addedNode = mutation.addedNodes[i]
            if (addedNode.tagName === "BODY") {
                addedNode.classList.add('dark');
                darkBodyObserver.disconnect();
            }
        }
    })
});
darkBodyObserver.observe(document.documentElement, { childList: true });