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

                // var con = JSON.stringify(result);
                // fs.writeFile('xxx.json', con, 'utf8', function(err) {
                //     console.log('text out', err);
                // });

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

            // var con = JSON.stringify(result);
            // fs.writeFileSync('xxx2.json', con, 'utf8');
        });

        it('should contains all children in its content', function() {
            var dir = './test/sample';
            var result = DirectoryJsonizer.directoryToObjectSync(dir);
            assert(result.content.length === fs.readdirSync(dir).length);
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
            var outdir = './test';

            DirectoryJsonizer.createDirectoryFromJson(JSON.stringify(result), outdir, 'result');
        });
    });
});

