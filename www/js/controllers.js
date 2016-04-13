angular.module('SimpleRESTIonic.controllers', [])

  .controller('LoginCtrl', function ($scope, Backand, $state, $rootScope, $ionicPopup, LoginService) {

    function showAlert(title, message) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });

      alertPopup.then(function(res) {
        console.log('Thank you for not eating my delicious ice cream cone');
      });
    };

    $scope.login = function(){
      $scope.errorMsg = '';
      LoginService.signin(this.email, this.password)

        .then(function () {
          onLogin();
        }, function (error) {
          //$scope.errorMsg = error.error_description;
          showAlert('Login Error', error.error_description);

        })
    }

    function onLogin(username) {
      $rootScope.$broadcast('authorized');
      $state.go('tabs.home');
      login.username = username || Backand.getUsername();
    }
  })

  .controller('SignUpCtrl', function (Backand, $state, $rootScope, LoginService) {
    var vm = this;

    vm.signup = signUp;

    function signUp() {
      vm.errorMessage = '';

      LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
        .then(function (response) {
          // success
          onLogin();
        }, function (reason) {
          if (reason.data.error_description !== undefined) {
            vm.errorMessage = reason.data.error_description;
          }
          else {
            vm.errorMessage = reason.data;
          }
        });
    }


    function onLogin() {
      $rootScope.$broadcast('authorized');
      $state.go('tab.dashboard');
    }


    vm.email = '';
    vm.password = '';
    vm.again = '';
    vm.firstName = '';
    vm.lastName = '';
    vm.errorMessage = '';
  })

  .controller('DashboardCtrl', function (MenuService, $timeout, $stateParams, $scope,$ionicNavBarDelegate) {
    $ionicNavBarDelegate.showBackButton(true);

    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.$on('$ionicView.beforeEnter', function (event, view) {
      var buttons = document.getElementsByClassName("back-button")
      // var remove_class = 'hide';
      //
      // for(i=0;i<buttons.length;i++){
      //   button = buttons[i];
      //   button.className = button.className.replace(' ' + remove_class, '').replace(remove_class, '');
      // }



      // view.enableBack = true;
      // $ionicNavBarDelegate.showBackButton(true);

      var sectionId = $stateParams.sectionId;

      if (sectionId) {
        MenuService.getMenu().then(function (data) {
          for (i = 0; i < data.sections.length; i++) {
            if (data.sections[i].sectionId === sectionId) {
              var section = angular.copy(data.sections[i]);
              var items = angular.copy(section.items);
              $scope.section = section;
              $scope.section.items = [];



              // add items in order to create animation

              for (var i = 0; i < items.length; i++) {
                (function () {
                  var j = i;
                  $timeout(function () {
                    $scope.section.items[j] = items[j];
                    //$ionicScrollDelegate.resize();
                  }, j * 100);
                })();
              }
              console.log($scope.section);

              break;
            }
          }
        });
      }
    })
  })

  .controller('HomeCtrl', function ($scope, MenuService, $ionicSideMenuDelegate, $ionicNavBarDelegate) {
    // $ionicNavBarDelegate.showBackButton(true);
    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

    function init() {
      var colorArray = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B',
        '#FFC107'];


      MenuService.getMenu().then(function (data) {
        $scope.data = angular.copy(data.sections);
        for (i = 0; i < $scope.data.length; i++) {

          if(i >= colorArray.length){
            $scope.data[i].color = 'background-color: #FF9800;';
          }
          else {
            $scope.data[i].color = 'background-color: ' + colorArray[i];
          }
        }


        $scope.dataReady = true;


        console.log(data)
      });
    }

    init();
  });




