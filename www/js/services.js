angular.module('SimpleRESTIonic.services', [])

  .service('APIInterceptor', function ($rootScope, $q) {
    var service = this;

    service.responseError = function (response) {
      if (response.status === 401) {
        $rootScope.$broadcast('unauthorized');
      }
      return $q.reject(response);
    };
  })

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


    service.getMenu = function () {

      if (service.cached) {
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
              service.cached = res.data;
              localStorage.setItem('storedData', JSON.stringify(res.data));
              service.started = undefined;
              deferred.resolve(res.data);
            },
            function () {
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
;

