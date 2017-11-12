'use strict';

var fs = require('fs');
var path = require('path');
var isBinaryFile = require('isbinaryfile');

var __traverseSync = function(targetName, dirPath) {
    // get absolute path of target
    var absPath = path.resolve(dirPath, targetName);

    var stat = fs.lstatSync(absPath);
    if (stat && stat.isDirectory()) {
        var files = fs.readdirSync(absPath);
        return {
            name: targetName,
            type: 'directory',
            content: files.map(function (file) {
                return __traverseSync(file, absPath);
            })
        };
    }

    if (isBinaryFile.sync(absPath)) {
        var base64Data = fs.readFileSync(absPath, 'base64');
        return {
            name: targetName,
            type: 'binary',
            content: base64Data
        };
    } else {
        var textData = fs.readFileSync(absPath, 'utf-8');
        return {
            name: targetName,
            type: 'text',
            content: textData
        };
    }
};

var traverseSync = function(targetPath) {
    var splitPath = targetPath.split(path.sep);
    return __traverseSync(
        splitPath[splitPath.length - 1],
        splitPath.splice(0, splitPath.length - 1).join(path.sep)
    );
};

module.exports.traverseSync = traverseSync;
