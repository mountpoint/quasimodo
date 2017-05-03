(function(global) {
    var
        intervalMinutesSlider = El.$('#change-interval-minutes'),
        intervalMinutesBlock = El.$('#interval-minutes'),
        soundsBlock = El.$('#sounds'),
        enableSoundCheckbox = El.$('#enable-sound'),
        alertBlock = El.$('#alert'),
        saveButton = El.$('#save'),

        intervalText = El.$('#interval-text'),
        minutesText = El.$('#minutes-text'),
        soundsText = El.$('#sounds-text'),
        enableSoundText = El.$('#enable-sound-text')
    ;

    saveButton.addEventListener('click', function() {
        Ext.setValue({
            soundNumber: El.$$('input[name=sound]:checked')[0].value,
            soundEnabled: enableSoundCheckbox.checked,
            intervalTime: intervalMinutesSlider.value,
            isStarted: true
        });

        alertBlock.innerHTML =
            '<div class="alert alert-success">' + Ext.__('settings_saved') +
                '<button type="button" class="close close-alert"><span aria-hidden="true">&times;</span></button>' +
            '</div>'
        ;

        Ext.sendMessage({signal: 'update-interval'});
    }, false);

    /**
     * Play sound
     */
    document.addEventListener('click', function(e) {
        var el = e.target;
        if (el.classList.contains('play-sound')) {
            Ext.play(el.parentNode.querySelector('input[name=sound]').value);
        }

        if (el.parentNode.classList.contains('close-alert')) {
            El.hide(el.parentNode.parentNode);
        }
    });

    chrome.storage.local.get('quasimodo', function(storage) {
        intervalMinutesBlock.innerHTML = intervalMinutesSlider.value = storage.quasimodo.intervalTime;
        enableSoundCheckbox.checked = storage.quasimodo.soundEnabled;

        for (var i = 1; i <= 3; ++i) {
            var checked = '';

            if (storage.quasimodo.soundNumber == i) {
                checked = 'checked'
            }

            soundsBlock.insertAdjacentHTML('beforeend',
                '<div class="radio play">'+
                    '<label>' +
                        '<input type="radio" name="sound" value="' + i +'" ' + checked + '> ' + Ext.__('sound_name') + i +
                    '</label>' +
                    '<img src="img/play.svg" title="' + Ext.__('play_text') + '" class="play-sound">' +
                '</div>'
            )
        }
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
    soundsText.innerHTML = Ext.__('sounds_text');
    enableSoundText.innerHTML = Ext.__('enable_sound_text');
})(window);
