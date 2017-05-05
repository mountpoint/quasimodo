(function(global) {
    var
        startButton = El.$('#start'),
        stopButton = El.$('#stop'),
        timeLeft = El.$('#time-left'),
        intervalMinutes = El.$('#show-interval-minutes'),
        settings = El.$('#settings'),

        notifyEveryText = El.$('#notify-every-text'),
        minutesText = El.$('#minutes-text')
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

    chrome.storage.local.get('quasimodo', function(storage) {
        intervalMinutes.innerHTML = storage.quasimodo.intervalTime;

        if (storage.quasimodo.isStarted) {
            El.hide(startButton);
        } else {
            El.hide(stopButton);
        }
    });

    /**
     * Popup extension functionality
     */
    var App = {
        /**
         * Start timer
         */
        start: function() {
            El.show(stopButton);
            El.hide(startButton);
            Ext.sendMessage({signal: 'start'});
        },

        /**
         * Stop timer
         */
        stop: function() {
            El.show(startButton);
            El.hide(stopButton);
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
     * Populate translations
     */
    El.text(startButton, Ext.__('start_button_text'));
    El.text(stopButton, Ext.__('stop_button_text'));
    El.text(settings, Ext.__('settings_text'));
    El.text(notifyEveryText, Ext.__('notify_every_text'));
    El.text(minutesText, Ext.__('minutes_text'));
})(window);
