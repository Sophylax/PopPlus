//TODO: Document this

notification = {
    addPageNotification: function(document, text) {
        var o = `<div class="notification-real notification-error">${text}</div>`;
        document.getElementById('notifications').insertAdjacentHTML('beforeend', o)
        document.querySelector("#notifications > div:last-child").style.filter = 'hue-rotate(210deg)'
        document.querySelector("#notifications > div:first-child").hidden = true
        return document.querySelector("#notifications > div:last-child")
    }
}