const glob = require("glob");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const version = fs.readFileSync("VERSION");
const webPath = `https://cdn.jsdelivr.net/gh/CUP-ACM-Programming-Club/CUPACM-Docs-CDN@v${version}`;

function rewriteSrc (element, $, attr) {
    element.each(function () {
        const src = $(this).attr(attr);
        if (src.indexOf("http") !== -1) {
            return;
        }
        $(this).attr(attr, webPath + src);
    })
}

function writeSrc (element, $, dir) {
    element.each(function () {
        const src = $(this).attr("src");
        if (src.indexOf("http") !== -1) {
            return;
        }
        $(this).attr("src", webPath + path.join(dir, src));
    })
}

function loadFile() {
    const htmlFileList = glob.sync(`docs/.vuepress/dist/**`)
        .filter(name => {
            return fs.lstatSync(name).isFile()
        })
        .filter(name => {
            return name.substring(name.length - 5) === '.html';
        });
    htmlFileList.forEach(filePath => {
        const content = fs.readFileSync(filePath, "utf-8");
        const $ = cheerio.load(content);
        const script = $("script");
        const css = $("link");
        rewriteSrc(script, $, "src");
        rewriteSrc(css, $, "href");
        writeSrc($("img"), $, path.dirname(filePath).replace("docs/.vuepress/dist", ""));
        fs.writeFileSync(filePath, $.html());
    });
}

loadFile();
