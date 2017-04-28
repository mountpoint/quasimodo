(function(global) {
    /**
     * Handle click on icon
     * "popup" not works with an onclick event.
     * Remove the popup.html from the manifest file. And keep the background page, and it will work.
     */
    chrome.browserAction.onClicked.addListener(function() {

    });

    /**
     * Receiving signals
     */
    chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
        switch (response.signal) {
            case 'start':
                Bg.start();
                break;
            case 'stop':
                Bg.stop();
                break;
            case 'update-interval':
                Bg.stop();
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

            chrome.storage.local.get('quasimodo', function(storage) {
                var time = self.timeLeft || self.toSeconds(storage.quasimodo.intervalTime);

                self.endTimestamp = self.getCurrentTimestamp() + time;

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
            //alert(234)
            this.timeLeft = null;
            clearInterval(this.startInterval);
        },

        /**
         * Refreshes time every 1 second
         */
        updateTime: function() {
            var self = this;

            self.timeLeft = self.endTimestamp - self.getCurrentTimestamp();

            Ext.sendMessage({signal: 'time-left', timeLeft: self.getTime()});

            if (self.timeLeft === 0) {
                self.stop();
                self.showNotification();
                self.start();
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
         * Get user friendly time
         *
         * @returns {{minutes: *, seconds: *}}
         */
        getTime: function() {
            return {
                minutes: this.formatTime((this.timeLeft / 60) % 60),
                seconds: this.formatTime(this.timeLeft % 60)
            }
        },

        /**
         * Formats time
         *
         * @param dirtyTime
         * @returns {*}
         */
        formatTime: function(dirtyTime) {
            var time = Math.floor(dirtyTime);
            return time > 9 ? time : '0' + time;
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
                    chrome.storage.local.get('quasimodo', function(storage) {
                        if (storage.quasimodo.soundEnabled) {
                            var audio = new Audio('sounds/' + storage.quasimodo.soundNumber + '.mp3');
                            audio.play();
                        }
                    });
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

    /**
     * Start timer after Chrome startup
     */
    chrome.runtime.onStartup.addListener(function () {
        Bg.start();
    });

    /**
     * Actions after extension installed
     */
    chrome.runtime.onInstalled.addListener(function () {
        Ext.setValue({
            soundEnabled: true,
            soundNumber: 1,
            intervalTime: 5,
            isStarted: false
        });
    })
})(window);
