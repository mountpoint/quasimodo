(function(global) {
    var
        startButton = El.$$('#start'),
        stopButton = El.$$('#stop'),
        timeLeft = El.$$('#time-left'),
        intervalMinutes = El.$$('#show-interval-minutes'),
        settings = El.$$('#settings'),

        notifyEveryText = El.$$('#notify-every-text'),
        minutesText = El.$$('#minutes-text')
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

    /**
     * Populate language
     */
    startButton.innerHTML = Ext.__('start_button_text');
    stopButton.innerHTML = Ext.__('stop_button_text');
    settings.innerHTML = Ext.__('settings_text');
    notifyEveryText.innerHTML = Ext.__('notify_every_text');
    minutesText.innerHTML = Ext.__('minutes_text');
})(window);
