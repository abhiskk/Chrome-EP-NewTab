/**
 * Entry point of the app.
 */
backgrounds.App = new Model({
    /**
     * Initialize.
     */
    init: function() {
        this.getVersion();
    },

    /**
     * Get the version of extension.
     */
    getVersion: function() {
        var app = chrome.app.getDetails();
        this.version = app ? app.version : 'dev';
        console.log(this.version);
    }
});

/**
 * Initialize app
 * @type {backgrounds.App}
 */
window.eptab.app = new backgrounds.App();
