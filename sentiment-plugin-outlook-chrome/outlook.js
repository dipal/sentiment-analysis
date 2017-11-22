///////////////////////////////////////////
// outlook.js
// Dipranjan Dasd
//

var Outlook_ = function(localJQuery) {

    var $;
    if (typeof localJQuery !== "undefined") {
        $ = localJQuery;
    } else if (typeof jQuery !== "undefined") {
        $ = jQuery;
    } else {
        // try load jQuery through node.
        try {
            $ = require("jquery");
        }
        catch(err) {
            // else leave $ undefined, which may be fine for some purposes.
        }
    }

    var api = {
        get : {},
        observe : {},
        dom : {},
        flags: {},
        tools: {}
    };

    api.version           = "0.6.4";


    api.get.user_email = function() {
        return document.title.split(' ').reverse()[0];
    };

    api.dom.primary_container = function() {
        return document.getElementById('primaryContainer');
    };

    api.dom.mail_thread_list = function() {
        return document.querySelectorAll("[data-convid]");
    }

    api.dom.mail_list = function() {
        return document.querySelectorAll('[aria-label="Message Contents"]');
    }

    api.flags.is_loaded = function() {
        return typeof api.dom.primary_container() !== "undefined";
    }

    api.tools.attach_thread_oberver = function(thread_dom) {
        
    }

    api.observe.on_load = function(callback) {        

        console.log('on_load');
        console.log(api.dom.primary_container())
        if(api.flags.is_loaded()) return callback();
        var load_count = 0;
        var delay = 200; // 200ms per check
        var attempts = 50; // try 50 times before giving up & assuming an error
        var timer = setInterval(function() {
            if(api.flags.is_loaded()) {
                clearInterval(timer);



                return callback();
            } else if(++load_count > attempts) {
                clearInterval(timer);
                console.log("Failed to detect interface load in " + (delay*attempts/1000) + " seconds. Will automatically fire event in 5 further seconds.");
                setTimeout(callback, 5000);
            }
        }, delay);
        return true;
    
    };

    api.observe.on_thread

    return api;
};

function initializeOnce(fn) {
    var result;
    return function() {
        if (fn) {
            result = fn.apply(this, arguments);
        }
        fn = null;
        return result;
    };
}

// required to avoid error in NodeJS.
var OutlookClass = initializeOnce(Outlook_);
if (typeof(window) !== "undefined" && !window.Outlook) {
    window.Outlook = OutlookClass;
}

// make class accessible to require()-users.
if (typeof(exports) !== "undefined") {
    exports.Outlook = OutlookClass;
}
