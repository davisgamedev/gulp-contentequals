var through = require("through2");
var fs = require("fs");

var PluginError = require("plugin-error");
const PLUGIN_NAME = "gulp-contentequals";

function contentequals(testfile, success, fail) {
    var stream = function(file, encoding, callback) {
        if(file.isNull()) {
            return callback(null, file);
        }
        if(file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
        }
        fs.readFile(testfile, (err, data) => {
            if (err) throw err;
            else {
                if(file.content.equals(data)) 
                    if (success) success();
                else
                    if (fail) fail();
            }
            return callback(null, file);
        })
    }
    return through.obj(stream);
}

module.exports = contentequals;