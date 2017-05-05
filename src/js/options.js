(function(global) {
    var
        intervalMinutesSlider = El.$('#change-interval-minutes'),
        intervalMinutesBlock = El.$('#interval-minutes'),
        soundsBlock = El.$('#sounds'),
        enableSoundCheckbox = El.$('#enable-sound'),
        alertBlock = El.$('#alert'),
        fromHoursSelect = El.$('#from-hours'),
        fromMinutesSelect = El.$('#from-minutes'),
        toHoursSelect = El.$('#to-hours'),
        toMinutesSelect = El.$('#to-minutes'),
        saveButton = El.$('#save'),

        intervalText = El.$('#interval-text'),
        minutesText = El.$('#minutes-text'),
        soundsText = El.$('#sounds-text'),
        enableSoundText = El.$('#enable-sound-text'),
        silenceModeText = El.$('#silence-mode-text'),
        fromText = El.$('#from-text'),
        toText = El.$('#to-text')
    ;

    saveButton.addEventListener('click', function() {
        Ext.setValue({
            soundNumber: El.$$('input[name=sound]:checked')[0].value,
            soundEnabled: enableSoundCheckbox.checked,
            intervalTime: intervalMinutesSlider.value,
            isStarted: true,
            silence: {
                fromHours: +fromHoursSelect.options[fromHoursSelect.selectedIndex].value,
                fromMinutes: +fromMinutesSelect.options[fromMinutesSelect.selectedIndex].value,
                toHours: +toHoursSelect.options[toHoursSelect.selectedIndex].value,
                toMinutes: +toMinutesSelect.options[toMinutesSelect.selectedIndex].value
            }
        });

        alertBlock.innerHTML =
            '<div class="alert alert-success">' + Ext.__('settings_saved') +
                '<button type="button" class="close close-alert"><span aria-hidden="true">&times;</span></button>' +
            '</div>'
        ;

        Ext.sendMessage({signal: 'update-interval'});
    }, false);

    document.addEventListener('click', function(e) {
        var el = e.target;

        // Play sound
        if (el.classList.contains('play-sound')) {
            Ext.play(el.parentNode.querySelector('input[name=sound]').value);
        }

        // Close alert
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
            );
        }

        for (var h = 0; h <= 23; ++h) {
            if (h < 10) {
                h = '0' + h;
            }

            var fromHoursSelected = '';
            if (storage.quasimodo.silence.fromHours == +h) {
                fromHoursSelected = 'selected';
            }

            fromHoursSelect.insertAdjacentHTML('beforeend',
                '<option value="' + h + '" ' + fromHoursSelected + '>' + h + '</option>'
            );

            var toHoursSelected = '';
            if (storage.quasimodo.silence.toHours == +h) {
                toHoursSelected = 'selected';
            }

            toHoursSelect.insertAdjacentHTML('beforeend',
                '<option value="' + h + '" ' + toHoursSelected + '>' + h + '</option>'
            );
        }

        for (var m = 0; m <= 59; m = +m + 5) {
            if (m < 10) {
                m = '0' + m;
            }

            var fromMinutesSelected = '';
            if (storage.quasimodo.silence.fromMinutes == +m) {
                fromMinutesSelected = 'selected';
            }

            fromMinutesSelect.insertAdjacentHTML('beforeend',
                '<option value="' + m + '" ' + fromMinutesSelected + '>' + m + '</option>'
            );

            var toMinutesSelected = '';
            if (storage.quasimodo.silence.toMinutes == +m) {
                toMinutesSelected = 'selected';
            }

            toMinutesSelect.insertAdjacentHTML('beforeend',
                '<option value="' + m + '" ' + toMinutesSelected + '>' + m + '</option>'
            );
        }
    });

    intervalMinutesSlider.addEventListener('input', function() {
        intervalMinutesBlock.innerHTML = this.value;
    }, false);

    /**
     * Populate translations
     */
    El.text(saveButton, Ext.__('save_button_text'));
    El.text(intervalText, Ext.__('interval_text'));
    El.text(minutesText, Ext.__('minutes_text'));
    El.text(soundsText, Ext.__('sounds_text'));
    El.text(enableSoundText, Ext.__('enable_sound_text'));
    El.text(silenceModeText, Ext.__('silence_mode_text'));
    El.text(fromText, Ext.__('from_text'));
    El.text(toText, Ext.__('to_text'));
})(window);
