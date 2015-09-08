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
            var imageUrl = response.data.children[0].data.preview.images[0].source.url;
            document.body.style.backgroundImage = "url(" + imageUrl + ")";
            $.getJSON("https://i.redditmedia.com/AhfIPHSdE76Sy7oZWw3ul9whA_EyTNF4PMO51XYtf1s.jpg?s=c4c7b9aad3f936941f318acdbe5e1554", function(data) {
                // var dataToStore = JSON.stringify(data);
                // localStorage.setItem('photo', dataToStore);
            }).fail(function() {
                console.log("not able to get the image.")
            });
        }
    }
    xmlHttp.open("GET", "https://www.reddit.com/r/EarthPorn/top/.json?limit=1", true);
    xmlHttp.send(null);
}

if (storageAvailable('localStorage')) {
    console.log("YO!! WE HAVE STORAGE.");
} else {
    console.log("NO :( WE DON'T HAVE STORAGE")
}

getNewImage();
