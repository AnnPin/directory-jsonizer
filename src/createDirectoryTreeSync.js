'use strict';

var fs = require('fs');
var path = require('path');

var createDirectoryTreeSync = function(obj, saveIn, saveRootAs) {
    var __createDirectoryTreeSync = function(entry, saveDirPath, isRoot) {
        var absSavePath = path.resolve(saveDirPath, isRoot ? saveRootAs : entry.name);
        switch (entry.type) {
        case 'directory':
            if (!fs.existsSync(absSavePath)) {
                fs.mkdirSync(absSavePath);
            }
            entry.content.forEach(function(child) {
                __createDirectoryTreeSync(child, absSavePath, false);
            });
            break;
        case 'symlink':
            fs.symlinkSync(entry.content, absSavePath);
            break;
        case 'binary':
            var decoded = new Buffer(entry.content, 'base64');
            fs.writeFileSync(absSavePath, decoded);
            break;
        case 'text':
            fs.writeFileSync(absSavePath, entry.content, 'utf8');
            break;
        default:
            throw new Error('Unsupported file type: \'' + entry.type + '\'');
        }
    };

    __createDirectoryTreeSync(obj, saveIn, true);
};

module.exports = createDirectoryTreeSync;
