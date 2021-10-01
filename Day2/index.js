// Create an Agora Client fd0dd94981cb46f6974cd99eb62077bf
// Agora Documentation: https://docs.agora.io/en/Video/API%20Reference/web_ng/index.html
var client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"}); // rtc: all users can talk,  codec: vp8 is h264 

var localTracks = {
    audioTrack: null,
    videoTrack: null
};

var remoteUsers = {};

var options = {
    appID: "fd0dd94981cb46f6974cd99eb62077bf",
    channel: null,
    token: null,
    uid: null
};

// Join Form
$("#join-form").submit(async function(e) {
    e.preventDefault();
    console.log("Form Submit Button Clicked!");
    options.appID = options.appID;
    options.channel = $("#channel").val();
    await join();
});

async function join() {
    // Join Channel
    client.on("user-published", handleUserPublished);
    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);
    options.uid = await client.join(options.appID, options.channel, null, null); // || null: agora automatically generates something
    localTracks.audioTrack =  await AgoraRTC.createMicrophoneAudioTrack();
    localTracks.videoTrack =  await AgoraRTC.createCameraVideoTrack();

    localTracks.audioTrack.play("local-player");
    localTracks.videoTrack.play("local-player");
    await client.publish(Object.values(localTracks));
}

function handleUserPublished(user, mediaType) {
    subscribe(user, mediaType);
}

function handleUserJoined(user) {
    console.log("User" + user.appID + "has joined the channel!");
}

function handleUserLeft(user) {
    console.log("User" + user.appID + "has left the channel!");
}