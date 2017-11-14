'use strict';

var fs = require('fs');
var path = require('path');
var isUtf8 = require('is-utf8');

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
    } else if (stat && stat.isSymbolicLink()) {
        var linkData = fs.readlinkSync(absPath);
        return {
            name: targetName,
            type: 'symlink',
            content: linkData
        };
    } else if (stat && stat.isFile()) {
        var buffer = fs.readFileSync(absPath);
        if (isUtf8(buffer)) {
            return {
                name: targetName,
                type: 'text',
                content: buffer.toString('utf-8')
            };
        } else {
            return {
                name: targetName,
                type: 'binary',
                content: buffer.toString('base64')
            };
        }
    } else {
        throw new Error('Unsupported file type:' + absPath);
    }
};

var traverseSync = function(targetPath) {
    var splitPath = targetPath.split(path.sep);
    return __traverseSync(
        splitPath[splitPath.length - 1],
        splitPath.splice(0, splitPath.length - 1).join(path.sep)
    );
};

module.exports = traverseSync;
