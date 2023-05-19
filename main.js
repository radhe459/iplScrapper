const request = require("request")
const cheerio = require("cheerio");
const fs = require("fs")
const path = require("path")
const allLinkobj = require("./allMatchUrl")

const iplpath = path.join(__dirname, "ipl")
dircreator(iplpath)

const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url, cb);

function cb(err, response, html) {
    if (err) {
        console.log(err);
    }
    else {
        extractLink(html);
    }
}

function extractLink(html) {
    let $ = cheerio.load(html);
    let anchorBelowElem = $(".ds-text-tight-m.ds-font-bold.ds-text-typo-primary.ds-block.ds-block.ds-text-center")
    const anchorLink = $(anchorBelowElem).parent().attr('href')
    const fullLink = "https://www.espncricinfo.com/" + anchorLink;
    allLinkobj.getLink(fullLink);

}

function dircreator(filepath) {
    if (fs.existsSync(filepath) == false) {
        fs.mkdirSync(filepath)
    }
}
