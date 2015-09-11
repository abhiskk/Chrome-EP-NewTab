/**
 * Controls the image being displayed in newtab.
 */
backgrounds.Photo = new Model({
    /**
     * Displays the image.
     */
    display: function(limitImages) {
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
});
