
const webpackConfig = require('@ionic/app-scripts/config/webpack.config');
const fs = require('fs');
const util = require('./scripts/build/util');

if (process.env.IONIC_ENV === 'prod') {
  webpackConfig.prod.output.filename = '[name].[chunkhash].js';
  webpackConfig.prod.plugins.push(
    new IndexFileUpdaterPlugin()
  );
}

function IndexFileUpdaterPlugin(options) { }

IndexFileUpdaterPlugin.prototype.apply = function (compiler) {
  compiler.plugin('done', function (stats) {
    let html = util.getIndexHtml();
    html = util.appendOrOverwriteHashJsValues(html, 'main', util.getHashForFile('main', 'js'));
    html = util.appendOrOverwriteHashJsValues(html, 'vendor', util.getHashForFile('vendor', 'js'));
    util.writeIndexHtml(html);
  });
};