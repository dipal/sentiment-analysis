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
        tools: {},
    };

    api.version           = "0.6.4";

    api.tools.thread_container_observer = new MutationObserver(function(mutations) {
            var mutation = mutations[0];
            console.log(mutation);
            console.log(mutation.type);

            api.tools.thread_observer.disconnect();
            api.tools.attach_thread_oberver(false);
        });

    api.tools.thread_observer = new MutationObserver(function(mutations) {
            var mutation = mutations[0];
            console.log('thread selection changed')
            console.log(mutation.target);
            console.log(mutation.type);

            //have some time to generate the dom
            window.setTimeout(function(){
                api.tools.attach_mail_observer();
            }, 2000);            
        });

    api.tools.mail_observer = new MutationObserver(function(mutations) {
            var mutation = mutations[0];
            console.log(mutation.target);
            console.log(mutation.type);

            console.log(mutation.target.getAttribute("aria-selected"));
        });

    api.get.user_email = function() {
        return document.title.split(' ').reverse()[0];
    };

    api.dom.primary_container = function() {
        return document.getElementById('primaryContainer');
    };

    api.dom.mail_thread_list = function() {
        return document.querySelectorAll("[data-convid]");
    };

    api.dom.mail_list = function() {
        return document.querySelectorAll('[aria-label="Message Contents"]');
    };

    api.tools.is_loaded = function() {
        return typeof api.dom.primary_container() !== "undefined";
    };

    api.tools.process_sentiment = function(mail) {
        console.log('processing mail ', mail);
    }

    api.tools.attach_thread_oberver = function(need_observe_parent) {
        var thread_list = api.dom.mail_thread_list();
        console.log('thread_list');
        console.log(thread_list);
        thread_list.forEach(function(thread) {
            api.tools.thread_observer.observe(thread, {attributes: true, attributeOldValue: true});
        });
        if (need_observe_parent && thread_list.length > 0) {
            api.tools.thread_observer.observe(thread_list[0].parentNode, {childList: true});
        }
    };

    api.tools.attach_mail_observer = function() {
        var mail_list = api.dom.mail_list();
        console.log('attach_mail_observer ' + mail_list.length + ' mails');
        mail_list.forEach(function(mail) {
            console.log('observing ', mail, mail.getAttribute('aria-selected'));
            //console.log(mail);
            api.tools.mail_observer.observe(mail, {attributes: true, attributeOldValue: true});
        });
    };

    api.observe.on_load = function(callback) {        

        console.log('on_load');
        console.log(api.dom.primary_container())
        if(api.tools.is_loaded()) {
            api.tools.attach_thread_oberver(true);
            return callback();
        }
        var load_count = 0;
        var delay = 200; // 200ms per check
        var attempts = 50; // try 50 times before giving up & assuming an error
        var timer = setInterval(function() {
            if(api.tools.is_loaded()) {
                clearInterval(timer);

                api.tools.attach_thread_oberver(true);
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
