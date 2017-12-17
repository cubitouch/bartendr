const md5 = require('md5');
const fs = require('fs');


const util = module.exports = {}

const wwwDirPath = 'www';
const buildDirPath = 'www/build';

/* This could likely be pulled from Webpack stats, but this'll do for now ... */
util.getHashForFile = function (fileName, fileType) {
    const result = fs.readdirSync(buildDirPath).filter(file => {
        return file.startsWith(fileName) && file.endsWith(fileType) && (file.indexOf('map') === -1)
    })[0];
    return result.split('.')[1];
}

util.appendOrOverwriteHashJsValues = function (indexString, chunkName, hash) {
    let match = '(<script src="build/' + chunkName + '.*.js"></script>)';
    let regexp = indexString.match(match)[0];
    const replace = '<script src="build/' + chunkName + '.' + hash + '.js"></script>';
    return indexString.replace(regexp, replace);
}

util.appendOrOverwriteHashCssValues = function (indexString, chunkName, hash) {
    let match = '(<link href="build/' + chunkName + '.*.css" rel="stylesheet")';
    let regexp = indexString.match(match)[0];
    const replace = '<link href="build/' + chunkName + '.' + hash + '.css" rel="stylesheet"';
    return indexString.replace(regexp, replace);
}

util.handleCssFileHashing = function () {
    const md5 = getMD5ForMainCss();
    fs.renameSync(buildDir('main.css'), buildDir('main.' + md5 + '.css'));
}

util.getIndexHtml = function () {
    return fs.readFileSync(wwwDir('index.html')).toString();
}

util.writeIndexHtml = function (htmlString) {
    fs.writeFileSync(wwwDir('index.html'), htmlString);
}

getMD5ForMainCss = function () {
    const fileString = fs.readFileSync(buildDir('main.css')).toString();
    return md5(fileString);
}

buildDir = function (file) {
    return buildDirPath + '/' + file;
}

wwwDir = function (file) {
    return wwwDirPath + '/' + file;
}