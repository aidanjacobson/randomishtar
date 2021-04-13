async function loadData() {
    stat.innerText = "Processing data..."
    var resp = await fetch("structure.json");
    return await resp.json();
}

async function main() {
    var data = await loadData();
    stat.innerText = "Generating random page...";
    var totals = getMaxCategories(data);
    var page = generateRandomPage(data, totals);
    await openPage(page);
}

window.onload = function() {
    main();
}

function getMaxCategories(data) {
    var eNumber = data.entries.perPage * (data.entries.pages-1) + data.entries.lastPage;
    var cNumber = data.cards.perPage * (data.cards.pages-1) + data.cards.lastPage;
    var rNumber = data.records.perPage * (data.records.pages-1) + data.records.lastPage;
    return {
        entries: eNumber,
        cards: cNumber,
        records: rNumber
    };
}

function genRandomNumber(totals) {
    var max = totals.entries + totals.cards + totals.records;
    return Math.floor(Math.random()*max);
}

function generateRandomPage(data, totals) {
    var cardNumber = genRandomNumber(totals);
    return convertNumberToLocation(cardNumber, data, totals);
}

function convertNumberToLocation(number, data, totals) {
    var output = {
        prefix: "",
        page: 0,
        number: 0
    }
    if (number < totals.entries) { // entry
        output.prefix = "entries";
        output.page = Math.floor(number / data.entries.perPage);
        output.number = number - output.page*data.entries.perPage;
    } else if (number < totals.entries + totals.cards) { // card
        number -= totals.entries;
        output.prefix = "cards";
        output.page = Math.floor(number / data.cards.perPage);
        output.number = number - output.page*data.cards.perPage;
    } else { // record
        number -= totals.entries;
        number -= totals.cards;
        output.prefix = "records";
        output.page = Math.floor(number / data.cards.perPage);
        output.number = number - output.page*data.cards.perPage;
    }
    return output;
}

async function openPage({prefix, page, number}) {
    var matchRE = new RegExp(`(?<=")\/${prefix}\/(?!page).+(?=")`, "g");
    var resp = await fetch(`getpage.php?prefix=${prefix}&page=${page}`);
    var txt = await resp.text();
    var matches = txt.match(matchRE);
    var url = matches[number];
    stat.innerText = `Opening ${url} on ishtar...`;
    window.location = `https://www.ishtar-collective.net${url}`;
}