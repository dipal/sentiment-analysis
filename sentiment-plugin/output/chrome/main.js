function Sentiment() {
    var self = this;
	alert("Loaded sentiment");
    kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
        self._onCommand();
    });
}

Sentiment.prototype = {

    _onCommand: function() {
        kango.browser.tabs.create({url: 'http://kangoextensions.com/'});
    }
};

var extension = new Sentiment();
