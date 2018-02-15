/**
 * Controls the image being displayed in newtab.
 */
backgrounds.Photo = new Model({

    /**
     * Number of images in /images/backup-wallpapers
     */
    CNT_BACKUP_IMAGES: 5,

    /**
     * Titles of the images in /images/backup-wallpapers
     */
    backupTitles: [
        "Moonlit and lava-covered Fuego Volcano, Guatemala",
        "Western Rim, Grand Canyon after the rain.",
        "Queenstown, New Zealand",
        "The Shadow of K2, projected into China across hundreds of miles.",
        "I caught the last rays of sunset on Half Dome, Yosemite"
    ],

    /**
     * Authors of the images in /images/backup-wallpapers
     */
    backupAuthors: ["TheLostCrusader", "IamIrene", "Tuurby", "RoonilWazilbob", "Oxus007"],

    /**
    * Imgur urls to the images in /images/backup-wallpapers
    */
    backupUrls: [
        "https://i.imgur.com/c5vIKho.jpg",
        "https://i.imgur.com/93icizv.jpg",
        "https://i.imgur.com/33f17F7.jpg",
        "https://i.imgur.com/GwVvkEw.jpg",
        "https://i.imgur.com/91ko84h.jpg"
    ],

    /**
     * Generates a permutation of size N.
     */
    permutation: function(N) {
        var ar = Array();
        for (i = 0; i < N; i++) {
            ar.push(i);
        }
        var p = Array();
        for (i = 0; i < N; i++) {
            ind = Math.floor(ar.length * Math.random())
            p.push(ar[ind]);
            ar.splice(ind, 1);
        }
        return p;
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

    /**
     * Load first image.
     */
    loadFirstImage: function() {
        var order = this.permutation(this.CNT_BACKUP_IMAGES);
        localStorage.setItem("count", 0);
        localStorage.setItem("index", 0);
        for (i = 0; i < this.CNT_BACKUP_IMAGES; i++) {
            localStorage.setItem("image" + i, order[i]);
            localStorage.setItem("title" + i, this.backupTitles[order[i]]);
            localStorage.setItem("author" + i, this.backupAuthors[order[i]]);
            localStorage.setItem("url" + i, this.backupUrls[order[i]]);
        }
        var url = "/images/backup-wallpapers/image" + order[0] + ".jpg";
        document.body.style.background = "url(" + url + ") no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";
        this.displayTitleAuthor(this.backupTitles[order[0]], this.backupAuthors[order[0]]);
        this.displayShareButtons();
        this.setSharingLinks(this.backupUrls[order[0]]);
        this.setDownloadLink(this.backupUrls[order[0]]);
    },

    /**
     * Sets up Facebook and Twitter sharing links.
     */
    setSharingLinks: function(url) {
        document.getElementById("twitter_button").href = "https://twitter.com/intent/tweet?text=Beautiful image&url=" + url;
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
     * TODO: Refactor this function to make it more readable.
     */
    display: function(limitImages, cacheSize) {
        this.hideShareButtons();
        count = localStorage.getItem("count");
        if (count === null) {
            this.loadFirstImage();
        }
        else if (Number(count) < this.CNT_BACKUP_IMAGES) {
            var url = "/images/backup-wallpapers/image" + localStorage.getItem("image" + count) + ".jpg";
            document.body.style.background = "url(" + url + ") no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
            this.displayTitleAuthor(localStorage.getItem("title" + count), localStorage.getItem("author" + count));
            this.displayShareButtons();
            this.setSharingLinks(localStorage.getItem("url" + count));
            this.setDownloadLink(localStorage.getItem("url" + count));
        }
        var xmlHttp = new XMLHttpRequest();
        var parent = this;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var response = JSON.parse(xmlHttp.response);
                if (Number(count) < parent.CNT_BACKUP_IMAGES) {
                    // Caching top images repeatedly.
                    for (i = 0; i < cacheSize; i++) {
                        var imageUrl = response.data.children[i].data.url;
                        if (Number(count) == parent.CNT_BACKUP_IMAGES - 1) {
                            var imageAuthor = response.data.children[i].data.author;
                            var imageTitle = response.data.children[i].data.title;
                            localStorage.setItem("url" + i, imageUrl);
                            localStorage.setItem("author" + i, imageAuthor);
                            localStorage.setItem("title" + i, imageTitle);
                        }
                        imageData = new Image();
                        imageData.src = imageUrl;
                    }
                }
                else {
                    // Set the current background image first and then proceed with the caching the next images.
                    var index = localStorage.getItem("index");
                    var url = localStorage.getItem("url" + index % limitImages);
                    document.body.style.background = "url(" + url + ") no-repeat center center fixed";
                    document.body.style.backgroundSize = "cover";
                    if (localStorage.getItem("author" + index % limitImages) != null) {
                        parent.displayTitleAuthor(localStorage.getItem("title" + index % limitImages), localStorage.getItem("author" + index % limitImages));
                    }
                    parent.displayShareButtons();
                    parent.setSharingLinks(url);
                    parent.setDownloadLink(url);
                    // Caching images to be displayed.
                    for (i = 0; i < cacheSize; i++) {
                        var nextIndex = (Number(index) + 1 + i) % limitImages;
                        var imageUrl = response.data.children[nextIndex].data.url;
                        var imageAuthor = response.data.children[nextIndex].data.author;
                        var imageTitle = response.data.children[nextIndex].data.title;
                        localStorage.setItem("url" + nextIndex, imageUrl);
                        localStorage.setItem("author" + nextIndex, imageAuthor);
                        localStorage.setItem("title" + nextIndex, imageTitle);
                        imageData = new Image();
                        imageData.src = imageUrl;
                    }
                    localStorage.setItem("index", (Number(index) + 1));
                }
            } 
            else if (xmlHttp.readyState == 4) {
                // HTTP request completed but was not successful
                // if Number(count) < parent.CNT_BACKUP_IMAGES, then the background image is already set.
                if (Number(count) >= parent.CNT_BACKUP_IMAGES) {
                    var offlineIndex = Number(count) % parent.CNT_BACKUP_IMAGES;
                    var url = "/images/backup-wallpapers/image" + offlineIndex + ".jpg";
                    document.body.style.background = "url(" + url + ") no-repeat center center fixed";
                    document.body.style.backgroundSize = "cover";
                    parent.displayTitleAuthor(parent.backupTitles[offlineIndex], parent.backupAuthors[offlineIndex]);
                    parent.displayShareButtons();
                    parent.setSharingLinks(this.backupUrls[offlineIndex]);
                    parent.setDownloadLink(this.backupUrls[offlineIndex]);
                }
            }
        }
        xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit="+Number(limitImages), true);
        xmlHttp.send(null);
        localStorage.setItem("count", Number(count) + 1);
    }
});
