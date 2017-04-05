var nickname;
var myurl;

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

window.onload = function() {
    nickname = getURLParameter('nickname');
    myurl = 'https://www.instagram.com/' + nickname + '/media/';
    loadData(myurl);
  };

loadData = function( mediaUrl ) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', mediaUrl , false);
  xhr.send();
  if (xhr.status != 200) {
    console.log( xhr.status + ': ' + xhr.statusText );
  } else {
    var mediaObj = JSON.parse( xhr.responseText );
    processMediaObj(mediaObj);
  }
}

processMediaObj = function( mediaObj ){
  var i = 0;
  var j = 0;
  var myUrl = '';

  var itemsLength = mediaObj.items.length;

  for (i = 0; i < itemsLength ; i++) {
    //console.log(mediaObj.items[i]);

    var commentsObj = mediaObj.items[i].comments;
    if ( commentsObj.count > 0 ) {
      for ( j = 0; j < commentsObj.data.length; j++ ){
         if ( commentsObj.data[j].from.username != MY_USER ){
        //    if ( commentsObj.data[j].from.username == MY_USER ){
          // console.log(mediaObj.items[i]);

          var photoScr = mediaObj.items[i].images.standard_resolution.url;
          photoScr = photoScr.replace('s640x640', 's1080x1080');
          // console.log(commentsObj.data[j].created_time);
          var timeSec = commentsObj.data[j].created_time;
          var commentDate = new Date( +timeSec );
          // console.log(commentDate);
          var commentTxt = commentsObj.data[j].from.username + ': ' + commentsObj.data[j].text + ' (<a target="_blank" href="'+ mediaObj.items[i].link +'">post</a>, <a target="_blank" href="' + photoScr + '">big photo</a>)';
          var node = document.createElement("LI");                 // Create a <li> node
          node.innerHTML = commentTxt;
          // var textnode = document.createTextNode(commentTxt);       // Create a text node
          // node.appendChild(textnode);                              // Append the text to <li>
          document.getElementById("myList").appendChild(node);    // Append <li> to <ul> with id="myList"
         }
      }
    }
    if ( i === ( itemsLength - 1 ) ) {
      myUrl = MY_URL + '?max_id=' + mediaObj.items[i].id;
    } else {
      myUrl = '';
    }
  }

  if (myUrl !== '' ) {
       //loadData(myUrl);
  }
}
