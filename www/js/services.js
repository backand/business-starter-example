angular.module('SimpleRESTIonic.services', [])

  .service('APIInterceptor', function ($rootScope, $q) {
    var service = this;

    service.responseError = function (response) {
      if (response.status === 401) {
        $rootScope.$broadcast('unauthorized');
      }
      return response;
    };
  })
  /**
   * Service that handle and get Menu from Backand service
   * Handle cache for offline use,
   * and handle concurrency of multiple requests
   * before first request finish
   */
  .service('MenuService', function ($http, $q, Backand) {


    var service = this;

    getMenuInner = function () {
      console.log('start inner');
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/objects/root/1?deep=true',
        params: {}
      })
    }


    service.getMenu = function (forceRefresh) {

      if (service.cached && !forceRefresh) {
        return $q.resolve(service.cached);
      }

      // handle case of multiple calls
      if (service.started) {
        return service.started;
      }
      else {

        var deferred = $q.defer();

        service.started = deferred.promise;
        getMenuInner()
          .then(function (res) {
              if (res.status === 200) {
                service.cached = res.data;
                localStorage.setItem('storedData', JSON.stringify(res.data));
                deferred.resolve(res.data);
              }
            
              service.started = undefined;
            },
            function () {
              service.started = undefined;

              // have an error from html service.
              // try to get from cache

              console.log('call $persist');

              var strData = localStorage.getItem('storedData')

              if (strData) {
                data = JSON.parse(strData);
                deferred.resolve(data);
                return;
              }

              deferred.reject(new Error("can't find data in cache"));
            })
          .finally(function () {
            console.log('finally');
            service.started = undefined;
          });

        return deferred.promise;
      }
    }


// function getUrl() {
//     return Backand.getApiUrl() + baseUrl + objectName;
// }
//
// function getUrlForId(id) {
//     return getUrl() + id;
// }
//
// service.all = function () {
//     return $http.get(getUrl());
// };
//
// service.fetch = function (id) {
//     return $http.get(getUrlForId(id));
// };
//
// service.create = function (object) {
//     return $http.post(getUrl(), object);
// };
//
// service.update = function (id, object) {
//     return $http.put(getUrlForId(id), object);
// };
//
// service.delete = function (id) {
//     return $http.delete(getUrlForId(id));
// };
  })
  /**
   * Service that handle link history, to change apearance of already view links
   */
  .service('LinkHistoryService', function () {
    var key = 'historyLink';
    var service = this;


    service.isAlreadyViewLink = function (link) {
      var strData = localStorage.getItem(key)
      var list = JSON.parse(strData);

      // check link exist in the list
      if (list && list.indexOf(link) > -1) {
        return true;
      }

      return false;
    }

    service.clearList = function () {
      localStorage.setItem(key, '[]');
    }

    service.addLink = function (link) {
      var strData = localStorage.getItem(key)
      var list = JSON.parse(strData) || [];

      // check item not exist
      if (list.indexOf(link) === -1) {
        list.push(link);
        localStorage.setItem(key, JSON.stringify(list));
      }

    }


  })

  .service('LoginService', function (Backand) {
    var service = this;

    service.signin = function (email, password) {
      //call Backand for sign in
      return Backand.signin(email, password);
    };

    service.anonymousLogin = function () {
      // don't have to do anything here,
      // because we set app token att app.js
    }

    service.socialSignIn = function (provider) {
      return Backand.socialSignIn(provider);
    };

    service.socialSignUp = function (provider) {
      return Backand.socialSignUp(provider);

    };

    service.signout = function () {
      return Backand.signout();
    };

    service.signup = function (firstName, lastName, email, password, confirmPassword) {
      return Backand.signup(firstName, lastName, email, password, confirmPassword);
    }
  })

  .service('AuthService', function ($http, Backand) {

    var self = this;
    var baseUrl = Backand.getApiUrl() + '/1/objects/';
    self.appName = '';//CONSTS.appName || '';
    self.currentUser = {};

    loadUserDetails();

    function loadUserDetails() {
      self.currentUser.name = Backand.getUsername();
      if (self.currentUser.name) {
        getCurrentUserInfo()
          .then(function (data) {
            self.currentUser.details = data;
          });
      }
    }

    self.getSocialProviders = function () {
      return Backand.getSocialProviders()
    };

    self.socialSignIn = function (provider) {
      return Backand.socialSignIn(provider)
        .then(function (response) {
          loadUserDetails();
          return response;
        });
    };

    self.socialSignUp = function (provider) {
      return Backand.socialSignUp(provider)
        .then(function (response) {
          loadUserDetails();
          return response;
        });
    };

    self.setAppName = function (newAppName) {
      self.appName = newAppName;
    };

    self.signIn = function (username, password, appName) {
      return Backand.signin(username, password, appName)
        .then(function (response) {
          loadUserDetails();
          return response;
        });
    };

    self.signUp = function (firstName, lastName, username, password, parameters) {
      return Backand.signup(firstName, lastName, username, password, password, parameters)
        .then(function (signUpResponse) {

          if (signUpResponse.data.currentStatus === 1) {
            return self.signIn(username, password)
              .then(function () {
                return signUpResponse;
              });

          } else {
            return signUpResponse;
          }
        });
    };

    self.changePassword = function (oldPassword, newPassword) {
      return Backand.changePassword(oldPassword, newPassword)
    };

    self.requestResetPassword = function (username) {
      return Backand.requestResetPassword(username, self.appName)
    };

    self.resetPassword = function (password, token) {
      return Backand.resetPassword(password, token)
    };

    self.logout = function () {
      Backand.signout().then(function () {
        angular.copy({}, self.currentUser);
      });
    };

    function getCurrentUserInfo() {
      return $http({
        method: 'GET',
        url: baseUrl + "users",
        params: {
          filter: JSON.stringify([{
            fieldName: "email",
            operator: "contains",
            value: self.currentUser.name
          }])
        }
      }).then(function (response) {
        if (response.data && response.data.data && response.data.data.length == 1)
          return response.data.data[0];
      });
    }

  });
;

