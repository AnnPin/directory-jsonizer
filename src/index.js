'use strict';

var traverse = require('./traverse');
var traverseSync = require('./traverseSync');
var createDirectoryTree = require('./createDirectoryTree');
var createDirectoryTreeSync = require('./createDirectoryTreeSync');


var directoryToObject = function(path, callback) {
    traverse(path, callback);
};

var directoryToJson = function(path, callback) {
    directoryToObject(path, function(err, obj) {
        if (err) throw callback(err);
        callback(null, JSON.stringify(obj));
    });
};

var createDirectoryFromObject = function(obj, saveIn, saveRootAs, callback) {
    createDirectoryTree(obj, saveIn, saveRootAs, callback);
};

var createDirectoryFromJson = function(json, saveIn, saveRootAs, callback) {
    createDirectoryFromObject(JSON.parse(json), saveIn, saveRootAs, callback);
};

var directoryToObjectSync = function(path) {
    return traverseSync(path);
};

var directoryToJsonSync = function(path) {
    var obj = directoryToObjectSync(path);
    return JSON.stringify(obj);
};

var createDirectoryFromObjectSync = function(obj, saveIn, saveRootAs) {
    createDirectoryTreeSync(obj, saveIn, saveRootAs);
};

var createDirectoryFromJsonSync = function(json, saveIn, saveRootAs) {
    createDirectoryFromObjectSync(JSON.parse(json), saveIn, saveRootAs);
};

module.exports = {
    directoryToObject: directoryToObject,
    directoryToJson: directoryToJson,
    createDirectoryFromObject: createDirectoryFromObject,
    createDirectoryFromJson: createDirectoryFromJson,

    directoryToObjectSync: directoryToObjectSync,
    directoryToJsonSync: directoryToJsonSync,
    createDirectoryFromObjectSync: createDirectoryFromObjectSync,
    createDirectoryFromJsonSync: createDirectoryFromJsonSync
};
