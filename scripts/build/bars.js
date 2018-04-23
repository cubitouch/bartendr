const fs = require('fs');
var csv = require('csv');

function doGenerateBarsJson() {
    var barsCSV = csv.parse(fs.readFileSync('src/assets/bars.csv').toString(), (err, data) => {
        var bars = [];

        for (var i = 1; i < data.length; i++) {
            var item = {};
            for (var j = 0; j < data[0].length; j++) {
                item[data[0][j]] = data[i][j];
            }
            bars.push(item);
        }

        console.log('generate JSON file from CSV bars list', bars.length);
        fs.writeFileSync('src/assets/bars.json', JSON.stringify(bars, null, 2));
    });

}

doGenerateBarsJson();
