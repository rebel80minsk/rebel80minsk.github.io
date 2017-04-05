var myNickname = '';
var myUrl = '';
var myComments = '';
var myTestMode = '';
var myTitle = '';
var myOwnComments = '';

// $('.darken').hover(function() {
//     $(this).find('img').fadeTo(500, 0.5);
// }, function() {
//     $(this).find('img').fadeTo(500, 1);
// });

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

window.onload = function() {
    myNickname = getURLParameter('nickname');
    // myUrl = 'https://crossorigin.me/https://www.instagram.com/' + myNickname + '/media/';
    myUrl = 'https://cors-anywhere.herokuapp.com/https://www.instagram.com/' + myNickname + '/media/';

    myComments = getURLParameter('comments');
    myTestMode = getURLParameter('testmode');
    myOwnComments = getURLParameter('owncomments');

    myTitle = myNickname + '(';

    if (myComments === 'X') {
        myTitle = myTitle + 'comments)';
    } else {
        document.getElementById("mylist").classList.add("my-photos-ul");
        myTitle = myTitle + 'photos)';
    }

    document.title = myTitle;
    loadData(myUrl);
};

loadData = function(mediaUrl) {
    var xhr = new XMLHttpRequest();

    // xhr.open('GET', mediaUrl, false);
    xhr.open('GET', mediaUrl, true);

    xhr.send();

    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            console.log(xhr.status + ': ' + xhr.statusText);
        } else {
            var mediaObj = JSON.parse(xhr.responseText);
            if (myComments === 'X') {
                processMediaObjComments(mediaObj);
            } else {
                processMediaObjPhotos(mediaObj);
            }
        }
    }
    //
    // if (xhr.status != 200) {
    //     console.log(xhr.status + ': ' + xhr.statusText);
    // } else {
    //     var mediaObj = JSON.parse(xhr.responseText);
    //     if (myComments === 'X') {
    //         processMediaObjComments(mediaObj);
    //     } else {
    //         processMediaObjPhotos(mediaObj);
    //     }
    // }
}

processMediaObjPhotos = function(mediaObj) {
    var i = 0;
    var j = 0;
    var nextUrl = '';

    var itemsLength = mediaObj.items.length;

    for (i = 0; i < itemsLength; i++) {
        //console.log(mediaObj.items[i]);

        var photoTxt = '<a class="darken" target="_blank" href="' + mediaObj.items[i].link + '"><img src="' + mediaObj.items[i].images.thumbnail.url + '" data-likes-count="' + mediaObj.items[i].likes.count + '" data-comments-count="' + mediaObj.items[i].comments.count + '"></img></a>';

        var node = document.createElement("li"); // Create a <li> node
        node.innerHTML = photoTxt;
        document.getElementById("mylist").appendChild(node);

        if (i === (itemsLength - 1)) {
            nextUrl = myUrl + '?max_id=' + mediaObj.items[i].id;
        } else {
            nextUrl = '';
        }
    }

    if (nextUrl !== '') {
        if (myTestMode !== 'X') {
            loadData(nextUrl);
        }
    }
}

processMediaObjComments = function(mediaObj) {
    var i = 0;
    var j = 0;
    var nextUrl = '';

    var itemsLength = mediaObj.items.length;

    for (i = 0; i < itemsLength; i++) {
        //console.log(mediaObj.items[i]);

        var commentsObj = mediaObj.items[i].comments;
        if (commentsObj.count > 0) {
            for (j = 0; j < commentsObj.data.length; j++) {
                if (myOwnComments !== 'X') {
                    if (commentsObj.data[j].from.username === myNickname) {
                        continue;
                    }
                }

                // console.log(mediaObj.items[i]);

                var photoScr = mediaObj.items[i].images.standard_resolution.url;
                photoScr = photoScr.replace('s640x640', 's1080x1080');
                // console.log(commentsObj.data[j].created_time);
                var timeSec = commentsObj.data[j].created_time;
                var commentDate = new Date(+timeSec);
                // console.log(commentDate);
                //var commentTxt = '<a href="#">sdasdasd</a>';
                var commentTxt = commentsObj.data[j].from.username + ': ' + commentsObj.data[j].text + ' (<a target="_blank" href="' + mediaObj.items[i].link + '">post</a>, <a target="_blank" href="' + photoScr + '">big photo</a>)';
                var node = document.createElement("li"); // Create a <li> node
                node.innerHTML = commentTxt;
                // var textnode = document.createTextNode(commentTxt);       // Create a text node
                // node.appendChild(textnode);                              // Append the text to <li>
                document.getElementById("mylist").appendChild(node); // Append <li> to <ul> with id="myList"

            }
        }
        if (i === (itemsLength - 1)) {
            nextUrl = myUrl + '?max_id=' + mediaObj.items[i].id;
        } else {
            nextUrl = '';
        }
    }

    if (nextUrl !== '') {
        if (myTestMode !== 'X') {
            loadData(nextUrl);
        }
    }
}
