(function(global) {
    var
        intervalMinutesSlider = El.$$('#change-interval-minutes'),
        intervalMinutesBlock = El.$$('#interval-minutes'),
        saveButton = El.$$('#save'),

        intervalText = El.$$('#interval-text'),
        minutesText = El.$$('#minutes-text')
    ;

    saveButton.addEventListener('click', function() {
        Ext.setValue({
            quasimodo: {
                intervalTime: intervalMinutesSlider.value
            }
        }, Ext.__('settings_saved'));

        Ext.sendMessage({signal: 'update-interval'});
    }, false);

    chrome.storage.sync.get('quasimodo', function(storage) {
        intervalMinutesBlock.innerHTML = intervalMinutesSlider.value = storage.quasimodo.intervalTime;
    });

    intervalMinutesSlider.addEventListener('input', function() {
        intervalMinutesBlock.innerHTML = this.value;
    }, false);

    /**
     * Populate language
     */
    saveButton.innerHTML = Ext.__('save_button_text');
    intervalText.innerHTML = Ext.__('interval_text');
    minutesText.innerHTML = Ext.__('minutes_text');
})(window);
