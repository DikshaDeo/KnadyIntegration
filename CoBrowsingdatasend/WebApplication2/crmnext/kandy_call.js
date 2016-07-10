/**
 * Kandy.io Call Demo
 * View this tutorial and others at https://developer.kandy.io/tutorials
 */
// Variables for logging in.
var projectAPIKey = "DAK4a53e88da8d64cbda25fe159c49c2240";
var username = "aman@acidcorporation.gmail.com";
var password = "acid_123";
var sessionId;
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

// What to do on a successful login.
function onLoginSuccess() {
    log("Login was successful.");
    $('#callincoming').hide();
   
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

    $('#callincoming').show();

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

// Starts receiving the web page
function startAgent() {
    log('Starting Agent (Receiving)');
    joinSession();

    
}

// Stops receiving the web page
function stopAgent() {
    log('Stopping Agent (Receiving)');
    kandy.coBrowsing.stopBrowsingAgent();
}
// Joins a session
function joinSession() {
    kandy.session.setListeners(sessionId, {
        'ondata': onSessionUserJoinRequest
    });
    //get the sessionid dynamically
    kandy.session.setListeners(sessionId, {
        onUserJoinRequest: onSessionUserJoinRequest,
        'onData': onData
    });
}
function onData(receivedData) {
    sessionId = receivedData.id;
    // Handle the data.
}
function onSessionUserJoinRequest(message) {
    kandy.session.acceptJoinRequest(message.session_id, message.full_user_id);
    sessionId = message.sessionid;

    kandy.session.join(sessionId, {}, onSessionJoinSuccess, onSessionFailure);
    log('Data recieved from DAP');
    //sessionId = data.session_id;
   //kandy.coBrowsing.startBrowsingUser(sessionId);
    // startCall();
}
// Provide feedback about joining the session
// and enable co-browsing buttons
function onSessionJoinSuccess() {
    log('Joined Session: ' + sessionId);
    var container = document.getElementById('cobrowsing-container');
    kandy.coBrowsing.startBrowsingAgent(sessionId, container);
 
}
function onSessionFailure(message) {
    log('Error Joining/Creating Session');
}
function onStopSuccess() {
    log('Screensharing stopped.');
    isSharing = false;
}

function onMediaError(error) {
    switch (error.type) {
        case kandy.call.MediaErrors.NOT_FOUND:
            log("No WebRTC support was found.");
            break;
        case kandy.call.MediaErrors.NO_SCREENSHARING_WARNING:
            log("WebRTC supported, but no screensharing support was found.");
            break;
        default:
            log('Other error or warning encountered.');
            break;
    }
}
function ScreenShare() {
    var optionsShare = {
        width: 200,
        height: 200,
        framerate: 15
    };
    kandy.call.startScreenSharing(callId, onStartSuccess, onStartFailure, optionsShare);
    //kandy.call.startScreenSharing(callId, onStartSuccess, onStartFailure);
}

// What to do on a successful screenshare start.
function onStartSuccess() {
    console.log('Screensharing started.');
    isSharing = true;
}

// What to do on a failed screenshare start.
function onStartFailure() {
    console.log('Failed to start screensharing.');
}
function ondatasendsuccess() {
    console.log("Data sent from DAP to CRMNEXT success");
}
