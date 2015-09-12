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
     * Displays the image.
     */
    display: function(limitImages, cacheSize) {
        count = localStorage.getItem("count");
        if (count === null) {
            var order = this.permutation(5);
            localStorage.setItem("count", 0);
            localStorage.setItem("index", 0);
            localStorage.setItem("image1", order[1]);
            localStorage.setItem("image2", order[2]);
            document.body.style.background = "url(" + "/images/backup-wallpapers/image" + order[0] + ".jpg" + ") no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
        } else if (Number(count) < 3) {
            document.body.style.background = "url(" + "/images/backup-wallpapers/image" + localStorage.getItem("image" + count) + ".jpg" + ") no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
        }
        var index = localStorage.getItem("index");
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var response = JSON.parse(xmlHttp.response);
                if (Number(count) < 3) {
                    for (i = 0; i < cacheSize; i++) {
                        var imageUrl = response.data.children[i].data.preview.images[0].source.url;
                        localStorage.setItem("url" + i, imageUrl);
                        console.log("Initial caching: " + i);
                        imageData = new Image();
                        imageData.src = imageUrl;
                    }
                } else {
                    for (i = 0; i < cacheSize; i++) {
                        var nextIndex = (Number(index) + 1 + i) % limitImages;
                        var imageUrl = response.data.children[nextIndex].data.preview.images[0].source.url;
                        localStorage.setItem("url" + nextIndex, imageUrl);
                        console.log("Caching: " + nextIndex);
                        imageData = new Image();
                        imageData.src = imageUrl;
                    }
                    console.log("Loaded image index: " + index);
                    document.body.style.background = "url(" + localStorage.getItem("url" + index % limitImages) + ") no-repeat center center fixed";
                    document.body.style.backgroundSize = "cover";
                    localStorage.setItem("index", (Number(index) + 1));
                }
            }
        }
        xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit=10", true);
        xmlHttp.send(null);
        localStorage.setItem("count", Number(count) + 1);
    }
});
