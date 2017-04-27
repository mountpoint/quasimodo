/**
 * HTML Element manipulations
 * @type {{}}
 */
var El = {
    $$: function(el) {
        return document.getElementById(el);
    }
};

/**
 * Chrome extension methods
 *
 * @type {{sendMessage: Ext.sendMessage, setValue: Ext.setValue, updateStorageData: Ext.updateStorageData, __: Ext.__}}
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

        chrome.storage.sync.set(data, function() {
            // Notify that we saved.
            if (message) {
                alert(message);
            }
        });
    },

    /**
     * TODO make updating only one property, not all
     * @param data
     */
    updateStorageData: function (data) {
        if (typeof data !== 'object') {
            throw new Error('Data must be an object');
        }

        var self = this;

        chrome.storage.sync.get('quasimodo', function() {
            self.setValue({
                quasimodo: data
            });
        });
    },

    /**
     * Get locale message
     *
     * @param key
     * @returns {*}
     */
    __: function (key) {
        return chrome.i18n.getMessage(key)
    }
};
