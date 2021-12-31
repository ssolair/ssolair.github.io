// Change button colors when hovering over them
document.getElementById("update-button").addEventListener("mouseover", ev => { // Load images button
    document.getElementById("update-button").style.backgroundColor = '#8FB1E0'
})
document.getElementById("update-button").addEventListener("mouseout", ev => {
    document.getElementById("update-button").style.backgroundColor = '#A1C7FF'
})
document.addEventListener('keydown', function(event){
    if(event.key === "Escape"){
        var notifier = document.getElementById("notify");
        notifier.style.visibility = 'hidden';
        var ex = document.getElementById("notifimage")
        ex.remove()
    }
})

var tpages = document.getElementById("tpages")

// Notifications
function notify(msg) {
    var notifier = document.getElementById("notify");
    notifier.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
    if (msg.match(/\.(mp4|webm|mov)$/)) { // To add support for another file extension that displays on a website, add |extensionhere after the last extension.
        var imgs = document.createElement("video");
        imgs.setAttribute("controls","controls")
        imgs.setAttribute("loop","true")
    } else {
        var imgs = document.createElement("img");
    }
    var src = document.getElementById("notify"); 
    imgs.src = msg;
    imgs.id = "notifimage";
    src.appendChild(imgs);
    imgs.style.width = 'auto';
    imgs.style.height = 'auto';
    imgs.style.border = "0px";
    notifier.style.visibility = 'visible';
}
function comparelist(taglist, list, min_list){
    for (var a of list) {
        if (!(taglist.includes(a))){
            return false
        }
    }
    for (var b of min_list) {
        if (taglist.includes(b)) {
            return false
        }
    }
    return true
}

function search_len(result, list, min_list) {
    files= [];
    count = 0;
    for(i = 0; i < result.values.length; i++){
        var url = result.values[i][0]
        var tags = result.values[i][1].slice(2, -2).split("', '")
        if (comparelist(tags, list, min_list)){
            files[count] = {
                url: url,
                tags: tags
            }
            count++;
        }
    }
    return files
}

function enterclick(inputElement) {
    inputElement.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("update-button").click();
      }
    }); 
}
var input = document.getElementById("tags");
enterclick(input)
input = document.getElementById("page");
enterclick(input)

ssID = "1NJrmjnYCJp-E4VJyQa3DmeZtm6-PwsFfkmyDBLrkLAw"

function addImgsAll() { // Load all images with specified tags
    
    document.getElementById('body').innerHTML = "";
    var params = {
        spreadsheetId: ssID,
        range: 'Sheet1!A:B',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {

        var page = parseInt(document.getElementById("page").value)
        if (isNaN(page)){
            page = 1;
        }
        var file_nums = (page * 25)

        var query = document.getElementById('tags').value.split(', ');
        var min_query = [];
        for(let x = 0; x < query.length; x++){
            query[x] = query[x].toLowerCase()
            if (query[x][0] == '-') {
                min_query.push(query[x].substring(1));
                query.splice(x, 1);
                x--;
            }
        }
        if (query[0] == "") {
            query = []
        }
        files = search_len(response.result, query, min_query);
        tpages.innerHTML = ` out of ${Math.ceil(files.length/25).toString()}`
        tpages.style.visibility = 'visible';
        
        var imagearr = []

        for(i = (file_nums - 25); i < file_nums; i++) {
            console.log(i)
            if(i < files.length){
                if (files[i].url.match(/\.(mp4|webm|mov)$/)) { // To add support for another file extension that displays on a website, add |extensionhere after the last extension.
                    var imgs = document.createElement("video");
                    imgs.src = files[i].url;
                    imgs.setAttribute("controls","controls")
                    imgs.setAttribute("loop","true")
                } else {
                    var imgs = document.createElement("img");
                    imagearr.push(i)
                    imgs.src = files[i].url;
                }
            var src = document.getElementById("body"); 
            imgs.id = `img${i}`;
            imgs.style.width = '450px';
            imgs.style.height = 'auto';
            imgs.style.border = "5px";
            src.appendChild(imgs);
            }else{
                break
            }   
        }
        for(i = 0 ; i < imagearr.length ; i++) {
            var tmp = `img${imagearr[i]}`;
            var img = document.getElementById(tmp)
            img.onclick = `notify(${image.src})`
        }
    }, function(reason) { // Obviously just print the error if there is one
        console.error('error: ' + reason.result.error.message);
    });
}



function initClient() { // Runs right as the user enters the website.
    var API_KEY = 'AIzaSyA8v4fvkZwDNgqfICcvXxSAypOe1HWk_JM';

    var CLIENT_ID = '461958078181-kq3re2kbr613dg511su21e78ouvg8s29.apps.googleusercontent.com';
    
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // Scope

    gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    })
}

function handleClientLoad() { // When a client loads the page
    gapi.load('client:auth2', initClient);
}
