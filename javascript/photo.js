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
    display: function(limitImages) {
        count = localStorage.getItem("count");
        if (count === null) {
            var order = this.permutation(5);
            console.log(order);
            localStorage.setItem("count", 1);
            localStorage.setItem("image1", order[1]);
            localStorage.setItem("image2", order[2]);
            document.body.style.background = "url(" + "/images/backup-wallpapers/image"+ order[0] +".jpg" + ") no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
        } else if (Number(count) < 3) {
            localStorage.setItem("count", Number(count) + 1);
            document.body.style.background = "url(" + "/images/backup-wallpapers/image"+ localStorage.getItem("image"+count) +".jpg" + ") no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
        } else {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    if (localStorage.getItem("index") === null) {
                        localStorage.setItem("index", 0);
                    }
                    var index = localStorage.getItem("index");
                    if (Number(index) % 10 == 0) {
                        console.log("Loading images.");
                        var response = JSON.parse(xmlHttp.response);
                        for (i = 0; i < limitImages; i++) {
                            var imageUrl = response.data.children[i].data.preview.images[0].source.url;
                            localStorage.setItem("url" + i, imageUrl);
                            imageData = new Image();
                            imageData.src = imageUrl;
                        }
                    }
                    console.log(index);
                    localStorage.setItem("index", (Number(index) + 1));
                    document.body.style.background = "url(" + localStorage.getItem("url" + index % limitImages) + ") no-repeat center center fixed";
                    document.body.style.backgroundSize = "cover";
                }
            }
            xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit=10", true);
            xmlHttp.send(null);
        }
    }
});
