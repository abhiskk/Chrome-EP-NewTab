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
        var span1 = document.createElement('span');
        var text1 = document.createTextNode(title.trim());
        span1.style.fontSize = '18px';
        span1.style.position = 'absolute';
        span1.style.bottom = '34px';
        span1.style.color = 'white';
        span1.style.fontWeight = 'bold';
        span1.appendChild(text1);
        var span2 = document.createElement('span');
        var text2 = document.createTextNode('posted by ' + author.trim());
        span2.style.fontSize = '13px';
        span2.style.position = 'absolute';
        span2.style.color = 'white';
        span2.style.bottom = '19px';
        span2.appendChild(text2);
        div.appendChild(span1);
        div.appendChild(span2);
        document.body.appendChild(div);
    },

    /**
     * Load first image.
     */
    loadFirstImage: function() {
        var order = this.permutation(this.CNT_BACKUP_IMAGES);
        localStorage.setItem("count", 0);
        localStorage.setItem("index", 0);
        for (i = 1; i < this.CNT_BACKUP_IMAGES; i++) {
            localStorage.setItem("image" + i, order[i]);
            localStorage.setItem("title" + i, this.backupTitles[order[i]]);
            localStorage.setItem("author" + i, this.backupAuthors[order[i]]);
        }
        var url = "/images/backup-wallpapers/image" + order[0] + ".jpg";
        document.body.style.background = "url(" + url + ") no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";
        this.displayTitleAuthor(this.backupTitles[order[0]], this.backupAuthors[order[0]]);
        this.displayShareButtons();
        this.setDownloadLink(url);
    },

    /**
     * Sets up the download link for download_button.
     */
    setDownloadLink: function(url) {
        document.getElementById("download_button").href = url;
    },

    /**
     * Displays the image.
     */
    display: function(limitImages, cacheSize) {
        this.hideShareButtons();
        count = localStorage.getItem("count");
        if (count === null) {
            this.loadFirstImage();
        } else if (Number(count) < 3) {
            var url = "/images/backup-wallpapers/image" + localStorage.getItem("image" + count) + ".jpg";
            document.body.style.background = "url(" + url + ") no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
            this.displayTitleAuthor(localStorage.getItem("title" + count), localStorage.getItem("author" + count));
            this.displayShareButtons();
            this.setDownloadLink(url);
        }
        var index = localStorage.getItem("index");
        var xmlHttp = new XMLHttpRequest();
        var parent = this;
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var response = JSON.parse(xmlHttp.response);
                if (Number(count) < 3) {
                    // Caching top images repeatedly.
                    for (i = 0; i < cacheSize; i++) {
                        var imageUrl = response.data.children[i].data.preview.images[0].source.url;
                        if (Number(count) == 2) {
                            var imageAuthor = response.data.children[i].data.author;
                            var imageTitle = response.data.children[i].data.title;
                            localStorage.setItem("url" + i, imageUrl);
                            localStorage.setItem("author" + i, imageAuthor);
                            localStorage.setItem("title" + i, imageTitle);
                        }
                        imageData = new Image();
                        imageData.src = imageUrl;
                    }
                } else {
                    // Caching images to be displayed.
                    for (i = 0; i < cacheSize; i++) {
                        var nextIndex = (Number(index) + 1 + i) % limitImages;
                        var imageUrl = response.data.children[nextIndex].data.preview.images[0].source.url;
                        var imageAuthor = response.data.children[nextIndex].data.author;
                        var imageTitle = response.data.children[nextIndex].data.title;
                        localStorage.setItem("url" + nextIndex, imageUrl);
                        localStorage.setItem("author" + nextIndex, imageAuthor);
                        localStorage.setItem("title" + nextIndex, imageTitle);
                        imageData = new Image();
                        imageData.src = imageUrl;
                    }
                    var url = localStorage.getItem("url" + index % limitImages);
                    document.body.style.background = "url(" + url + ") no-repeat center center fixed";
                    document.body.style.backgroundSize = "cover";
                    if (localStorage.getItem("author" + index % limitImages) != null) {
                        parent.displayTitleAuthor(localStorage.getItem("title" + index % limitImages), localStorage.getItem("author" + index % limitImages));
                    }
                    parent.displayShareButtons();
                    parent.setDownloadLink(url);
                    localStorage.setItem("index", (Number(index) + 1));
                }
            } else if (xmlHttp.readyState == 4) {
                // HTTP request completed but was not successful
                // if Number(count) < 3, then the background image is already set
                if (Number(count) >= 3) {
                    var url = "/images/backup-wallpapers/image" + Number(count) % parent.CNT_BACKUP_IMAGES + ".jpg";
                    document.body.style.background = "url(" + url + ") no-repeat center center fixed";
                    document.body.style.backgroundSize = "cover";
                    parent.displayTitleAuthor(parent.backupTitles[Number(count) % parent.CNT_BACKUP_IMAGES], parent.backupAuthors[Number(count) % parent.CNT_BACKUP_IMAGES]);
                    parent.displayShareButtons();
                    parent.setDownloadLink(url);
                }
            }
        }
        xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit=10", true);
        xmlHttp.send(null);
        localStorage.setItem("count", Number(count) + 1);
    }
});
