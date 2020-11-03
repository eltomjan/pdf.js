const fs = require('fs');
const path = require('path');
const pdf = require('process').argv[2];
const datauri = require(path.join(process.env.APPDATA, 'npm/node_modules', 'datauri'));
const puppeteer = require(path.join(process.env.APPDATA, 'npm/node_modules', 'puppeteer'));
datauri(pdf, (err, content, meta) => {
    if (err) {
        throw err;
    }
    const viewerJSpath = path.join(__dirname, './viewer');
    let wp = fs.readFileSync(viewerJSpath + 'Src.js', 'utf-8');
    const pdfName = 'compressed.tracemonkey-pldi-09.pdf';
    const srcPos = [wp.indexOf(pdfName)];
    srcPos.push(srcPos[0] + pdfName.length);
    let HOSTED_VIEWER_ORIGINS = wp.indexOf('HOSTED_VIEWER_ORIGINS');
    HOSTED_VIEWER_ORIGINS = wp.indexOf(']', HOSTED_VIEWER_ORIGINS);
    wp = wp.substr(0, srcPos[0]) + content +
    wp.substr(srcPos[1], HOSTED_VIEWER_ORIGINS - srcPos[1]) + ', "file://"' +
    wp.substr(HOSTED_VIEWER_ORIGINS);
    fs.writeFileSync(viewerJSpath + '.js', wp, 'utf-8');
    (async () => {
        const browser = await puppeteer.launch({
            // headless: false
        });
        const page = await browser.pages();
        const c = path.join(__dirname, 'viewer.html');
        await page[0].goto('file:///' + c);
        page[0].exposeFunction('reader', (elLists) => {
            fs.writeFileSync(path.join(__dirname, 'PDFtexts.txt'), JSON.stringify(elLists, null, 4));
            setTimeout(() => { browser.close(); }, 100);
        });
    })();

});
