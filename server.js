var app     = require('express')();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var static  = require('express-static');

// Listen on port 8000
// Uses process.env.PORT for Heroku deployment as Heroku will dynamically assign a port
server.listen(process.env.PORT || 8000);

// Serve static files
app.use("/css", static(__dirname + '/css'));
app.use("/js", static(__dirname + '/js'));

// Index route
app.get('/', function (req, res) {
    // Basic user agent check - tests for mobile
    var ua = req.headers['user-agent'];
    if (/mobile/i.test(ua)) {
        // Send mobile to the navigation controls
        res.sendFile(__dirname + '/pages/mobile.html');
    } else {
        // Send desktop to the main site 
        res.sendFile(__dirname + '/pages/index.html');
    }
});

// Dynamic page route
app.get('/page/:id', function( req, res ) {
    res.sendFile(__dirname + '/pages/' + req.params.id + '.html');
});

// Heroku setting for long polling
io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
});

// Socket IO
io.on('connection', function (socket) {
    // Create a room to broadcast to
    socket.join('main');
    socket.on('statechange', function (data) {
        // Broadcast changes to all clients in room
        socket.to('main').emit('urlchange', { url : data.url });
    });
});