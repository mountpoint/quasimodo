(function(global) {
    var
        intervalMinutesSlider = El.$$('change_interval_minutes'),
        intervalMinutesBlock = El.$$('interval_minutes'),
        saveButton = El.$$('save')
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
})(window);
