angular.module('SimpleRESTIonic.controllers', [])

  .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
    var login = this;

    function signin() {
      LoginService.signin(login.email, login.password)
        .then(function () {
          onLogin();
        }, function (error) {
          console.log(error)
        })
    }

    function anonymousLogin() {
      LoginService.anonymousLogin();
      onLogin('Guest');
    }

    function onLogin(username) {
      $rootScope.$broadcast('authorized');
      $state.go('tab.dashboard');
      login.username = username || Backand.getUsername();
    }

    function signout() {
      LoginService.signout()
        .then(function () {
          //$state.go('tab.login');
          $rootScope.$broadcast('logout');
          $state.go($state.current, {}, {reload: true});
        })

    }

    function socialSignIn(provider) {
      LoginService.socialSignIn(provider)
        .then(onValidLogin, onErrorInLogin);

    }

    function socialSignUp(provider) {
      LoginService.socialSignUp(provider)
        .then(onValidLogin, onErrorInLogin);

    }

    onValidLogin = function (response) {
      onLogin();
      login.username = response.data || login.username;
    }

    onErrorInLogin = function (rejection) {
      login.error = rejection.data;
      $rootScope.$broadcast('logout');

    }


    login.username = '';
    login.error = '';
    login.signin = signin;
    login.signout = signout;
    login.anonymousLogin = anonymousLogin;
    login.socialSignup = socialSignUp;
    login.socialSignin = socialSignIn;

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

  .controller('DashboardCtrl', function (MenuService, $timeout, $stateParams, $scope) {

    $scope.$on('$ionicView.beforeEnter', function (event, view) {
      // view.enableBack = true;

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
  .controller('HomeCtrl', function ($scope, MenuService, $ionicSideMenuDelegate, $timeout) {
    $scope.toggleLeft = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };

    function init() {
      var colorArray = ['balanced', 'balanced-900', 'balanced-100', 'energized-900', 'energized', 'energized-100', 'calm-900', 'royal', 'balanced', 'energized', 'assertive', 'stable', 'light', 'dark'];


      MenuService.getMenu().then(function (data) {
        $scope.data = angular.copy(data.sections);
        for (i = 0; i < $scope.data.length; i++) {
          $scope.data[i].color = colorArray[i] + '-bg';
        }


        $scope.dataReady = true;


        console.log(data)
      });
    }

    init();
  });




