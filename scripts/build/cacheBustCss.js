const fs = require('fs');
const util = require('./util');

function doCssCacheBusting() {
  util.handleCssFileHashing();
  let html = util.getIndexHtml();
  const fileType = 'css';
  html = util.appendOrOverwriteHashCssValues(html, 'main', util.getHashForFile('main', fileType));
  util.writeIndexHtml(html);
}

doCssCacheBusting();