# Opendatasearch

Search and visualize data accross mutiple sources. Allow you to declare a source of data that can be indexed in elasticsearch. Then you can visualize thoses data and filter the result with mutiple of facets.

This used:

* Node
* Express
* Elasticsearch
* Bower
* Gulp

## Installation
    npm install && bower install

Then go to http://localhost:8080. If you want to import data source `npm run import`

## Declare a new data source

In the example bellow you should replace `[source]` by your source name provider.

### Mapping
First you need to declare the mapping you want to used for the aggregation. Read [Elasticsearch document](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html) about aggregation. See the sample used for YTS:

```json
{
    "mappings": {
        "movie": {
            "properties": {
                "cast" : {
                    "properties": {
                        "name": {
                            "type": "string",
                            "fields": {
                                "raw" : {
                                    "type": "string",
                                    "index": "not_analyzed"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

Put this file in `config/mapping/[source].json`

### Import data into eslasticsearch

In `src/import/[source].json` you can code the importation function of your data in elasticsearch

```js
var client = require('../connection')
var mapping = require('../../config/mapping/[source].json')

client.indices.create({
    index: 'source index',  // fill this
    body: mapping
}, function (error, response, respcode) {
    if (error) {
        console.log(error.message)
    }
    console.log(response)
})
```

You should required your mapping to inject in elasticsearch with the `client.indices.create` function. And specified an index.

### API declaration

You have to declare an endpoint for the API that return your result

```js
module.exports = function (app) {
    var client = require('../src/connection')

    app.get('/api/[source]/search', function (req, res) {
        // Body of you request to elasticsearch
        var body = {

        }

        // Perform the request
        client.search({
            index: 'source index', // fill this
            type: 'type of document', // fill this
            body: body
        }, function (error, response) {
            if (error) {
                res.send(error)
            } else {
                res.send(response)
            }
        })
    })
}
```

### Set up the angular part for the front

Add a new route provider in `public/js/app.js`

```js
.when('/[source]', {
    templateUrl: 'views/[source].html',
    controller: '[source]Ctrl'
})
```

Provide a new service to fetch your result in `public/js/services.js`

```js
searchServices.factory('[Source]', ['$http', function ($http) {
    var API_URL = '/api/[source]/search'
    return {
        search: function (query) {
            var queryString = '';
            return $http.get(API_URL + queryString)
        }
    }
}])
```

Declare a new controller in  `public/js/controllers.js`

```js
searchControllers.controller('[source]Ctrl', ['$scope', '[source]', function ($scope, Search) {
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
```

For more information see the sample in the repo that provide movies from YTS.