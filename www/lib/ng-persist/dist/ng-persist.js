"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

(function () {

    "use strict";

    angular.module("ng-persist", []);

    var $persist = function ($q, $localStorage) {

        var isBrowser = false;
        var isIos = false;
        var isAndroid = false;

        if (!window.cordova && !window.device && !window.Keychain) {
            isBrowser = true;
        } else {
            isAndroid = window.device.platform === "Android";
            isIos = window.device.platform === "iOS";
        }

        var LocalStorageAdapter = (function () {
            function LocalStorageAdapter() {
                _classCallCheck(this, LocalStorageAdapter);
            }

            _createClass(LocalStorageAdapter, {
                read: {
                    value: function read(namespace, key) {
                        var deferred = $q.defer();
                        var val = $localStorage["" + namespace + "_" + key];
                        deferred.resolve(val);
                        return deferred.promise;
                    }
                },
                write: {
                    value: function write(namespace, key, val) {
                        var deferred = $q.defer();
                        $localStorage["" + namespace + "_" + key] = val;
                        deferred.resolve();
                        return deferred.promise;
                    }
                },
                remove: {
                    value: function remove(namespace, key) {
                        var deferred = $q.defer();
                        delete $localStorage["" + namespace + "_" + key];
                        deferred.resolve();
                        return deferred.promise;
                    }
                }
            });

            return LocalStorageAdapter;
        })();

        var IosKeychainAdapter = (function () {
            function IosKeychainAdapter() {
                _classCallCheck(this, IosKeychainAdapter);
            }

            _createClass(IosKeychainAdapter, {
                read: {
                    value: function read(namespace, key) {
                        var deferred = $q.defer();
                        var kc = new window.Keychain();
                        kc.getForKey(function (val) {
                            if (val !== "") {
                                val = JSON.parse(val);
                            } else {
                                val = null;
                            }
                            deferred.resolve(val);
                        }, function (err) {
                            deferred.reject(err);
                        }, key, namespace);
                        return deferred.promise;
                    }
                },
                write: {
                    value: function write(namespace, key, val) {
                        var deferred = $q.defer();
                        var kc = new window.Keychain();
                        val = JSON.stringify(val);
                        kc.setForKey(function () {
                            deferred.resolve();
                        }, function (err) {
                            deferred.reject(err);
                        }, key, namespace, val);
                        return deferred.promise;
                    }
                },
                remove: {
                    value: function remove(namespace, key) {
                        var deferred = $q.defer();
                        var kc = new window.Keychain();
                        kc.removeForKey(function () {
                            deferred.resolve();
                        }, function (err) {
                            deferred.reject(err);
                        }, key, namespace);
                        return deferred.promise;
                    }
                }
            });

            return IosKeychainAdapter;
        })();

        var AndroidExternalStorageAdapter = (function () {
            function AndroidExternalStorageAdapter() {
                _classCallCheck(this, AndroidExternalStorageAdapter);
            }

            _createClass(AndroidExternalStorageAdapter, {
                read: {
                    value: function read(namespace, key) {
                        var deferred = $q.defer();
                        var filename = "" + namespace + "_" + key;
                        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory + filename, function (fileEntry) {
                            fileEntry.file(function (file) {
                                var reader = new FileReader();
                                reader.onloadend = function (evt) {
                                    var res = evt.target.result;
                                    if (res !== "") {
                                        res = JSON.parse(res);
                                    } else {
                                        res = null;
                                    }
                                    deferred.resolve(res);
                                };
                                reader.readAsText(file);
                            });
                        }, function (err) {
                            deferred.reject(err);
                        });
                        return deferred.promise;
                    }
                },
                write: {
                    value: function write(namespace, key, val) {
                        var deferred = $q.defer();
                        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {
                            var filename = "" + namespace + "_" + key;
                            dir.getFile(filename, { create: true }, function (file) {
                                if (!file) {
                                    deferred.reject();
                                }
                                file.createWriter(function (fileWriter) {
                                    // fileWriter.seek(fileWriter.length);
                                    var blob = new Blob([JSON.stringify(val)], { type: "text/plain" });
                                    fileWriter.write(blob);
                                    deferred.resolve();
                                }, function (err) {
                                    deferred.reject(err);
                                });
                            });
                        });
                        return deferred.promise;
                    }
                },
                remove: {
                    value: function remove(namespace, key) {
                        var deferred = $q.defer();
                        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function (dir) {
                            var filename = "" + namespace + "_" + key;
                            dir.getFile(filename, { create: true }, function (file) {
                                if (!file) {
                                    deferred.reject();
                                }
                                file.createWriter(function (fileWriter) {
                                    // fileWriter.seek(fileWriter.length);
                                    var blob = new Blob([""], { type: "text/plain" });
                                    fileWriter.write(blob);
                                    deferred.resolve();
                                }, function (err) {
                                    deferred.reject(err);
                                });
                            });
                        });
                        return deferred.promise;
                    }
                }
            });

            return AndroidExternalStorageAdapter;
        })();

        var getAdapter = function () {
            if (isBrowser) {
                return new LocalStorageAdapter();
            } else if (isIos) {
                return new IosKeychainAdapter();
            } else if (isAndroid) {
                return new AndroidExternalStorageAdapter();
            }
        };

        return {
            set: function set() {
                var namespace = arguments[0] === undefined ? "" : arguments[0];
                var key = arguments[1] === undefined ? null : arguments[1];
                var val = arguments[2] === undefined ? "" : arguments[2];

                var deferred = $q.defer();
                var adapter = getAdapter();
                adapter.write(namespace, key, val).then(function () {
                    deferred.resolve(val);
                })["catch"](function (err) {
                    // if not browser, write to local storage
                    // otherwise reject
                    if (!isBrowser) {
                        var localStorageAdapter = new LocalStorageAdapter();
                        return localStorageAdapter.write(namespace, key, val);
                    } else {
                        deferred.reject(err);
                    }
                });
                return deferred.promise;
            },
            get: function get() {
                var namespace = arguments[0] === undefined ? "" : arguments[0];
                var key = arguments[1] === undefined ? null : arguments[1];
                var fallback = arguments[2] === undefined ? "" : arguments[2];

                var deferred = $q.defer();
                var adapter = getAdapter();
                adapter.read(namespace, key).then(function (val) {
                    if (val) {
                        deferred.resolve(val);
                    } else {
                        deferred.resolve(fallback);
                    }
                })["catch"](function () {
                    // always resolve with the fallback value
                    deferred.resolve(fallback);
                });
                return deferred.promise;
            },
            remove: function remove(namespace, key) {
                var adapter = getAdapter();
                return adapter.remove(namespace, key);
            } };
    };
    $persist.$inject = ["$q", "$localStorage"];
    angular.module("ng-persist").factory("$persist", $persist);
})();