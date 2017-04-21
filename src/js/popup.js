(function(global) {
    var
        intervalMinutes = El.$$('show_interval_minutes')
    ;

    chrome.storage.sync.get('quasimodo', function(storage) {
        intervalMinutes.innerHTML = storage.quasimodo.intervalTime;
    });
})(window);
