'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('power-assert');
var DirectoryJsonizer = require('../src/index');

describe('DirectoryJsonizer', function() {
    describe('#directoryToObject()', function() {
        it('should return the object and its name property is its name (directory)', function(done) {
            var dir = './test/sample';
            DirectoryJsonizer.directoryToObject(dir, function(err, result) {
                assert(err === null);
                assert(result.name === 'sample');
                var con = JSON.stringify(result);

                fs.writeFile('xxx.json', con, 'utf8', function(err) {
                    console.log('text out', err);
                });

                done();
            });
        });

        it('should contains all children in its content', function(done) {
            var dir = './test/sample';
            DirectoryJsonizer.directoryToObject(dir, function(err, result) {
                assert(err === null);
                assert(result.content.length === 6);
                done();
            });
        });

        it('should return the object and its name property is its name (file)', function (done) {
            var dir = './test/sample/foo.js';
            DirectoryJsonizer.directoryToObject(dir, function(err, result) {
                assert(err === null);
                assert(result.name === 'foo.js');
                done();
            });
        });
    });

    describe('#directoryToObjectSync()', function() {
        it('should return the object and its name property is its name (directory)', function() {
            var dir = './test/sample';
            var result = DirectoryJsonizer.directoryToObjectSync(dir);
            assert(result.name === 'sample');

            var con = JSON.stringify(result);
            fs.writeFileSync('xxx2.json', con, 'utf8');
        });

        it('should contains all children in its content', function() {
            var dir = './test/sample';
            var result = DirectoryJsonizer.directoryToObjectSync(dir);
            assert(result.content.length === 6);
        });

        it('should return the object and its name property is its name (file)', function () {
            var dir = './test/sample/foo.js';
            var result = DirectoryJsonizer.directoryToObjectSync(dir);
            assert(result.name === 'foo.js');
        });
    });

    describe('test', function() {
        it('', function() {
            var dir = './test/sample';
            var result = DirectoryJsonizer.directoryToObjectSync(dir)

            var outdir = './test/result2';
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
        });
    });
});

