// ==UserScript==
// @name Sentiment
// @include https://mail.google.com/
// @include about:blank
// @require jquery-3.2.1.min.js
// ==/UserScript==

var $ = window.$.noConflict(true); // Required for IE

$(document).ready(function() {
	kango.console.log('loaded gmail sentiment analysis tool');
	$.post("https://45.79.170.176:8921/test", function(data, status){
		kango.console.log('got data from ajax');
        alert("Data: " + data + "\nStatus: " + status);
    });
});
