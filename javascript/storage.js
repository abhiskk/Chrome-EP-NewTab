/**
 * A wrapper around localStorage to cache indices, image-urls.
 */

backgrounds.Storage = new Model({
    /**
     * Stores the index of image in localStorage
     */
    setIndex: function(val) {
        localStorage.setItem("index", val);
    },

    /**
     * Gets the index of current image being displayed.
     */
    getIndex: function() {
        return localStorage.getItem("index");
    },

    /**
     * Stores the url of image in localStorage.
     */
    setUrl: function(id, url) {
        localStorage.setItem(id, url);
    },

    /**
     * Get the url for id from localStorage.
     */
    getUrl: function(id) {
        return localStorage.getItem(id);
    }
});
