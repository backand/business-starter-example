/*global angular*/

angular.module('ionicApp',
  [
    'ionic',
    'ionic-material',
    'backand',
    'SimpleRESTIonic.controllers',
    'SimpleRESTIonic.services',
    'directivesModule',
    'ionMdInput'
  ])
  .config(function (BackandProvider) {
    BackandProvider.setAppName('mycompanystart');
    BackandProvider.setSignUpToken('8b87f9fa-f751-4400-bded-6b5adcc9312a');
    BackandProvider.setAnonymousToken('86e22c04-85c5-498a-a6cd-037293f8477c');
  })
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
   // $ionicConfigProvider.backButton.text('      ').icon('ion-ios7-arrow-left');
    $ionicConfigProvider.navBar.alignTitle('center');


  })
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $stateProvider
      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/menu.html'
      })
      .state('tabs.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/tab-home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      .state('tabs.dashboard', {
        url: '/section/:sectionId',
        views: {
          'menuContent': {
            templateUrl: 'templates/tab-dashboard.html',
            controller: 'DashboardCtrl'
          }
        }
      })
      .state('tabs.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/tab-login.html',
            controller: 'LoginCtrl'
          }
        }
      }).state('tabs.startup', {
      url: '/start',
      views: {
        'menuContent': {
          templateUrl: 'templates/tab-startup.html'
        }
      }
    });


    $urlRouterProvider.otherwise('/tab/home');
    $httpProvider.interceptors.push('APIInterceptor');

  })
  .run(function ($ionicPlatform, $rootScope, $state, LoginService, Backand) {

    // $rootScope.$on('$stateChangeSuccess', function() {
    //     $ionicNavBarDelegate.showBackButton(true);
    // });

    $ionicPlatform.ready(function () {

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }


      var isMobile = !(ionic.Platform.platforms[0] == "browser");
      Backand.setIsMobile(isMobile);
      Backand.setRunSignupAfterErrorInSigninSocial(true);

      function unauthorized() {
        console.log("user is unauthorized, sending to login");
        $state.go('tabs.startup');
      }

      $rootScope.$on('unauthorized', function () {
        unauthorized();
      });
    });
  })


/*endglobal angular*/
