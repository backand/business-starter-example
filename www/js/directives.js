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

  var controller = ['$scope', 'MenuService', '$rootScope', 'LoginService',  function ($scope, MenuService, $rootScope, LoginService) {

      function init() {
        MenuService.getMenu().then(function (data) {
          $scope.data = data.sections;
        });
      }

      init();

      $scope.logout = function(){
        LoginService.signout();
        $rootScope.$broadcast('unauthorized');
      }
    }],

    template = `
    <a ng-click="logout()" class="item" menu-close>Logout</a>
    <a href="/#/tab/home" class="item" menu-close>Home</a>
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
app.directive('sectionItem', function () {

  var controller = ['$scope', '$http', function ($scope, $http) {
      $scope.goToUrl = function (url) {
        window.open(url, '_system', 'location=yes');
        return false;
      }


    }],

    template = `
<a class="item item-avatar animated fadeInRight menu-close" ng-click="goToUrl(item.url)"> 
    <img ng-src="{{item.imgUrl}}" style="border: gray; border-style: solid; border-width: 2px;"> 
    <h2>{{item.itemTitle}}</h2> 
    <p>{{item.subtitle}}</p> 
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
});
