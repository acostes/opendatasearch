var elasticsearch = require('elasticsearch')
var config = require('nconf')

config.argv()
    .env()
    .file({ file: '../config/config.json' })

var client = new elasticsearch.Client({
    host: config.get('host'),
    port: config.get('port')
})

module.exports = client
