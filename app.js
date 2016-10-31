var express = require('express')
var path = require('path')
var app = express()

// Configuration
app.set('views', path.join(__dirname, '/public'))
app.set('view engine', 'html')
app.use(express.static(path.join(__dirname, '/public')))

// Movies YTS API
require('./api/yts.js')(app)

var port = process.env.PORT || 8080
app.listen(port, function () {
    console.log('Express server listening on port %d in %s mode', port, app.settings.env)
})
