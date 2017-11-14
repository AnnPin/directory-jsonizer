'use strict';

var fs = require('fs');
var path = require('path');
var isUtf8 = require('is-utf8');

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
        } else if (stat && stat.isSymbolicLink()) {
            fs.readlink(absPath, function (err, linkData) {
                if (err) throw done(err);
                done(null, {
                    name: targetName,
                    type: 'symlink',
                    content: linkData
                });
            });
        } else if (stat && stat.isFile()) {
            fs.readFile(absPath, function (err, buffer) {
                if (err) throw done(err);

                if (isUtf8(buffer)) {
                    done(null, {
                        name: targetName,
                        type: 'text',
                        content: buffer.toString('utf-8')
                    });
                } else {
                    done(null, {
                        name: targetName,
                        type: 'binary',
                        content: buffer.toString('base64')
                    });
                }
            });
        } else {
            throw done(new Error('Unsupported file type:' + absPath));
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

module.exports = traverse;
