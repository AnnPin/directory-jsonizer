'use strict';

var fs = require('fs');
var path = require('path');

var createDirectoryTree = function(obj, saveIn, saveRootAs, callback) {
    var __createDirectoryTree = function(entry, saveDirPath, isRoot, done) {
        var absSavePath = path.resolve(saveDirPath, isRoot ? saveRootAs : entry.name);

        if (entry.type === 'directory') {
            fs.mkdir(absSavePath, function() {
                // no need to handle errors.
                var pendingNum = entry.content.length;
                if (pendingNum === 0) {
                    done(null);
                }

                entry.content.forEach(function(child) {
                    __createDirectoryTree(child, absSavePath, false, function(err) {
                        if (err) throw done(err);

                        pendingNum--;
                        if (pendingNum === 0) {
                            done(null);
                        }
                    });
                });
            });

        } else if (entry.type === 'symlink') {
            fs.symlink(entry.content, absSavePath, function (err) {
                if (err) throw done(err);
                done(null);
            });

        } else if (entry.type === 'binary') {
            var decoded = new Buffer(entry.content, 'base64');
            fs.writeFile(absSavePath, decoded, function(err) {
                if (err) throw done(err);
                done(null);
            });

        } else if (entry.type === 'text') {
            fs.writeFile(absSavePath, entry.content, 'utf8', function(err) {
                if (err) throw done(err);
                done(null);
            });

        } else {
            throw done(new Error('Unsupported file type: \'' + entry.type + '\''));
        }
    };
    __createDirectoryTree(obj, saveIn, true, callback);
};

module.exports = createDirectoryTree;
