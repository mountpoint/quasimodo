/**
 * HTML Element manipulations
 *
 * @type {{$: El.$, $$: El.$$, show: El.show, hide: El.hide}}
 */
var El = {
    $: function(el) {
        return document.querySelector(el);
    },

    $$: function(el) {
        return document.querySelectorAll(el);
    },

    show: function (el) {
        if (typeof el == 'string') {
            this.$(el).style.display = 'block';
        } else {
            el.style.display = 'block';
        }
    },

    hide: function (el) {
        if (typeof el == 'string') {
            this.$(el).style.display = 'none';
        } else {
            el.style.display = 'none';
        }
    }
};

/**
 * Extension methods
 *
 * @type {{sendMessage: Ext.sendMessage, setValue: Ext.setValue, __: Ext.__, play: Ext.play}}
 */
var Ext = {
    /**
     * Dispatches params to popup.js
     *
     * @param message object
     */
    sendMessage: function(message) {
        if (typeof message !== 'object') {
            throw new Error('Message must be an object');
        }

        chrome.runtime.sendMessage(message, function(response) {

        });
    },

    /**
     * Save data in storage
     *
     * @param data object
     * @param message string
     */
    setValue: function(data, message) {
        if (typeof data !== 'object') {
            throw new Error('Data must be an object');
        }

        chrome.storage.local.get('quasimodo', function(storage) {
            if (typeof storage.quasimodo == 'undefined') {
                storage.quasimodo = {};
            }

            for (var prop in data) {
                storage.quasimodo[prop] = data[prop];
            }

            chrome.storage.local.set({
                quasimodo: storage.quasimodo
            }, function() {
                // Notify that we saved.
                if (message) {
                    alert(message);
                }
            });
        });
    },

    /**
     * Get locale message
     *
     * @param key
     * @returns {string}
     */
    __: function (key) {
        return chrome.i18n.getMessage(key)
    },

    /**
     * Play the sound
     *
     * @param soundNumber
     */
    play: function (soundNumber) {
        var soundExt = '.mp3';
        if (/OPR/g.test(navigator.userAgent)) { // for Opera browser
            soundExt = '.ogg';
        }
        var audio = new Audio('sounds/' + soundNumber + soundExt);
        audio.play();
    }
};
