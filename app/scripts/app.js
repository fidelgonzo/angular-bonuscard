'use strict';

/**
 * @ngdoc overview
 * @name angularYeoApp
 * @description
 * # angularYeoApp
 *
 * Main module of the application.
 */
angular
  .module('angularYeoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.grid'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/bonuscard', {
        templateUrl: 'views/bonuscard.html',
        controller: 'BonusCardCtrl',
        controllerAs: 'bonus'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
