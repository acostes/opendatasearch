module.exports = function (app) {
    var client = require('../src/connection')

    app.get('/api/yts/search', function (req, res) {
        var body = {
            'aggregations': {
                'genres': {
                    'terms': {
                        'field': 'genres.raw',
                        'size': 10
                    }
                },
                'cast': {
                    'terms': {
                        'field': 'cast.name.raw',
                        'size': 10
                    }
                },
                'language': {
                    'terms': {
                        'field': 'language',
                        'size': 10
                    }
                },
                'year': {
                    'terms': {
                        'field': 'year',
                        'size': 10
                    }
                }
            },
            'sort': {
                'date_uploaded_unix': {
                    'order': 'desc'
                }
            }
        }

        if (req.query.size) {
            body.size = req.query.size
        }

        if (req.query.facet && req.query.query) {
            body.query = {
                'match_phrase_prefix': {
                    [req.query.facet]: {
                        'query': req.query.query,
                        'operator': 'and',
                        'max_expansions': 50
                    }
                }
            }
        } else if (req.query.query) {
            body.query = {
                'match_phrase_prefix': {
                    '_all': {
                        'query': req.query.query,
                        'operator': 'and',
                        'max_expansions': 50
                    }
                }
            }
        }

        client.search({
            index: 'movies',
            type: 'movie',
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
