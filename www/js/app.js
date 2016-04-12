/*global angular*/

angular.module('ionicApp',
  [
    'ionic',
    'ionic-material',
    'backand',
    'SimpleRESTIonic.controllers',
    'SimpleRESTIonic.services',
    'directivesModule'
  ])
  .config(function (BackandProvider) {
    BackandProvider.setAppName('mycompanystart');
    BackandProvider.setSignUpToken('8b87f9fa-f751-4400-bded-6b5adcc9312a');
    BackandProvider.setAnonymousToken('86e22c04-85c5-498a-a6cd-037293f8477c');
  })

  .run(function ($ionicPlatform, $rootScope, $state, Backand) {

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
    });
  })
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.backButton.text('      ').icon('ion-ios7-arrow-left');

  })
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('tabs', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/event-menu.html'
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
      });


    $urlRouterProvider.otherwise('/tab/home');
  })


/*endglobal angular*/
