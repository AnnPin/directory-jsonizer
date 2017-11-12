'use strict';

var fs = require('fs');
var path = require('path');
var isBinaryFile = require('isbinaryfile');

var __traverse = function(targetName, dirPath, done) {
    // get absolute path of target
    var absPath = path.resolve(dirPath, targetName);

    fs.lstat(absPath, function(err, stat) {
        if (err) throw done(err);

        if (stat && stat.isDirectory()) {
            fs.readdir(absPath, function (err, files) {
                if (err) throw done(err);

                var pendingNum = files.length;
                if (pendingNum === 0) {
                    return done(null, {
                        name: targetName,
                        type: 'directory',
                        content: []
                    });
                }

                var children = [];
                files.forEach(function (file) {
                    __traverse(file, absPath, function (err, subdirResult) {
                        if (err) throw done(err);

                        children.push(subdirResult);

                        pendingNum -= 1;
                        if (pendingNum === 0) {
                            done(null, {
                                name: targetName,
                                type: 'directory',
                                content: children
                            });
                        }
                    });
                });
            });
        } else {
            isBinaryFile(absPath, function (err, isUtf8) {
                if (err) throw done(err);

                if (isUtf8) {
                    fs.readFile(absPath, 'base64', function (err, base64Data) {
                        if (err) throw done(err);
                        done(null, {
                            name: targetName,
                            type: 'binary',
                            content: base64Data
                        });
                    });
                } else {
                    fs.readFile(absPath, 'utf-8', function (err, textData) {
                        if (err) throw done(err);
                        done(null, {
                            name: targetName,
                            type: 'text',
                            content: textData
                        });
                    });
                }
            });
        }
    });
};

var traverse = function(targetPath, done) {
    var splitPath = targetPath.split(path.sep);
    __traverse(
        splitPath[splitPath.length - 1],
        splitPath.splice(0, splitPath.length - 1).join(path.sep),
        done
    );
};

module.exports.traverse = traverse;
