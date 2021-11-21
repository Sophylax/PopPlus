var economyPath = 'popmundo.com/World/Popmundo.aspx/Character/Economy';
var isEconomy = document.URL.includes(economyPath);
if (isEconomy) {
    var nodes = document.querySelectorAll('#tableaccounts > tbody > tr > td.right > span');

    if (nodes.length > 0) { //Better check if the table exists
        var total = [].slice.call(nodes).map((x) => parseInt(x.innerText)).reduce((acc, el) => acc + el, 0) / 10;

        var lastNode = document.querySelector("#tableaccounts > tbody > tr:last-child");
        var totalNode = lastNode.cloneNode(true);

        if (nodes.length % 2 === 0) {
            totalNode.className = 'odd';
        } else {
            totalNode.className = 'even';
        }

        console.log(lastNode.classList)
        console.log(totalNode.classList)

        totalNode.children[0].innerHTML = '<b>Total:</b>';
        totalNode.children[1].innerHTML = `<b>${total.toLocaleString('en-UK', {minimumFractionDigits: 2})} M$</b>`;

        lastNode.parentNode.parentNode.appendChild(totalNode);
        //lastNode.parentNode.insertBefore(totalNode, lastNode.nextSibling);
    }
}