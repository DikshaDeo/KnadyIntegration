

// Variables for logging in.
var projectAPIKey = "DAK4a53e88da8d64cbda25fe159c49c2240";
var username = "amar@acidcorporation.gmail.com";
var password = "acid_123";
// Keep track of screensharing status.
var isSharing = false;
// Setup Kandy to make and receive calls.
kandy.setup({
    // Designate HTML elements to be our stream containers.
    remoteVideoContainer: document.getElementById("remote-container"),
    localVideoContainer: document.getElementById("local-container"),

    // Register listeners to call events.
    listeners: {
        callinitiated: onCallInitiated,
        callincoming: onCallIncoming,
        callestablished: onCallEstablished,
        callended: onCallEnded,
        media: onMediaError,
        callscreenstopped: onStopSuccess
    },
    // Reference the default Chrome extension.
    screenSharing: {
        chromeExtensionId: 'daohbhpgnnlgkipndobecbmahalalhcp'
    }
});

// Login automatically as the application starts.
kandy.login(projectAPIKey, username, password, onLoginSuccess, onLoginFailure);

function UIchanges() {
    // Handle UI changes. A call is in progress.
    document.getElementById("make-call").disabled = true;
}

// What to do on a successful login.
function onLoginSuccess() {
    log("Login was successful.");
    // Handle UI changes. A call is in progress.
    document.getElementById("make-call").disabled = false;
   
}

// What to do on a failed login.
function onLoginFailure() {
    log("Login failed. Make sure you input the user's credentials!");
}

// Utility function for appending messages to the message div.
function log(message) {
    document.getElementById("messages").innerHTML += "<div>" + message + "</div>";
}

// Variable to keep track of video display status.
var showVideo = true;

// Get user input and make a call to the callee.
function startCall() {
    var callee = document.getElementById("callee").value;

    // Tell Kandy to make a call to callee.
    kandy.call.makeCall(callee, showVideo);
}

// Variable to keep track of the call.
var callId;

// What to do when a call is initiated.
function onCallInitiated(call, callee) {
    log("Call initiated with " + callee + ". Ringing...");

    // Store the call id, so the caller has access to it.
    callId = call.getId();

    // Handle UI changes. A call is in progress.
    document.getElementById("make-call").disabled = true;
    document.getElementById("end-call").disabled = false;
}

// What to do for an incoming call.
function onCallIncoming(call) {
    log("Incoming call from " + call.callerNumber);

    // Store the call id, so the callee has access to it.
    callId = call.getId();

    // Handle UI changes. A call is incoming.
    document.getElementById("accept-call").disabled = false;
    document.getElementById("decline-call").disabled = false;
}

// Accept an incoming call.
function acceptCall() {
    // Tell Kandy to answer the call.
    kandy.call.answerCall(callId, showVideo);
    // Second parameter is false because we are only doing voice calls, no video.

    log("Call answered.");
    // Handle UI changes. Call no longer incoming.
    document.getElementById("accept-call").disabled = true;
    document.getElementById("decline-call").disabled = true;
}

// Reject an incoming call.
function declineCall() {
    // Tell Kandy to reject the call.
    kandy.call.rejectCall(callId);

    log("Call rejected.");
    // Handle UI changes. Call no longer incoming.
    document.getElementById("accept-call").disabled = true;
    document.getElementById("decline-call").disabled = true;
}

// What to do when call is established.
function onCallEstablished(call) {
    log("Call established.");

    // Handle UI changes. Call in progress.
    document.getElementById("make-call").disabled = true;
    document.getElementById("mute-call").disabled = false;
    document.getElementById("hold-call").disabled = false;
    document.getElementById("end-call").disabled = false;
    document.getElementById("screensharing").disabled = false;
}

// End a call.
function endCall() {
    // Tell Kandy to end the call.
    kandy.call.endCall(callId);
}

// Variable to keep track of mute status.
var isMuted = false;

// Mute or unmute the call, depending on current status.
function toggleMute() {
    if(isMuted) {
        kandy.call.unMuteCall(callId);
        log("Unmuting call.");
        isMuted = false;
    } else {
        kandy.call.muteCall(callId);
        log("Muting call.");
        isMuted = true;
    }
}

// Variable to keep track of hold status.
var isHeld = false;

// Hold or unhold the call, depending on current status.
function toggleHold() {
    if(isHeld) {
        kandy.call.unHoldCall(callId);
        log("Unholding call.");
        isHeld = false;
    } else {
        kandy.call.holdCall(callId);
        log("Holding call.");
        isHeld = true;
    }
}

// What to do when a call is ended.
function onCallEnded(call) {
    log("Call ended.");

    // Handle UI changes. No current call.
    document.getElementById("make-call").disabled = false;
    document.getElementById("mute-call").disabled = true;
    document.getElementById("hold-call").disabled = true;
    document.getElementById("end-call").disabled = true;
    document.getElementById('screensharing').disabled = true;

    // Call no longer active, reset mute and hold statuses.
    isMuted = false;
    isHeld = false;
}

// Show or hide video, depending on current status.
function toggleVideo() {
    if(showVideo) {
        kandy.call.stopCallVideo(callId);
        log("Stopping send of video.");
        showVideo = false;
    } else {
        kandy.call.startCallVideo(callId);
        log("Starting send of video.");
        showVideo = true;
    }
}

// Starts sending the current web page
function startUser() {
    createSession();

    
}

// Stops sending the current web page
function stopUser() {
    log('Stopping User (Sending)');
    kandy.coBrowsing.stopBrowsingUser();
}
var sessionid;
// Creates a session
function createSession() {
    // None of this is important for this example
    // but we need a unique name.
    var randomId = Date.now();
    var sessionConfig = {
        session_type: randomId,
        session_name: randomId,
        session_description: randomId
    };
    kandy.session.create(sessionConfig, onSessionCreateSuccess, onSessionFailure);
  
}

// Provide some feedback
function onSessionCreateSuccess(session) {
    sessionId = session.session_id;
    log('session created for amar ');
    kandy.session.activate(sessionId);

    // register Kandy session listeners  //////////// handling session from user to Agent
    //kandy.session.setListeners(sessionId, {
    //    'onData': sendDataToUser
    //});
    sendDataToUser();

    kandy.session.setListeners(sessionId, {
        onUserJoinRequest: onSessionUserJoinRequest
    });

}

function sendDataToUser()
{
    var data = {
            session_id: sessionid,
            source: username,
    };
    var destination = "aman@acidcorporation.gmail.com";
    kandy.session.sendData(sessionId, data, ondatasendsuccess, ondatasendfailure, destination)
}

function ondatasendsuccess()
{
    console.log("Data sent from DAP to CRMNEXT success");
}

function ondatasendfailure()
{
    console.log("Failed data sending to CRMNEXT");
}

// Automatically accept join requests
function onSessionUserJoinRequest(data) {
    kandy.session.acceptJoinRequest(data.session_id, data.full_user_id);

    log('Screen is shared  Agent');
    kandy.coBrowsing.startBrowsingUser(sessionId);
    // startCall();
}
// Provide feedback about failure
function onSessionFailure(message) {
    log('Error Joining/Creating Session');
}
// Called when the media event is triggered.
function onMediaError(error) {
    switch (error.type) {
        case kandy.call.MediaErrors.NOT_FOUND:
            console.log("No WebRTC support was found.");
            break;
        case kandy.call.MediaErrors.NO_SCREENSHARING_WARNING:
            console.log("WebRTC supported, but no screensharing support was found.");
            break;
        default:
            console.log('Other error or warning encountered.');
            break;
    }
}
function onStopSuccess() {
    log('Screensharing stopped.');
    isSharing = false;
}
function ScreenShare()
{
    var optionsShare = {
        width: 2000,
        height: 1000,
        framerate: 15
    };
    kandy.call.startScreenSharing(callId, onStartSuccess, onStartFailure, optiononSessionCreateSuccesssShare);
}


// What to do on a successful screenshare start.
function onStartSuccess() {
    log('Screensharing started.');
    isSharing = true;
}


// What to do on a failed screenshare start.
function onStartFailure() {
    log('Failed to start screensharing.');
}
