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

    show: function(el) {
        if (typeof el === 'string') {
            this.$(el).style.display = 'block';
        } else {
            el.style.display = 'block';
        }
    },

    hide: function(el) {
        if (typeof el === 'string') {
            this.$(el).style.display = 'none';
        } else {
            el.style.display = 'none';
        }
    },

    /**
     * Set element's text
     *
     * @param el
     * @param text
     */
    text: function(el, text) {
        // array of objects
        if (el instanceof NodeList) {
            for (var i = 0, len = el.length; i < len; ++i) {
                el[i].textContent = text;
            }
        }

        // object
        if (typeof el === 'object' && (el instanceof Node)) {
            el.textContent = text;
        }

        // selector
        if (typeof el === 'string') {
            this.text(this.$$(el), text);
        }
    },

    /**
     * Set element's html
     *
     * @param el
     * @param html
     */
    html: function(el, html) {
        // array of objects
        if (el instanceof NodeList) {
            for (var i = 0, len = el.length; i < len; ++i) {
                el[i].innerHTML = html;
            }
        }

        // object
        if (typeof el === 'object' && (el instanceof Node)) {
            el.innerHTML = html;
        }

        // selector
        if (typeof el === 'string') {
            this.html(this.$$(el), html);
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
            if (typeof storage.quasimodo === 'undefined') {
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
    __: function(key) {
        return chrome.i18n.getMessage(key);
    },

    /**
     * Play the sound
     *
     * @param soundNumber
     */
    play: function(soundNumber) {
        var soundExt = '.mp3';
        if (/OPR/g.test(navigator.userAgent)) { // for Opera browser
            soundExt = '.ogg';
        }
        var audio = new Audio('sounds/' + soundNumber + soundExt);
        audio.play();
    }
};
