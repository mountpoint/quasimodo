(function(global) {
    /**
     * Handle click on icon
     * "popup" not works with an onclick event.
     * Remove the popup.html from the manifest file. And keep the background page, and it will work.
     */
    chrome.browserAction.onClicked.addListener(function() {

    });

    /**
     * Load default data at first time
     */
    chrome.storage.sync.get('quasimodo', function(storage) {
        if (typeof storage.quasimodo === 'undefined') {
            Ext.setValue({
                quasimodo: {
                    intervalTime: 5
                }
            });
        }
    });

    /**
     * Receiving signals
     */
    chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
        switch (response.signal) {
            case 'update-interval':
                Bg.start();
                break;
            default:
                Bg.start();
        }
    });

    /**
     * Background extension functionality
     */
    var Bg = {
        /**
         * End timestamp
         */
        endTimestamp: null,

        /**
         * Current timestamp
         */
        currentTimestamp: null,

        /**
         * Time left
         */
        timeLeft: null,

        /**
         * Start interval
         */
        startInterval: null,

        /**
         * Start timer
         */
        start: function() {
            var self = this;

            chrome.storage.sync.get('quasimodo', function(storage) {
                var time = storage.quasimodo.intervalTime;

                self.endTimestamp = self.getCurrentTimestamp() + self.toSeconds(time);

                if (self.startInterval) {
                    self.stop();
                }

                self.startInterval = setInterval((function(that) {
                    return function() {
                        that.updateTime();
                    }
                })(self), 1000);
            });
        },

        /**
         * Stop timer
         */
        stop: function() {
            clearInterval(this.startInterval);
        },

        /**
         * Refreshes time every 1 second
         */
        updateTime: function() {
            this.timeLeft = this.endTimestamp - this.getCurrentTimestamp();

            //console.log('Left - ' + this.timeLeft);

            if (this.timeLeft === 0) {
                this.stop();
                this.showNotification();
                this.start();
            }
        },

        /**
         * Shows notification
         */
        showNotification: function() {
            this.createBasicNotification(
                'id1',
                Ext.__('notification_title'),
                Ext.__('notification_description')
            );
        },

        /**
         * Convert minutes to seconds
         *
         * @param minutes
         * @returns {number}
         */
        toSeconds: function(minutes) {
            return minutes * 60;
        },

        /**
         * Creation basic extension notification
         *
         * @param id
         * @param title
         * @param message
         */
        createBasicNotification: function(id, title, message) {
            chrome.notifications.create(
                id,
                {
                    type: 'basic',
                    iconUrl: 'img/icon128.png',
                    title: title,
                    message: message
                },
                function(notificationId) {

                }
            );
        },

        /**
         * Get current timestamp in seconds
         *
         * @returns {number}
         */
        getCurrentTimestamp: function() {
            return Math.round(Date.now()/1000);
        }
    };
})(window);
