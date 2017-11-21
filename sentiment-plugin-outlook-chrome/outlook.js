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
    };

    api.version           = "0.6.4";


    api.get.user_email = function() {
        return api.tracker.globals[10];
    };

    api.dom.inbox_content = function() {
        return $("div[role=main]:first");
    };


    /**
       Observe DOM nodes being inserted. When a node with a class defined in api.tracker.dom_observers is inserted,
       trigger the related event and fire off any relevant bound callbacks
       This function should return true if a dom observer is found for the specified action
    */
    api.observe.on_dom = function(action, callback) {

        // check observers configured
        if(!api.tracker.dom_observer_init) {
            api.observe.initialize_dom_observers();
        }

        // support for DOM observers
        if($.inArray(action, api.tracker.supported_observers) > -1) {

            //console.log("observer found",api.tracker.dom_observers[action]);

            // if we haven"t yet bound the DOM insertion observer, do it now
            if(!api.tracker.observing_dom) {
                api.tracker.observing_dom = true;
                //api.tracker.dom_watchdog = {}; // store passed observer callbacks for different DOM events

                // this listener will check every element inserted into the DOM
                // for specified classes (as defined in api.tracker.dom_observers above) which indicate
                // related actions which need triggering
                $(window.document).bind("DOMNodeInserted", function(e) {
                    api.tools.insertion_observer(e.target, api.tracker.dom_observers, api.tracker.dom_observer_map);
                });

                // recipient_change also needs to listen to removals
                var mutationObserver = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                        var mutation = mutations[i];
                        var removedNodes = mutation.removedNodes;
                        for (var j = 0; j < removedNodes.length; j++) {
                            var removedNode = removedNodes[j];
                            if (removedNode.className === "vR") {
                                var observer = api.tracker.dom_observer_map["vR"];
                                var handler = api.tracker.dom_observers.recipient_change.handler;
                                api.observe.trigger_dom(observer, $(mutation.target), handler);
                            }
                        }
                    }
                });
                mutationObserver.observe(document.body, {subtree: true, childList: true});

            }
            api.observe.bind("dom",action,callback);
            // console.log(api.tracker.observing_dom,"dom_watchdog is now:",api.tracker.dom_watchdog);
            return true;

            // support for gmail interface load event
        }
        else if(action === "compose_cancelled") {
            console.log("set compose cancelled callback");
            api.tracker.composeCancelledCallback = callback;
        }
        else if(action === "load") {

            // wait until the gmail interface has finished loading and then
            // execute the passed handler. If interface is already loaded,
            // then will just execute callback
            if(api.dom.inbox_content().length) return callback();
            var load_count = 0;
            var delay = 200; // 200ms per check
            var attempts = 50; // try 50 times before giving up & assuming an error
            var timer = setInterval(function() {
                var test = api.dom.inbox_content().length;
                if(test > 0) {
                    clearInterval(timer);
                    return callback();
                } else if(++load_count > attempts) {
                    clearInterval(timer);
                    console.log("Failed to detect interface load in " + (delay*attempts/1000) + " seconds. Will automatically fire event in 5 further seconds.");
                    setTimeout(callback, 5000);
                }
            }, delay);
            return true;
        }
    };

    // observes every element inserted into the DOM by Gmail and looks at the classes on those elements,
    // checking for any configured observers related to those classes
    api.tools.insertion_observer = function(target, dom_observers, dom_observer_map, sub) {
        //console.log("insertion", target, target.className);
        if(!api.tracker.dom_observer_map) return;

        // loop through each of the inserted elements classes & check for a defined observer on that class
        var cn = target.className || "";
        var classes = cn.trim().split(/\s+/);
        if(!classes.length) classes.push(""); // if no class, then check for anything observing nodes with no class
        $.each(classes, function(idx, className) {
            var observer = dom_observer_map[className];

            // check if this is a defined observer, and callbacks are bound to that observer
            if(observer && api.tracker.watchdog.dom[observer]) {
                var element = $(target);
                var config = dom_observers[observer];

                // if a config id specified for this observer, ensure it matches for this element
                if(config.selector && !element.is(config.selector)) {
                    return;
                }

                // check for any defined sub_selector match - if not found, then this is not a match for this observer
                // if found, then set the matching element to be the one that matches the sub_selector
                if(config.sub_selector) {
                    element = element.find(config.sub_selector);
                    // console.log("checking for subselector", config.sub_selector, element);
                }

                // if an element has been found, execute the observer handler (or if none defined, execute the callback)
                if(element.length) {

                    var handler = config.handler ? config.handler : function(match, callback) { callback(match); };
                    // console.log( "inserted DOM: class match in watchdog",observer,api.tracker.watchdog.dom[observer] );
                    api.observe.trigger_dom(observer, element, handler);

                    // if sub_observers are configured for this observer, bind a DOMNodeInsertion listener to this element & to check for specific elements being added to this particular element
                    if(config.sub_observers) {

                        // create observer_map for the sub_observers
                        var observer_map = {};
                        $.each(config.sub_observers, function(act,cfg){
                            observer_map[cfg.class] = act;
                        });

                        // this listener will check every element inserted into the DOM below the current element
                        // and repeat this method, but specifically below the current element rather than the global DOM
                        element.bind("DOMNodeInserted", function(e) {
                            api.tools.insertion_observer(e.target, config.sub_observers, observer_map, "SUB ");
                        });
                    }
                }
            }
        });
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
