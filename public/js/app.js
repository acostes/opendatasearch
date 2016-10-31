'use strict'

var searchApp = angular.module('searchApp', [
    'ngRoute',
    'searchServices',
    'searchControllers'
])

searchApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
            .when('/yts', {
                templateUrl: 'views/yts.html',
                controller: 'YtsCtrl'
            })
            .otherwise({
                redirectTo: '/'
            })
    }
])
