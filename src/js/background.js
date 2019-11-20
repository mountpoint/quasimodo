(function() {
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
     * Time watcher interval
     */
    timeWatcherInterval: null,

    /**
     * Silence time
     */
    silence: {
      fromHours: null,
      fromMinutes: null,
      toHours: null,
      toMinutes: null
    },

    /**
     * Start timer
     */
    start: function() {
      var self = this;

      chrome.storage.local.get('quasimodo', function(storage) {
        var time = self.timeLeft || self.toSeconds(storage.quasimodo.intervalTime);

        self.endTimestamp = self.getCurrentTimestamp() + time;

        Ext.setValue({
          isStarted: true
        });

        self.silence.fromHours = storage.quasimodo.silence.fromHours;
        self.silence.fromMinutes = storage.quasimodo.silence.fromMinutes;
        self.silence.toHours = storage.quasimodo.silence.toHours;
        self.silence.toMinutes = storage.quasimodo.silence.toMinutes;

        self.startInterval = setInterval((function(that) {
          return function() {
            that.updateTime();
          };
        })(self), 1000);
      });
    },

    /**
     * Stop timer
     */
    stop: function() {
      this.timeLeft = null;
      clearInterval(this.startInterval);
      clearInterval(this.timeWatcherInterval);

      Ext.setValue({
        isStarted: false
      });
    },

    /**
     * Refreshes time every 1 second
     */
    updateTime: function() {
      var
        self = this,
        date = new Date()
      ;

      if (
        self.getFakeTimestamp(date.getHours(), date.getMinutes(), date.getSeconds()) >= self.getFakeTimestamp(self.silence.fromHours, self.silence.fromMinutes, 0)
        &&
        self.getFakeTimestamp(date.getHours(), date.getMinutes(), date.getSeconds()) <= self.getFakeTimestamp(self.silence.toHours, self.silence.toMinutes, 0, true)
      )
      {
        self.stop();
        self.startTimeWatcher();
      } else {
        self.timeLeft = self.endTimestamp - self.getCurrentTimestamp();

        Ext.sendMessage({signal: 'time-left', timeLeft: self.getTime()});

        if (self.timeLeft === 0) {
          self.stop();
          self.showNotification();
          self.start();
        }
      }
    },

    startTimeWatcher: function() {
      var self = this;

      self.timeWatcherInterval = setInterval((function(that) {
        return function() {
          var date = new Date();

          /*console.log('watch');
          console.log('curr '+ that.getFakeTimestamp(date.getHours(), date.getMinutes(), date.getSeconds()));
          console.log('from '+ that.getFakeTimestamp(that.silence.fromHours, that.silence.fromMinutes, 0));
          console.log('to '+ that.getFakeTimestamp(that.silence.toHours, that.silence.toMinutes, 0, true));*/

          if (
            !(that.getFakeTimestamp(date.getHours(), date.getMinutes(), date.getSeconds()) >= that.getFakeTimestamp(that.silence.fromHours, that.silence.fromMinutes, 0)
              &&
              that.getFakeTimestamp(date.getHours(), date.getMinutes(), date.getSeconds()) <= that.getFakeTimestamp(that.silence.toHours, that.silence.toMinutes, 0, true))
          )
          {
            that.start();
            clearInterval(that.timeWatcherInterval);
          }
        };
      })(self), 1000);
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
      };
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
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'img/icon128.png',
        title: title,
        message: message
      }, function(notificationId) {
        chrome.storage.local.get('quasimodo', function(storage) {
          if (storage.quasimodo.soundEnabled) {
            Ext.play(storage.quasimodo.soundNumber);
          }
        });
      });
    },

    /**
     * Get current timestamp in seconds
     *
     * @returns {number}
     */
    getCurrentTimestamp: function() {
      return Math.round(Date.now() / 1000);
    },

    /**
     * Returns fake timestamp
     *
     * @param hours
     * @param minutes
     * @param seconds
     * @param toTimePoint
     * @returns {number}
     */
    getFakeTimestamp: function(hours, minutes, seconds, toTimePoint) {
      var day = '01';

      if (toTimePoint && hours >= 0 && hours < this.silence.fromHours) {
        day = '02';
      }

      if (hours < this.silence.toHours) {
        day = '02';
      }

      if (hours <= 9) {
        hours = '0' + hours;
      }

      if (minutes <= 9) {
        minutes = '0' + minutes;
      }

      if (seconds <= 9) {
        seconds = '0' + seconds;
      }

      var date = new Date('01-' + day + '-1970 ' + hours + ':' + minutes + ':' + seconds);

      return (date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)) / 1000;
    }
  };

  /**
   * Start timer after Chrome startup
   */
  chrome.runtime.onStartup.addListener(function() {
    Bg.start();
  });

  /**
   * Actions after extension installed
   */
  chrome.runtime.onInstalled.addListener(function() {
    // default settings
    Ext.setValue({
      soundEnabled: true,
      soundNumber: 1,
      intervalTime: 5,
      isStarted: false,
      silence: {
        fromHours: 22,
        fromMinutes: 0,
        toHours: 9,
        toMinutes: 0
      }
    });
  });
})();
