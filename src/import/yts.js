var request = require('request')
var client = require('../connection')
var mapping = require('../../config/mapping/yts.json')

client.indices.create({
    index: 'movies',
    body: mapping
}, function (error, response, respcode) {
    if (error) {
        console.log(error.message)
    }
    console.log(response)
})

function indexMovies (page = 1) {
    var query = 'page=' + page
    request('https://yts.ag/api/v2/list_movies.json?' + query, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var movies = JSON.parse(response.body)

            movies.data.movies.forEach(function (movie) {
                var query = 'movie_id=' + movie.id + '&with_cast=true'
                request('https://yts.ag/api/v2/movie_details.json?' + query, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var result = JSON.parse(response.body)
                        client.create({
                            index: 'movies',
                            type: 'movie',
                            id: result.data.movie.id,
                            body: result.data.movie
                        }, function (error, response) {
                            if (error) {
                                console.log(error.message)
                            } else {
                                console.log('Index movie ' + response._id)
                            }
                        })
                    }
                })
            })

            if (movies.data.movies.length === movies.data.limit) {
                page++
                return indexMovies(page)
            }
        }
    })
}

indexMovies()
