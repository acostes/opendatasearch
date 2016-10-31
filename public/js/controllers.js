'use strict'

var searchControllers = angular.module('searchControllers', [])

searchControllers.controller('YtsCtrl', ['$scope', 'Yts', function ($scope, Search) {
    $scope.searchData = function (query) {
        Search.search(query).then(function (response) {
            $scope.result = response.data
            $scope.aggregations = response.data.aggregations
        })
    }
    $scope.$watch('[search]', function () {
        if ($scope.search !== '') {
            $scope.searchData($scope.search)
        }
    }, true)
}])
