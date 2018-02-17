/**
 * Controls the image being displayed in newtab.
 */
backgrounds.Photo = new Model({

    /**
     * Total number of images in /images/backup-wallpapers
     */
    BACKUP_IMAGES_COUNT: 5,
    /**
     * Number of images to use at startup.
     * By using cached images, we can cache images that will be
     * fetched as well
     */
    STARTUP_IMAGE_COUNT: 2,

    offlineImages: [
        {
            title:  "Moonlit and lava-covered Fuego Volcano, Guatemala",
            author: "TheLostCrusader",
            url:    "/images/backup-wallpapers/image0.jpg"
            //url:    "https://i.imgur.com/c5vIKho.jpg"
        },
        {
            title:  "Western Rim, Grand Canyon after the rain.",
            author: "IamIrene",
            url:    "/images/backup-wallpapers/image1.jpg"
            //url:    "https://i.imgur.com/93icizv.jpg"
        },
        {
            title:  "Queenstown, New Zealand",
            author: "Tuurby",
            url:    "/images/backup-wallpapers/image2.jpg"
            //url:    "https://i.imgur.com/33f17F7.jpg"
        },
        {
            title:  "The Shadow of K2, projected into China across hundreds of miles.",
            author: "RoonilWazilbob",
            url:    "/images/backup-wallpapers/image3.jpg"
            //url:    "https://i.imgur.com/GwVvkEw.jpg"
        },
        {
            title:  "I caught the last rays of sunset on Half Dome, Yosemite",
            author: "Oxus007",
            url:    "/images/backup-wallpapers/image4.jpg"
            //url:    "https://i.imgur.com/91ko84h.jpg"
        }
    ],

    /**
     * Generates a permutation of size N.
     */
    permutation: function(N) {
        var i, ind, temp, numbers;
        numbers = [];
        for (i = 0; i < N; i++) {
            numbers.push(i);
        }
        for (i = 0; i < N - 1; i++) {
            ind = i + Math.floor((N - i) * Math.random());
            temp = numbers[i];
            numbers[i] = numbers[ind];
            numbers[ind] = temp;
        }
        return numbers;
    },

    /**
     * Replace '&amp;' in url returned by reddit to '&'
     * ref: https://www.reddit.com/r/redditdev/comments/7xqbc2/redditmedia_images_are_broken/
     */
    unescapeUrl: function(url) {
        return url.replace(/&amp;/g, '&');
    },

    displayTitleAuthor: function(title, author) {
        // Regex matching
        // TODO: Rename myRe and myArray to something more meaningful
        var myRe = /(?:\[|\()\s*oc\s*(?:\]|\))/gi;
        var myArray = myRe.exec(title);
        if (myArray != null) {
            title = title.slice(0, myArray.index).trim() + ' ' + title.slice(myRe.lastIndex).trim();
        }
        myRe = /\[?\(?\s*\d+,?\d*\s*(?:x|\u00D7)\s*\d+,?\d*\s*\]?\)?/gi;
        myArray = myRe.exec(title);
        if (myArray != null) {
            title = title.slice(0, myArray.index).trim() + ' ' + title.slice(myRe.lastIndex).trim();
        }
        var div = document.createElement('div');
        var titleSpan = document.createElement('span');
        var titleText = document.createTextNode(title.trim());
        titleSpan.className = 'title image-text';
        titleSpan.appendChild(titleText);
        var authorSpan = document.createElement('span');
        var authorText = document.createTextNode('posted by ' + author.trim());
        authorSpan.className = 'author image-text';
        authorSpan.appendChild(authorText);
        div.appendChild(titleSpan);
        div.appendChild(authorSpan);
        document.body.appendChild(div);
    },

    displayImage: function(image) {
        var url = image.url;
        document.body.style.background = "url(" + url + ") no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";
        this.displayTitleAuthor(image.title, image.author);
    },

    parseImage: function(response, imageNumber) {
        var imageData = {};
        imageData.title = response.data.children[imageNumber % (response.data.children.length)].data.title;
        imageData.author = response.data.children[imageNumber % (response.data.children.length)].data.author;
        imageData.url = this.unescapeUrl(response.data.children[imageNumber % (response.data.children.length)].data.preview.images[0].source.url);
        return imageData;
    },

    isValidLocalStorageState: function(cacheSize) {
        var count = localStorage.getItem("count");
        var order = localStorage.getItem("order");
        var cachedImages = localStorage.getItem("cachedImages");
        return count != null && Number(count) >= 0 && order != null && JSON.parse(order).length == this.BACKUP_IMAGES_COUNT && cachedImages != null && JSON.parse(cachedImages).length <= cacheSize;
    },

    /**
     * Setup LocalStorage before displaying first image.
     */
    setup: function() {
        var order = this.permutation(this.BACKUP_IMAGES_COUNT);
        localStorage.setItem("count", 0);
        localStorage.setItem("order", JSON.stringify(order));
        localStorage.setItem("cachedImages", JSON.stringify([]));
    },

    /**
     * Displays the image.
     * TODO: Update function name & doc. This function does more than just display.
     */
    display: function(numberOfImages, cacheSize) {
        if (!this.isValidLocalStorageState(cacheSize)) {
            this.setup();
        }
        // From this point onwards, count, order and cachedImages are in a valid state (to know what a valid state is, refer to the IsValidLocalStorage function).
        var count = Number(localStorage.getItem("count"));
        var order = JSON.parse(localStorage.getItem("order"));
        var cachedImages = JSON.parse(localStorage.getItem("cachedImages"));
        // We display backup images in the following cases.
        // * count < STARTUP_IMAGE_COUNT: We are yet to finish the quota of offline images before we can use images from the cache.
        // * count >= STARTUP_IMAGE_COUNT but cachedImages.length == 0: Can happen when HTTP requests to r/EarthPorn fail. We fall back to display the backup images.
        if (count < this.STARTUP_IMAGE_COUNT || cachedImages.length == 0) {
            var order_index = count % this.BACKUP_IMAGES_COUNT;
            this.displayImage(this.offlineImages[order[order_index]]);
        } else {
            this.displayImage(cachedImages[0]);
            // Once we consume an image from the cache, remove it from the cache.
            cachedImages.splice(0, 1);
            localStorage.setItem("cachedImages", JSON.stringify(cachedImages));
        }
        var xmlHttp = new XMLHttpRequest();
        var parent = this;
        xmlHttp.onreadystatechange = function() {
            // If the HTTP request is successful, then we store the image received into our cache. If the request is unsuccessful, the cache simply does not get updated.
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var response = JSON.parse(xmlHttp.response);
                // Fetch an image and cache it so it can be displayed quickly
                var imageData = parent.parseImage(response, count);
                cachedImages.push(imageData);
                localStorage.setItem("cachedImages", JSON.stringify(cachedImages));
            }
        }
        // We send an HTTP request only if our cache is not full.
        if (cachedImages.length < cacheSize) {
            xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit=" + Number(numberOfImages), true);
            xmlHttp.send(null);
        }
        localStorage.setItem("count", count + 1);
    }
});
