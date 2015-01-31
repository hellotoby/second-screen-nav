
// Change page when we get a url sent from the second screen
var socket = io.connect();
socket.on('urlchange', function (data) {
    window.location.href = data.url;
});