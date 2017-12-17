
const webpackConfig = require('@ionic/app-scripts/config/webpack.config');
const fs = require('fs');
const https = require('https');
const sharp = require('sharp');
const rmdir = require('rimraf');
const util = require('./scripts/build/util');

if (process.env.IONIC_ENV === 'prod') {
  webpackConfig.prod.output.filename = '[name].[chunkhash].js';
  webpackConfig.prod.plugins.push(
    new IndexFileUpdaterPlugin()
  );
  webpackConfig.prod.plugins.push(
    // new BarPictureDowloader()
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

function BarPictureDowloader(options) {

  BarPictureDowloader.prototype.apply = function (compiler) {
    const barsJsonFile = 'www/assets/bars.json';

    // load bars
    let barsJson = fs.readFileSync(barsJsonFile).toString('utf8');
    let bars = JSON.parse(barsJson.substring(1));
    // init folder
    rmdir('www/assets/imgs/bars/', () => {
      fs.mkdirSync('www/assets/imgs/bars/');

      // download pictures
      bars.forEach(element => {
        const pictureUrl = element.Photo;
        var fileUrl = pictureUrl.substring(pictureUrl.indexOf('(') + 1, pictureUrl.indexOf(')'));
        var fileName =
          fileUrl.split('/')[fileUrl.split('/').length - 1].split('_')[0]
          + '.'
          + fileUrl.split('.')[fileUrl.split('.').length - 1];
        console.log('downloading', fileUrl);
        var file = fs.createWriteStream('./www/assets/imgs/bars/' + fileName);
        var request = https.get(fileUrl, function (response) {
          response.pipe(file);
          file.on('finish', () => {
            sharp('./www/assets/imgs/bars/' + fileName)
              .resize(640)
              .toFile('./www/assets/imgs/bars/web-' + fileName, (err, info) => {
                console.log(err, info);
                // TODO remove old image
                // fs.unlinkSync('./www/assets/imgs/bars/' + fileName);
                // TODO rename web image
                // fs.renameSync('./www/assets/imgs/bars/web-' + fileName, './www/assets/imgs/bars/' + fileName);
              });
          });

          // replace picture links inside bars.json
          barsJson = barsJson.replace(fileUrl, './assets/imgs/bars/web-' + fileName);
          fs.writeFileSync(barsJsonFile, barsJson);
        });
      });
    });

  }
};