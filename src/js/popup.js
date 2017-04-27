(function(global) {
    var
        startButton = El.$$('start'),
        stopButton = El.$$('stop'),
        timeLeft = El.$$('time-left'),
        intervalMinutes = El.$$('show_interval_minutes')
    ;

    chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
        switch (response.signal) {
            case 'time-left':
                timeLeft.innerHTML = response.timeLeft.minutes + ':' + response.timeLeft.seconds;
                break;
            default:
                alert('no handler')
        }
    });

    chrome.storage.sync.get('quasimodo', function(storage) {
        intervalMinutes.innerHTML = storage.quasimodo.intervalTime;
    });

    /**
     * Popup extension functionality
     */
    var App = {
        /**
         * Start timer
         */
        start: function() {
            Ext.sendMessage({signal: 'start'});
        },

        /**
         * Stop timer
         */
        stop: function() {
            Ext.sendMessage({signal: 'stop'});
        }
    };

    startButton.addEventListener('click', function() {
        App.start();
    }, false);

    stopButton.addEventListener('click', function() {
        App.stop();
    }, false);
})(window);
