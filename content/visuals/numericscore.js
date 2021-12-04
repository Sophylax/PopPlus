//Add the numeric scores to each score link as they are added
var numericScoreObserver = new window.MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var addedNode = mutation.addedNodes[i]
            if (addedNode.tagName === "A" && addedNode.href.includes('/World/Popmundo.aspx/Help/Scoring/')) {
                var score = addedNode.href.split('/World/Popmundo.aspx/Help/Scoring/')[1];
                addedNode.dataset['content'] = score - 1;
            }
        }
    })
});
numericScoreObserver.observe(document.documentElement, { subtree: true, childList: true });