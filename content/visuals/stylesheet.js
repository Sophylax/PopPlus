//Inject stylesheet into the DOM, after all other stylesheets to override them

//Injecting CSS even before the DOM is complete
//  I can't have it after the DOM is complete otherwise it tends to flicker
//  As it can load the CSS/JS slightly after rendering
var style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('content/visuals/popplus.css');
(document.head || document.documentElement).appendChild(style);

//Listen to the children of the document
//  When the BODY is added we can move the stylesheet into the HEAD node
//  We then disconnect, as the observer's purpose is done
var styleSheetObserver = new window.MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var addedNode = mutation.addedNodes[i]
            if (addedNode.tagName === "BODY") {
                (document.head || document.documentElement).appendChild(style);
                styleSheetObserver.disconnect();
            }
        }
    })
});
styleSheetObserver.observe(document.documentElement, { childList: true });