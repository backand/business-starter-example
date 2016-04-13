# ng-persist

- returns $q promises
- works in the browser with [local storage](https://github.com/gsklee/ngStorage)

## Install

```
$ bower install ng-persist ngstorage --save
```

For ios, [KeychainPlugin](https://github.com/shazron/KeychainPlugin) is required:

```
$ cordova plugin add https://github.com/shazron/KeychainPlugin.git
```

For Android, [cordova-plugin-file](https://github.com/apache/cordova-plugin-file) is required:

```
$ cordova plugin add cordova-plugin-file
```

## Usage

Require ng-persist and ngstorage

```js
angular.module('myApp', [
    'ngStorage',
    'ng-persist'
]);
```

Inject ```$persist``` into your controller

```js
.controller('MyCtrl', function($persist) {

    // write
    $persist
        .set(namespace, key, val)
        .then(function () {
            // saved
        });

    // read
    $persist
        .get(namespace, key, fallback)
        .then(function (val) {
            // val is either the value, if exists, or the fallback
        });

    // delete
    $persist
        .remove(namespace, key)
        .then(function () {
            // removed
        });

});
```

## License

MIT
