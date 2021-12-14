// Change button colors when hovering over them
document.getElementById("update-button").addEventListener("mouseover", ev => { // Load images button
    document.getElementById("update-button").style.backgroundColor = '#8FB1E0'
})
document.getElementById("update-button").addEventListener("mouseout", ev => {
    document.getElementById("update-button").style.backgroundColor = '#A1C7FF'
})

// Notifications
function notify(msg, color) {
    var notifier = document.getElementById("notify");
    notifier.style.backgroundColor = color
    var notifierText = document.getElementById("notifyText");
    notifierText.innerText = msg;
    notifier.style.visibility = 'visible';
    setTimeout(() => {notifier.style.visibility='hidden'}, 5000);
}





ssID = "1NJrmjnYCJp-E4VJyQa3DmeZtm6-PwsFfkmyDBLrkLAw"

function get() { // Not important, ignore this
    var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: ssID,

    // The A1 notation of the values to retrieve.
    range: 'Sheet1',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
    }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    });
}

function addImgsAll() { // Load all images with specified tags
    document.getElementById('body').innerHTML = "";
    var params = {
        spreadsheetId: ssID,
        range: 'Sheet1!A:B',
    };
    
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        let i = 0;
        LoadedImages = 0
        min = parseInt(document.getElementById("from").value) - 1
        max = parseInt(document.getElementById("to").value) + 1
        if (isNaN(min)) {
            min = 0
        }
        if (isNaN(max)) {
            max = 9999999
        }
        var rows_data = new array(response.result.values.length)
        for(let i = 0; i < rows_data.length; i++) {
            rows_data[i] = {
                url: response.result.values[i][0],
                tags = response.result.velues[i][1].split(', ')
            }
        }
        while (i < response.result.values.length) {
            // Add images to website
            function imgHandle() {
                LoadedImages += 1
                if (LoadedImages > min && LoadedImages < max) {
                    if (response.result.values[i][0].match(/\.(mp4|webm|mov)$/)) {
                        var imgs = document.createElement("video");
                        imgs.setAttribute("controls","controls")
                        imgs.setAttribute("loop","true")
                    } else {
                        var imgs = document.createElement("img");
                    }
                    var src = document.getElementById("body");
                    imgs.src = response.result.values[i][0];
                    src.appendChild(imgs);
                    imgs.style.width = imgsize;
                    imgs.style.height = 'auto';
                }
            }
            if (response.result.values[i][0] != null) {
                imgHandle();
            }

            i++;
        }
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}



function initClient() {
    var API_KEY = 'AIzaSyA8v4fvkZwDNgqfICcvXxSAypOe1HWk_JM';

    var CLIENT_ID = '461958078181-kq3re2kbr613dg511su21e78ouvg8s29.apps.googleusercontent.com';
    
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // Scope

    gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
    get();
    notify("Signed in.", '#00744d');
    }
}
