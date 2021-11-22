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

        totalNode.children[0].innerHTML = '<b>Total:</b>';
        totalNode.children[1].innerHTML = `<b>${total.toLocaleString('en-UK', {minimumFractionDigits: 2})} M$</b>`;

        lastNode.parentNode.parentNode.appendChild(totalNode);
        //lastNode.parentNode.insertBefore(totalNode, lastNode.nextSibling);

        var intrestNode = lastNode.cloneNode(true);
        intrestNode.children[0].innerHTML = '<b>Yearly Interest:</b>';
        intrestNode.children[1].innerHTML = '<input type="button" id="popPlusInterestCalculator" value="Calculate">';

        totalNode.parentNode.appendChild(intrestNode);

        document.querySelector("#popPlusInterestCalculator").onclick = CalculateInterest;
    }
}

async function CalculateInterest() {
    var button = document.querySelector("#popPlusInterestCalculator");
    var parent = button.parentNode;
    button.remove();

    var output = document.createElement("b");
    parent.appendChild(output);

    var acc = 0;

    for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        output.innerText = `Calculating: ${index + 1} / ${nodes.length}`;

        var money = parseInt(node.innerText) / 10;

        var accountLink = node.parentNode.parentNode.children[0].children[0];
        var accountId = parseInt(accountLink.href.split('/')[7]);
        var accountDetails = await browser.runtime.sendMessage({ type: 'bankAccountDetails', accountId: accountId }).then((x) => x.result);
        var interestRate = accountDetails.interestRate;
        acc += (money * interestRate);
    }

    output.innerText = `${acc.toLocaleString('en-UK', {minimumFractionDigits: 2})} M$`;
}