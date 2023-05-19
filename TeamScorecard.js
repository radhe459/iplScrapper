const request = require("request")
const cheerio = require("cheerio");
const fs = require("fs")
const path = require("path")
const xlsx = require("xlsx")


// const url = "https://www.espncricinfo.com//series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";

function processScorecard(url) {
    request(url, cb);
}

function cb(err, response, html) {
    if (err) {
        console.log(err);
    }
    else {
        extractLink(html);
    }
}

function extractLink(html) {
    const $ = cheerio.load(html);
    const descVenue = $('.ds-text-tight-m.ds-font-regular.ds-text-typo-mid3')
    const descArr = descVenue.text().split(',')
    const venue = descArr[1].trim()
    const date = descArr[2].trim()
    const resultElem = $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo")
    const result = resultElem.text()
    const innings = $(".ds-rounded-lg.ds-mt-2")
    let htmlString = ""
    for (let i = 0; i < innings.length; i++) {
        // htmlString += $(innings[i]).html()
        let teamName = $(innings[i]).find('.ds-text-title-xs.ds-font-bold.ds-capitalize').text();
        let opponentInd = i == 0 ? 1 : 0;
        let oppnentName = $(innings[opponentInd]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize").text()

        let cinnings = $(innings[i])
        let allrows = cinnings.find("table tbody tr")

        for (let j = 0; j < allrows.length; j++) {
            let allcolms = $(allrows[j]).find('td');
            let colmLen = allcolms.length
            if (colmLen == 8) {
                let playerName = $(allcolms[0]).text()
                let run = $(allcolms[2]).text()
                let balls = $(allcolms[3]).text()
                let fours = $(allcolms[5]).text()
                let sixs = $(allcolms[6]).text()
                let sr = $(allcolms[7]).text()

                console.log(`${playerName}  ${run}  ${balls}  ${fours}  ${sixs}  ${sr}`)
                processPlayer(teamName, playerName, run, balls, fours, sixs, sr, oppnentName, venue, date, result)
            }
        }
    }
    // console.log(htmlString)
}

function processPlayer(teamName, playerName, run, balls, fours, sixs, sr, oppnentName, venue, date, result) {
    let teamPath = path.join(__dirname, "ipl", teamName);
    dircreator(teamPath);
    let filePath = path.join(teamPath, playerName + ".xlsx");
    let content = excelReader(filePath, playerName);
    let playerObj = {
        teamName,
        oppnentName,
        result,
        playerName,
        venue,
        date,
        run,
        balls,
        fours,
        sixs,
        sr
    }
    content.push(playerObj)
    excelWriter(filePath, content, playerName)

}

function dircreator(filepath) {
    if (fs.existsSync(filepath) == false) {
        fs.mkdirSync(filepath)
    }
}

function excelReader(filepath, sheetName) {
    if (fs.existsSync(filepath) == false) {
        return [];
    }
    let wb = xlsx.readFile(filepath)
    let excelData = wb.Sheets[sheetName]
    let ans = xlsx.utils.sheet_to_json(excelData)
    return ans
}


function excelWriter(filepath, json, sheetName) {
    let newWB = xlsx.utils.book_new();
    let newWs = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWs, sheetName);
    xlsx.writeFile(newWB, filepath);

}


module.exports = {
    psc: processScorecard
}