function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        return true
    } catch (e) {
        return false;
    }
}

// TODO darkstar: pass an index to getNewImage to download variety of images.
function getNewImage() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            var response = JSON.parse(xmlHttp.response);
            var imageUrl = response.data.children[3].data.preview.images[0].source.url;
            imageData = new Image();
            imageData.src = imageUrl;
            document.body.style.background = "url(" + imageData.src + ") no-repeat center center fixed";
            document.body.style.backgroundSize = "cover";
            localStorage.setItem("photo", imageData);
            console.log(imageUrl);
        }
    }
    xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit=5", true);
    xmlHttp.send(null);
}

getNewImage();
