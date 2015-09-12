/**
 * Entry point of the app.
 */
backgrounds.App = new Model({
    /**
     * Initialize.
     */
    init: function() {
        this.getVersion();
        this.photo = new backgrounds.Photo();

        this.photo.display(10, 2);
    },

    /**
     * Get the version of extension.
     */
    getVersion: function() {
        var app = chrome.app.getDetails();
        this.version = app ? app.version : 'dev';
    }
});

/**
 * Initialize app
 * @type {backgrounds.App}
 */
window.eptab.app = new backgrounds.App();
