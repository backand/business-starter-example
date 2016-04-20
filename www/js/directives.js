/**
 * Created by backand on 3/31/16.
 */
var app = angular.module('directivesModule', []);

app.directive('section', function () {

  var controller = ['$scope', 'ionicMaterialMotion', 'ionicMaterialInk', '$timeout', function ($scope, ionicMaterialMotion, ionicMaterialInk, $timeout) {

      function init() {
        $scope.sectionData = $scope.datasource;
        //ionic.material.motion.ripple();
      }

      init();


    }],

    template = `
     <div class="list"> 
        <section-item item=item index=$index ng-repeat="item in datasource.items" />
        </div>
`;

  return {
    restrict: 'EA', //Default in 1.3+
    scope: {
      datasource: '='
    },
    controller: controller,
    template: template
  };
});
app.directive('sectionsMenu', function () {

  var controller = ['$scope', 'MenuService', '$rootScope', 'LoginService', function ($scope, MenuService, $rootScope, LoginService) {

      function init() {
        MenuService.getMenu().then(function (data) {
          $scope.data = data.sections;
        });
      }

      init();

      $scope.refreshCache = function(){
        $rootScope.$broadcast('refreshCache');
      }

      $scope.logout = function () {
        LoginService.signout();
        $rootScope.$broadcast('unauthorized');
      }
    }],

    template = `
    <a ui-sref="tabs.home()" class="item" menu-close>Home</a>
    <a ng-click="refreshCache()" class="item" menu-close>Refresh cache</a>
    <a ng-click="logout()" class="item" menu-close>Logout</a>
    <!--<a ng-repeat="item in data" ui-sref="tabs.dashboard({sectionId: item.sectionId})" class="item" menu-close>{{item.sectionTitle}}</a>    -->
`;

  return {
    restrict: 'EA', //Default in 1.3+
    scope: {
      datasource: '='
    },
    controller: controller,
    template: template
  };
});
app.directive('sectionItem', function (LinkHistoryService) {

  var controller = ['$scope', '$http', function ($scope, $http) {
      $scope.goToUrl = function (item) {
        var url = item.url;
        LinkHistoryService.addLink(url);
        window.open(url, '_system', 'location=yes');

        var scheme;
        var storeUrl;
/*
        if (ionic.Platform.isAndroid()) {
          scheme = item.googleAppId;
          storeUrl = item.googleplayUrl;
        } else if (ionic.Platform.isIOS()) {
          // Don't forget to add the org.apache.cordova.device plugin!
          // if(device.platform === 'iOS') {
          scheme = item.appleUrlscheme;
          storeUrl = item.applestoreUrl;
        }

        item.scheme2 = scheme;
        item.storeUrl2 = storeUrl;

        if(scheme) {
          appAvailability.check(
            scheme, // URI Scheme
            function () {  // Success callback
              window.open(item.appleUrlscheme, '_system', 'location=no');
              console.log('Twitter is available');
            },
            function () {  // Error callback

              item.val = "val " + storeUrl || item.url;
              window.open(storeUrl || item.url, '_system', 'location=no');
            }
          );
        }
        else {
          window.open(url, '_system', 'location=yes');
        }*/

        return false;
      }


      $scope.alreadyViewUrl = function (url) {
        return LinkHistoryService.isAlreadyViewLink(url);
      }
    }
    ],

    template = `
<a class="item item-avatar animated fadeInRight menu-close" ng-click="goToUrl(item)" > 
    <img ng-src="{{item.imgUrl}}" class="imageRound" ng-class="::{myRound: alreadyViewUrl(item.url)}">  
    <h2 ng-class="::{myBold: alreadyViewUrl(item.url)}">{{item.itemTitle}}</h2> 
    <p>{{item.subtitle}}</p> 
        <!--<p>{{item.scheme2}}</p> -->
        <!--<p>{{item.storeUrl2}}</p> -->
        <!--<p>{{item.val}}</p> -->
        <!--<p>{{item.subtitle}}</p> -->
</a> 
`;

  return {
    restrict: 'EA', //Default in 1.3+
    scope: {
      item: '=',
      index: '='
    },
    controller: controller,
    template: template
  }
    ;
})
;
