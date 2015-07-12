/**
 * Created by Ting on 2015/6/19.
 */
angular.module('utimeWxApp', ['ui.router', 'ngCookies', 'ngAnimate', 'mgcrea.ngStrap'])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
    $stateProvider.state('wx_activate', {
      url: '/activate/:type',
      templateUrl: function ($stateParams) {
          return 'wxapp/activate/activate.' + $stateParams.type + '.tpl.html'
      },
      controller: 'wxActivateCtrl'
    });
    $urlRouterProvider.otherwise('wx_activate');
  }])
  .controller('rootCtrl', ['$scope', '$rootScope', '$state', '$log', function ($scope, $rootScope, $state, $log) {
    // init sessionInfo object at the beginning, other pages can call its properties directly needn't worry about undefined error.

    // init menu
    $scope.menu = [
      {label: '最新通知', location: '/curriculum'},
      {label: '今日作业', location: '/curriculum'},
      {label: '成绩查询', location: '/curriculum'},
      {label: '课程表', location: '/curriculum'},
      {label: '通讯录', location: '/curriculum'},
      {label: '账号绑定', location: '/curriculum'}]
  }]);
