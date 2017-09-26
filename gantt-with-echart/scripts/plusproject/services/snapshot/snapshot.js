var page = require('webpage').create();
var args = require('system').args;

var url = args[1];
var filename = args[2] || "snapshot.png";

var t = new Date();
page.open(url, function () {
    window.setTimeout(function () {
        page.render(filename);
	console.log('time: '+(new Date() - t));	
        phantom.exit();
    }, 1000);
});