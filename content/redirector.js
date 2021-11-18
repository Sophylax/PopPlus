notification.addPageNotification(document, 'LOGIN?')
if (parse.loginState(document)) {
    notification.addPageNotification(document, 'YES!')
} else {
    notification.addPageNotification(document, 'NO!')
}

console.log(browser.extension)
console.log(browser.runtime)