'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('power-assert');
var del = require('del');
var DirectoryJsonizer = require('../src/index');

describe('DirectoryJsonizer', function() {
    before(function() {
        var productPath = './product';
        if (!fs.existsSync(productPath)) {
            fs.mkdirSync(productPath);
        }
        del.sync(['./product/*']);
    });

    describe('#directoryToObject()', function() {
        it('should return the object and its name property is the name of root file (directory)', function(done) {
            var dir = './test/sample';
            DirectoryJsonizer.directoryToObject(dir, function(err, result) {
                assert(err === null);
                assert(result.name === 'sample');
                done();
            });
        });

        it('should contains all children in its content', function(done) {
            var dir = './test/sample';
            DirectoryJsonizer.directoryToObject(dir, function(err, result) {
                assert(err === null);
                assert(result.content.length === fs.readdirSync(dir).length);
                done();
            });
        });

        it('should return the object and its name property is the name of root file (file)', function (done) {
            var dir = './test/sample/foo.js';
            DirectoryJsonizer.directoryToObject(dir, function(err, result) {
                assert(err === null);
                assert(result.name === 'foo.js');
                done();
            });
        });
    });

    describe('#directoryToJson()', function() {
        it('should return result json string', function(done) {
            var dir = './test/sample';
            DirectoryJsonizer.directoryToJson(dir, function(err, result) {
                assert(err === null);
                assert(result.constructor === String);
                fs.writeFile('./product/converted.json', result, 'utf8', function(err) {
                    assert(err === null);
                });

                done();
            });
        });
    });

    describe('#directoryToObjectSync()', function() {
        it('should return the object and its name property is the name of root file (directory)', function() {
            var dir = './test/sample';
            var result = DirectoryJsonizer.directoryToObjectSync(dir);
            assert(result.name === 'sample');
        });

        it('should contains all children in its content', function() {
            var dir = './test/sample';
            var result = DirectoryJsonizer.directoryToObjectSync(dir);
            assert(result.content.length === fs.readdirSync(dir).length);
        });

        it('should return the object and its name property is the name of root file (file)', function () {
            var dir = './test/sample/foo.js';
            var result = DirectoryJsonizer.directoryToObjectSync(dir);
            assert(result.name === 'foo.js');
        });
    });

    describe('#directoryToJsonSync()', function() {
        it('should return result json string', function() {
            var dir = './test/sample';
            var result = DirectoryJsonizer.directoryToJsonSync(dir);
            assert(result.constructor === String);
            fs.writeFile('./product/convertedSync.json', result, 'utf8', function(err) {
                assert(err === null);
            });
        });
    });

    describe('#createDirectoryFromJson()', function() {
        it('should create directory from input json string (the directory name will be default)', function(done) {
            var dir = './test/sample';
            DirectoryJsonizer.directoryToJson(dir, function(err, result) {
                assert(err === null);
                var outdir = './product';
                var rootName = '';
                DirectoryJsonizer.createDirectoryFromJson(result, outdir, rootName, function(err) {
                    assert(err === null);
                    assert(fs.existsSync(path.resolve(outdir, rootName)) === true);
                    done();
                });
            });
        });

        it('should create directory from input json string', function(done) {
            var dir = './test/sample';
            DirectoryJsonizer.directoryToJson(dir, function(err, result) {
                assert(err === null);
                var outdir = './product';
                var rootName = 'restored';
                DirectoryJsonizer.createDirectoryFromJson(result, outdir, rootName, function(err) {
                    assert(err === null);
                    assert(fs.existsSync(path.resolve(outdir, rootName)) === true);
                    done();
                });
            });
        });
    });

    describe('#createDirectoryFromJsonSync()', function() {
        it('should create directory from input json string', function() {
            var dir = './test/sample';
            var result = DirectoryJsonizer.directoryToJsonSync(dir);
            var outdir = './product';
            var rootName = 'restoredSync';
            DirectoryJsonizer.createDirectoryFromJsonSync(result, outdir, rootName);
            assert(fs.existsSync(path.resolve(outdir, rootName)) === true);
        });
    });
});

