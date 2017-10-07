// ==UserScript==
// @name Sentiment
// @include https://mail.google.com/
// @include about:blank
// @require jquery-3.2.1.min.js
// @require gmail.js
// ==/UserScript==

var $ = window.$.noConflict(true); // Required for IE

$(document).ready(function() {
	kango.console.log('loaded gmail sentiment analysis tool');
	alert('loaded gmail plugin');
	var gmail = Gmail();
	kango.console.log(gmail);

	$.post("https://45.79.170.176:8921/test", function(data, status){
		kango.console.log('got data from ajax');
    });
	setTimeout(function() {
		kango.console.log(gmail);
		kango.console.log(gmail.get.user_email());
	}, 15000);
});
