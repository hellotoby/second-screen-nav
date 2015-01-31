
// Change page when we get a url sent from the second screen
// For local dev
// var socket = io.connect('http://localhost:8000');
// Heroku only
var socket = io.connect();
socket.on('urlchange', function (data) {
    window.location.href = data.url;
});