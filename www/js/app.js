

angular.module('starter', ['nemLogging','ui-leaflet','ionic', 'starter.controllers', 'starter.services','ui.bootstrap'])
  .constant('processENV', {
   "development": {
     "username": "nickcadiente",
     "password": null,
     "database": "bike_hawaii",
     "host": "127.0.0.1",
     "dialect": "postgres",
     "domain" : "http://localhost:4000/"
   },
   "test": {
     "username": "postgres",
     "password": null,
     "database": "bike_hawaii",
     "host": "127.0.0.1",
     "dialect": "postgres"
   },
   "production": {
     "username": "postgres",
     "password": null,
     "database": "bike_hawaii",
     "host": "127.0.0.1",
     "dialect": "postgres",
     "domain" : "ridehawaii.com"
   }
 })
.run(function($rootScope, $ionicLoading, $ionicPlatform) {
    // $rootScope.$on('loading:show', function() {
    //   $ionicLoading.show({template: 'Hi There!'});
    // });

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
    });

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  //GLOBALLY CREATING INTERCEPTORS WHILE WINDOW LOADS
  // $httpProvider.interceptors.push(function ($rootScope) {
  //   return {
  //     request : function(config) {
  //       $rootScope.$broadcast('loading:show');
  //       return config;
  //     },
  //     response: function(response) {
  //       $rootScope.$broadcast('loading:hide');
  //       return response;
  //     }
  //   };
  // });
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

    $stateProvider
      .state('tabs', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })
      .state('tabs.home', {
        url: "/home",
        views: {
          'home-tab': {
            templateUrl: "templates/home.html",
            controller: 'MapCtrl'
          }
        }
      })
      .state('tabs.facts', {
        url: "/facts",
        views: {
          'home-tab': {
            templateUrl: "templates/facts.html"
          }
        }
      })
      .state('tabs.facts2', {
        url: "/facts2",
        views: {
          'home-tab': {
            templateUrl: "templates/facts2.html"
          }
        }
      });
      // .state('tabs.about', {
      //   url: "/about",
      //   views: {
      //     'about-tab': {
      //       templateUrl: "templates/about.html"
      //     }
      //   }
      // })
      // .state('tabs.navstack', {
      //   url: "/navstack",
      //   views: {
      //     'about-tab': {
      //       templateUrl: "templates/nav-stack.html"
      //     }
      //   }
      // })
      // .state('tabs.contact', {
      //   url: "/contact",
      //   views: {
      //     'contact-tab': {
      //       templateUrl: "templates/contact.html"
      //     }
      //   }
      // });


     $urlRouterProvider.otherwise("/tab/home");

  });
