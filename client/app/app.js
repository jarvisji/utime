/**
 * Created by Ting on 2015/6/19.
 */
angular.module('utimeApp', ['lbServices', 'ui.router', 'ui.tree', 'ngCookies'])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    //$locationProvider.html5Mode(true);
    $stateProvider.state('sign-up', {
      url: '/sign-up',
      templateUrl: 'app/login/user-signup.tpl.html',
      controller: 'loginCtrl'
    });
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'app/login/user-login.tpl.html',
      controller: 'loginCtrl'
    });
    $stateProvider.state('forgot', {
      url: '/forgot',
      templateUrl: 'app/login/user-forgot.tpl.html',
      controller: 'loginCtrl'
    });
    $stateProvider.state('reset', {
      url: '/reset',
      templateUrl: 'app/login/user-reset.tpl.html',
      controller: 'loginCtrl'
    });
    $stateProvider.state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/dashboard/dashboard.tpl.html',
      controller: 'dashboardCtrl'
    });
    $stateProvider.state('profile', {
      url: '/profile',
      templateUrl: 'app/profile/user-profile.tpl.html',
      controller: 'userProfileCtrl'
    });
    $stateProvider.state('todo', {
      url: '/todo',
      templateUrl: 'app/todo/todo.tpl.html',
      controller: 'todoCtrl',
      resolve: {
        userTasks: ['Member', function (Member) {
          return Member.tasks({id: Member.getCurrentId(), filter: {order: 'order DESC'}}).$promise;
        }]
      }
    });
    $stateProvider.state('curriculum', {
      url: '/curriculum',
      templateUrl: 'app/curriculum/curriculum.tpl.html',
      controller: 'curriculumCtrl'
    });
    $urlRouterProvider.otherwise('curriculum');
  }])
  .controller('rootCtrl', ['$scope', '$rootScope', '$state', '$log', function ($scope, $rootScope, $state, $log) {
    // init sessionInfo object at the beginning, other pages can call its properties directly needn't worry about undefined error.
  }]);
