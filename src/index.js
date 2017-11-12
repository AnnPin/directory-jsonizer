'use strict';

var traverse = require('./traverse').traverse;
var traverseSync = require('./traverseSync').traverseSync;

var directoryToObject = function(path, callback) {
    traverse(path, callback);
};

var directoryToJson = function(path, callback) {
    directoryToObject(path, function(err, obj) {
        if (err) throw callback(err);
        callback(null, JSON.stringify(obj));
    });
};

var createDirectoryFromObject = function(obj, path, saveAs) {
    var dir = './test/sample';
    var result = DirectoryJsonizer.directoryToObjectSync(dir)

    var outdir = './test/result';
    var traverse = function(obj, dirPath, isRoot) {
        var outPath = path.resolve(dirPath, isRoot ? '' : obj.name);
        console.log(outPath);

        switch (obj.type) {
            case 'directory':
                if (!fs.existsSync(outPath)) {
                    fs.mkdirSync(outPath);
                }
                obj.content.forEach(function(child) {
                    traverse(child, outPath, false);
                });
                break;
            case 'binary':
                var decoded = new Buffer(obj.content, 'base64');
                fs.writeFileSync(outPath, decoded);
                break;
            default:
                fs.writeFileSync(outPath, obj.content, 'utf8');
        }
    };
    traverse(result, outdir, true);
};

var createDirectoryFromJson = function() {
    createDirectoryFromObject();
};

var directoryToObjectSync = function(path) {
    return traverseSync(path);
};

var directoryToJsonSync = function(path) {
    var obj = directoryToObjectSync(path);
    return JSON.stringify(obj);
};

var createDirectoryFromObjectSync = function() {};

var createDirectoryFromJsonSync = function() {
    return createDirectoryFromObjectSync();
};

module.exports.directoryToObject = directoryToObject;
module.exports.directoryToJson = directoryToJson;
module.exports.createDirectoryFromObject = createDirectoryFromObject;
module.exports.createDirectoryFromJson = createDirectoryFromJson;

module.exports.directoryToObjectSync = directoryToObjectSync;
module.exports.directoryToJsonSync = directoryToJsonSync;
module.exports.createDirectoryFromObjectSync = createDirectoryFromObjectSync;
module.exports.createDirectoryFromJsonSync = createDirectoryFromJsonSync;
