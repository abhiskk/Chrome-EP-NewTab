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
        var numbers = Array();
        var ind, temp;
        for (i = 0; i < N; i++) {
            numbers.push(i);
        }
        for (i = 0; i < N; i++) {
            ind = i + Math.floor((N - i) * Math.random());
            temp = numbers[i];
            numbers[i] = numbers[ind];
            numbers[ind] = temp;
        }
        return numbers;
    },

    displayShareButtons: function() {
        document.getElementById("twitter_button").style.visibility = "visible";
        document.getElementById("facebook_button").style.visibility = "visible";
        document.getElementById("download_button").style.visibility = "visible";
    },

    hideShareButtons: function() {
        document.getElementById("twitter_button").style.visibility = "hidden";
        document.getElementById("facebook_button").style.visibility = "hidden";
        document.getElementById("download_button").style.visibility = "hidden";
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
        // TODO: Disable sharing for offline images (or provide a separate attribute shareURL)
        this.setSharingLinks(image.url);
        this.displayShareButtons();
        // TODO: Disable sharing for offline images (or provide a separate attribute shareURL)
        this.setDownloadLink(image.url);
    },

    parseImage: function(response, imageNumber) {
        var imageData = {};
        imageData.title = response.data.children[imageNumber % (response.data.children.length)].data.title;
        imageData.author = response.data.children[imageNumber % (response.data.children.length)].data.author;
        imageData.url = response.data.children[imageNumber % (response.data.children.length)].data.url;
        return imageData;
    },
 
    /**
     * Setup LocalStorage before displaying first image.
     */
    setup: function() {
        var order = this.permutation(this.BACKUP_IMAGES_COUNT);
        localStorage.setItem("count", 0);
        localStorage.setItem("cacheIndex", 0);
        localStorage.setItem("order", JSON.stringify(order));
        localStorage.setItem("cachedImages", JSON.stringify([]));
    },

    /**
     * Sets up Facebook and Twitter sharing links.
     */
    setSharingLinks: function(url) {
        document.getElementById("twitter_button").href = "https://twitter.com/intent/tweet?text=EPTab Chrome Extension displayed this image&url=" + url;
        document.getElementById("facebook_button").href = "https://www.facebook.com/sharer/sharer.php?u=" + url;
    },

    /**
     * Sets up the download link for download_button.
     */
    setDownloadLink: function(url) {
        document.getElementById("download_button").href = url;
    },

    /**
     * Displays the image.
     * TODO: Update function name & doc. This function does more than just display
     */
    display: function(numberOfImages, cacheSize) {
        this.hideShareButtons();
        var count = localStorage.getItem("count");
        if (count === null) {
            this.setup();
        } 
        count = Number(count);
        var cacheIndex = Number(localStorage.getItem("cacheIndex"));
        var order = JSON.parse(localStorage.getItem("order"));
        console.log("Order is: " + order);
        console.log("Ct is: " + count);
        console.log("OrderCt is: " + order[count]);
        if (count < this.STARTUP_IMAGE_COUNT) {
            this.displayImage(this.offlineImages[order[count]]);
        } else {
            // TODO: Use variable cacheReadPos & cacheWritePos to prevent errors when fetch fails
            var cachedImageNumber = cacheIndex - this.STARTUP_IMAGE_COUNT;
            if (cachedImageNumber < 0) {
                cachedImageNumber += cacheSize;
            }
            var cachedImages = JSON.parse(localStorage.getItem("cachedImages"));
            this.displayImage(cachedImages[cachedImageNumber]);
        }
        var xmlHttp = new XMLHttpRequest();
        var parent = this;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var response = JSON.parse(xmlHttp.response);
                // Fetch an image and cache it so it can be displayed quickly
                var imageData = parent.parseImage(response, count);
                console.log(imageData);
                var cachedImages = JSON.parse(localStorage.getItem("cachedImages"));
                //var cacheIndex = Number(localStorage.getItem("cacheIndex"));
                cachedImages[cacheIndex] = imageData;
                localStorage.setItem("cachedImages", JSON.stringify(cachedImages));
            } else if (xmlHttp.readyState == 4) { // This can probably be replaced with an else
                // HTTP request completed but was not successful
                // if count < 3, then the background image is already set
                if (count >= parent.STARTUP_IMAGE_COUNT) {
                    var imageNumber = count % parent.BACKUP_IMAGES_COUNT;
                    displayImage(parent.offlineImages[imageNumber]);
                }
            }
        }
        // TODO: Think about not calling the API after we get all images (or caching all images & then not calling?)
        xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit=" + Number(numberOfImages), true);
        xmlHttp.send(null);
        localStorage.setItem("count", count + 1);
        localStorage.setItem("cacheIndex", (cacheIndex + 1) % cacheSize);
    }
});
