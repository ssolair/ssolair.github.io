// Notifications
function notify(msg, color) { // Normal
    var notifier = document.getElementById("notify");
    notifier.style.backgroundColor = color
    var notifierText = document.getElementById("notifyText");
    notifierText.innerText = msg;
    notifier.style.visibility = 'visible';
    setTimeout(() => {notifier.style.visibility='hidden'}, 5000);
}





ssID = "1NJrmjnYCJp-E4VJyQa3DmeZtm6-PwsFfkmyDBLrkLAw"

function get() {
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

function addImgsAll() {
    document.getElementById('body').innerHTML = "";
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: ssID,

        // Spreadsheet range to read/write to.
        range: 'Sheet1!A:A',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params); // Load All Images
    request.then(function(response) {
        let i = 0;
        LoadedImages = 0
        min = 0
        max = 9999999
        while (i < response.result.values.length) {
            // Add images to website
            function imgHandle() {
                LoadedImages += 1
                if (LoadedImages > min && LoadedImages < max) {
                    if (response.result.values[i][0].match(/\.(mp4|webm)$/)) {
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

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    notify("Signed out.", '#747200');
}
