/**
 * Controls the image being displayed in newtab.
 */
backgrounds.Photo = new Model({
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

    /**
     * Load first image.
     */
    loadFirstImage: function() {
        var order = this.permutation(5);
        localStorage.setItem("count", 0);
        localStorage.setItem("index", 0);
        localStorage.setItem("image1", order[1]);
        localStorage.setItem("image2", order[2]);
        document.body.style.background = "url(" + "/images/backup-wallpapers/image" + order[0] + ".jpg" + ") no-repeat center center fixed";
        document.body.style.backgroundSize = "cover";
        document.getElementById("twitter_button").style.visibility = "visible";
        document.getElementById("facebook_button").style.visibility = "visible"
    },

    /**
     * Displays the image.
     */
        display: function(limitImages, cacheSize) {
        document.getElementById("twitter_button").style.visibility = "hidden";
        document.getElementById("facebook_button").style.visibility = "hidden"
        count = localStorage.getItem("count");
        if (count === null) {
            this.loadFirstImage();
        } else if (Number(count) < 3) {
            document.body.style.background = "url(" + "/images/backup-wallpapers/image" + localStorage.getItem("image" + count) + ".jpg" + ") no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
            document.getElementById("twitter_button").style.visibility = "visible";
            document.getElementById("facebook_button").style.visibility = "visible"
        }
        var index = localStorage.getItem("index");
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var response = JSON.parse(xmlHttp.response);
                if (Number(count) < 3) {
                    // Caching top images repeatedly.
                    for (i = 0; i < cacheSize; i++) {
                        var imageUrl = response.data.children[i].data.preview.images[0].source.url;
                        localStorage.setItem("url" + i, imageUrl);
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
                    document.body.style.background = "url(" + localStorage.getItem("url" + index % limitImages) + ") no-repeat center center fixed";
                    document.body.style.backgroundSize = "cover";
                    if (localStorage.getItem("author" + index % limitImages) != null) {
                        // Display text pertaining to the image at the bottom of the page.
                        var author = localStorage.getItem("author" + index % limitImages);
                        var title = localStorage.getItem("title" + index % limitImages);
                        // Regex matching
                        var myRe = /\[?o?c?\]?\s*\[?\d+,?\d*\s*x\s*\d+,?\d*\s*\]?\s*\[?o?c?\]?/gi;
                        var myArray = myRe.exec(title);
                        if (myArray != null) {
                            title = title.slice(0, myArray.index) + title.slice(myRe.lastIndex);
                        }
                        var div = document.createElement('div');
                        var span1 = document.createElement('span');
                        var text1 = document.createTextNode(title.trim());
                        span1.style.fontSize = '18px';
                        span1.style.position = 'absolute';
                        span1.style.bottom = '15px';
                        span1.style.color = 'white';
                        span1.style.fontWeight = 'bold';
                        span1.appendChild(text1);
                        var span2 = document.createElement('span');
                        var text2 = document.createTextNode('posted by ' + author.trim());
                        span2.style.fontSize = '13px';
                        span2.style.position = 'absolute';
                        span2.style.color = 'white';
                        span2.style.bottom = 0;
                        span2.appendChild(text2);
                        div.appendChild(span1);
                        div.appendChild(span2);
                        document.body.appendChild(div);
                    }
                    document.getElementById("twitter_button").style.visibility = "visible";
                    document.getElementById("facebook_button").style.visibility = "visible"
                    localStorage.setItem("index", (Number(index) + 1));
                }
            }
        }
        xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit=10", true);
        xmlHttp.send(null);
        localStorage.setItem("count", Number(count) + 1);
    }
});
