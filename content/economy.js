function CreatePopPlusIcon(document) {
    var icon = document.createElement("img");
    icon.src = "/Static/Icons/plus-small.png"
    icon.alt = "PopPlus Feature"
    icon.title = "PopPlus Feature"
    icon.style.filter = "hue-rotate(120deg) contrast(2.5) saturate(0.5)"
    icon.style.verticalAlign = "text-bottom"
    icon.style.width = "13px"
    icon.style.height = "13px"
    icon.style.objectFit = "none"
    return icon
}

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

        var plusIconTotal = CreatePopPlusIcon(document);

        var totalLeft = document.createElement("b");
        totalLeft.innerText = 'Total:'
        totalNode.children[0].replaceChildren(plusIconTotal, totalLeft);

        var totalRight = document.createElement("b");
        totalRight.innerText = total.toLocaleString('en-UK', { minimumFractionDigits: 2 }) + 'M$';
        totalNode.children[1].replaceChildren(totalRight);

        lastNode.parentNode.parentNode.appendChild(totalNode);

        var interestNode = lastNode.cloneNode(true);

        var plusIconInterest = CreatePopPlusIcon(document);

        var interestLeft = document.createElement("b");
        interestLeft.innerText = 'Yearly Interest:'
        interestNode.children[0].style.verticalAlign = 'middle';
        interestNode.children[0].replaceChildren(plusIconInterest, interestLeft);

        var interestRight = document.createElement("input");
        interestRight.type = 'button';
        interestRight.id = 'popPlusInterestCalculator'
        interestRight.value = 'Calculate'
        interestNode.children[1].replaceChildren(interestRight);

        totalNode.parentNode.appendChild(interestNode);

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