'use strict'

var searchServices = angular.module('searchServices', [])

searchServices.factory('Yts', ['$http', function ($http) {
    var API_URL = '/api/yts/search'

    return {
        search: function (query) {
            var queryString = '?size=20'
            if (query !== undefined) {
                queryString += '&query=' + query
            }
            return $http.get(API_URL + queryString)
        }
    }
}])
