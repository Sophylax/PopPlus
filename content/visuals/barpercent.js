//Add the numeric scores to each score link as they are added

var percentPattern = /[\+\-]?[0-9]+%/

function percentAdderMutator(parentNode, addedNode) {
    if (addedNode.tagName == "DIV" && (addedNode.className.includes('rogressBar') || addedNode.className.includes('plusMinusBar'))) {
        console.log(addedNode)
        addedNode.dataset['content'] = percentPattern.exec(addedNode.title);
    }
    for (const childNode of addedNode.childNodes) {
        percentAdderMutator(addedNode, childNode);
    }
}

var barPercentObserver = new window.MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var parentNode = mutation.target;
        for (var i = 0; i < mutation.addedNodes.length; i++) {
            var addedNode = mutation.addedNodes[i]
            percentAdderMutator(parentNode, addedNode);
        }
    })
});
barPercentObserver.observe(document.documentElement, { subtree: true, childList: true });