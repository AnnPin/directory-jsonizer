directory-jsonizer
==================

A small library to convert all file contents in a directory and its all subdirectories into a single JSON string.
Once you *json-ize* a directory, you can easily convert it into a JavaScript object and extract text or data from the object.

Install
-------

```sh
$ npm install --save directory-jsonizer
```

Usage
-----

Suppose you have `sample` directory as shown below:

```
./sample/
|
|– foo.js
|
|– encoding/
|  |– euc.js
|  |– sjis.js
|  `– utf8.js
|
`– sub/
   |– bar.js
   |– lena_std.tif
   |– sym-foo.js
   `– sym-sub/
```

To convert this directory into a single JSON string, you have two choices: `directoryToJson()` and `directoryToJsonSync()`.

*  Asynchronous version : `directoryToJson()`

```js
var DirectoryJsonizer = require('directory-jsonizer');
var dir = './sample';
DirectoryJsonizer.directoryToJson(dir, function(err, result) {
    fs.writeFile('converted.json', result, 'utf8', function(err) {
        if (err) throw err;
        console.log('completed');
    });
});
```

*  Synchronous version : `directoryToJsonSync()`

```js
var DirectoryJsonizer = require('directory-jsonizer');
var dir = './sample';
var result = DirectoryJsonizer.directoryToJsonSync(dir);
fs.writeFile('convertedSync.json', result, 'utf8', function(err) {
    if (err) throw err;
    console.log('completed');
});
```

As a result, you will obtain the JSON string below containing all contents in `sample` directory:

```json
{
    "name": "sample", 
    "type": "directory",
    "content": [
        {
            "name": "foo.js", 
            "type": "text",
            "content": "console.log('foo'); "
        }, 
        {
            "name": "encoding", 
            "type": "directory",
            "content": [
                {
                    "name": "euc.js", 
                    "type": "binary",
                    "content": "Y29uc29sZS5sb2coJ0VVQ8q4u/rO8ycpOwo=" (Base64 encoded)
                }, 
                {
                    "name": "sjis.js", 
                    "type": "binary",
                    "content": "Y29uc29sZS5sb2coJ4NWg3SDZ0pJU5W2jpqX8ScpOwo=" (Base64 encoded)
                }, 
                {
                    "name": "utf8.js", 
                    "type": "text",
                    "content": "console.log('😃UTF8文字列😃'); "
                }
            ] 
        }, 
        {
            "name": "sub", 
            "type": "directory",
            "content": [
                {
                    "name": "bar.js", 
                    "type": "text",
                    "content": "console.log('bar'); "
                }, 
                {
                    "name": "lena_std.tif", 
                    "type": "binary",
                    "content": "TU0AKgAMAAjiiX3iiX3fiYXfiIDiinjigXTkin..." (Base64 encoded)
                }, 
                {
                    "name": "sym-foo.js", 
                    "type": "symlink",
                    "content": "../foo.js"
                }, 
                {
                    "name": "sym-sub", 
                    "type": "symlink",
                    "content": "../sub"
                }
            ]
        }
    ]
}
```

In the result JSON string, each file or directory is represented as a object having three properties: `name`, `type` and `content`.
*  `name` property contains the name of each file or directory.
*  `type` property indicates the type of the file. The supported file types are `'directory'`, `'text'`, `'binary'` and `'symlink'`.
*  `content` property contains the file content. This property can have different data types and values depending on the value of `type` property.
    -  When `type = 'directory'`, `content` property contains `array` of child file objects.
    -  When `type = 'text'`, `content` property contains `string` of text (UTF-8 only).
    -  When `type = 'binary'`, `content` property contains `string` of Base64 encoded binary content.
    -  When `type = 'symlink'`, `content` property contains `string` of symbolic link target.

###  Notice

*  All binary files in the directory are encoded with Base64 and embedded into the result JSON string.
*  In the current version, this library regards **only UTF-8 text files** as *text files* and all the other text formats (UTF-16, EUC etc.) are regarded as *binary files* (and encoded with Base64).
    -  This is because auto charset detection excepting UTF-8 is quite heuristically guessing process and misunderstood guessing could lead to data corruptions.

API
---

*  `directoryToObject(path, callback)`
    -  Generate JS object form directory tree.
    -  path
        +  type: string
        +  description: Path to the directory or file.
    -  callback
        +  type: function(err, res)
        +  description: Callback function. The result object are stored in `res` variable.


*  `directoryToJson(path, callback)`
    -  Generate JSON string form directory tree.
    -  path
        +  type: string
        +  description: Path to the directory or file.
    -  callback
        +  type: function(err, res)
        +  description: Callback function. The result JSON string are stored in `res` variable.


*  `createDirectoryFromObject(obj, saveIn, saveRootAs, callback)`
    -  Generate directory tree from object. (Reverse operation of `directoryToObject()`)
    -  obj
        +  type: Object
        +  description: The object containing all directory content.
    -  saveIn
        +  type: string
        +  descripton: Path to the directory where the result directory tree will be placed.
    -  saveRootAs
        +  type: string
        +  descripton: The name of root file/directory. If you want to use default name, set this parameter to null string `''`.
    -  callback
        +  type: function(err)
        +  description: Callback function. `err` will be `null ` if no error occurs.


*  `createDirectoryFromJson(json, saveIn, saveRootAs, callback)`
    -  Generate directory tree from JSON string. (Reverse operation of `directoryToJson()`)
    -  json
        +  type: string
        +  description: The json string containing all directory content.
    -  saveIn
        +  type: string
        +  descripton: Path to the directory where the result directory tree will be placed.
    -  saveRootAs
        +  type: string
        +  descripton: The name of root file/directory. If you want to use default name, set this parameter to null string `''`.
    -  callback
        +  type: function(err)
        +  description: Callback function. `err` will be `null ` if no error occurs.


*  `directoryToObjectSync(path)`
    -  Generate JS object form directory tree.
    -  path
        +  type: string
        +  description: Path to the directory or file.
    -  return value
        +  type: Object
        +  description: The object containing all content of the directory.


*  `directoryToJsonSync(path)`
    -  Generate JSON string form directory tree.
    -  path
        +  type: string
        +  description: Path to the directory or file.
    -  return value
        +  type: string
        +  description: The JSON string containing all content of the directory.


*  `createDirectoryFromObjectSync(obj, saveIn, saveRootAs)`
    -  Generate directory tree from object. (Reverse operation of `directoryToObjectSync()`)
    -  obj
        +  type: Object
        +  description: The object containing all directory content.
    -  saveIn
        +  type: string
        +  descripton: Path to the directory where the result directory tree will be placed.
    -  saveRootAs
        +  type: string
        +  descripton: The name of root file/directory. If you want to use default name, set this parameter to null string `''`.
    -  return value
        +  n/a


*  `createDirectoryFromJsonSync(json, saveIn, saveRootAs)`
    -  Generate directory tree from JSON string. (Reverse operation of `directoryToJsonSync()`)
    -  json
        +  type: string
        +  description: The json string containing all directory content.
    -  saveIn
        +  type: string
        +  descripton: Path to the directory where the result directory tree will be placed.
    -  saveRootAs
        +  type: string
        +  descripton: The name of root file/directory. If you want to use default name, set this parameter to null string `''`.
    -  return value
        +  n/a


License
-------

MIT

