const request = require("request")
const cheerio = require("cheerio");
const scorecard = require("./TeamScorecard")

function getMatchLink(link) {
    request(link, (err, response, html) => {
        if (err) {
            console.log(err);
        }
        else {
            extractMatch(html);
        }
    })

    function extractMatch(html) {
        try {
            let $ = cheerio.load(html);
            const matchboxArr = $(".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent .ds-no-tap-higlight");
            // console.log(mathboxArr.length)
            for (let i = 0; i < matchboxArr.length; i++) {
                let matchLink = $(matchboxArr[i]).attr('href')
                let fullMatchLink = "https://www.espncricinfo.com/" + matchLink
                console.log(fullMatchLink)
                scorecard.psc(fullMatchLink)
            }
        }
        catch (e) {
            console.log(e)
        }
    }
}

module.exports = {
    getLink: getMatchLink
}