/**
 * Created by Ting on 2015/6/19.
 */
angular.module('utimeApp')
  .controller('curriculumCtrl', ['$scope', '$state', 'Curriculum', function ($scope, $state, Curriculum) {

    var testData = {
      userId: 'testUserId',
      classId: 'testClassId'
    };

    $scope.courses = [
      {dayOfWeek: 1, title: '星期一', curriculum: [{title: 'mon'}, {title: 'mon2'}]},
      {dayOfWeek: 2, title: '星期二', curriculum: [{title: 'thu1'}, {title: 'thu2'}]}
    ];


    Curriculum.find({where: {classId: testData.classId}}, function (success) {
      console.log(success);
    });

    $scope.addCourse = function (indexOfWeek) {
      $scope.courses[indexOfWeek].curriculum.push({})
    };

    $scope.saveCourse = function () {
      $scope.courses = [
        {
          "name": "string",
          "teacher": "string",
          "dayOfWeek": "int",
          "startTime": "date",
          "endTime": "date",
          "date": "date|optional",
          "memo": "string"
        }
      ];
    };

    $scope.deleteCourse = function (selectedDay, index) {
      selectedDay.curriculum.splice(index, 1)
    }
  }]);
