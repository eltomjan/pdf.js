const fs = require('fs');
const path = require('path');
const pdf = require('process').argv[2];
const chp = require('child_process');
const datauri = require(path.join(process.env.APPDATA, 'npm/node_modules', 'datauri'));
datauri(pdf, (err, content, meta) => {
    if (err) {
        throw err;
    }
    const viewerJSpath = path.join(__dirname, './viewer.js');
    let wp = fs.readFileSync(viewerJSpath, 'utf-8');
    const pdfName = 'compressed.tracemonkey-pldi-09.pdf';
    const srcPos = [wp.indexOf(pdfName)];
    srcPos.push(srcPos[0] + pdfName.length);
    let HOSTED_VIEWER_ORIGINS = wp.indexOf('HOSTED_VIEWER_ORIGINS');
    HOSTED_VIEWER_ORIGINS = wp.indexOf(']', HOSTED_VIEWER_ORIGINS);
    wp = wp.substr(0, srcPos[0]) + content +
    wp.substr(srcPos[1], HOSTED_VIEWER_ORIGINS - srcPos[1]) + ', "file://"' +
    wp.substr(HOSTED_VIEWER_ORIGINS);
    fs.writeFileSync(viewerJSpath, wp, 'utf-8');
    const c = path.join(__dirname, 'viewer.html');
    chp.execSync(c);
});
