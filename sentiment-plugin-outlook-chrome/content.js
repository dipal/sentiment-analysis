
var j = document.createElement('script');
j.src = chrome.extension.getURL('jquery-1.10.2.min.js');
(document.head || document.documentElement).appendChild(j);

var o = document.createElement('script');
o.src = chrome.extension.getURL('outlook.js');
(document.head || document.documentElement).appendChild(o);

var s = document.createElement('script');
s.src = chrome.extension.getURL('main.js');
(document.head || document.documentElement).appendChild(s);
