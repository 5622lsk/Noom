const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");

let myStream; //오디오 +  비디오
let muted = false; //처음엔 소리 나는 상태로 시작
let cameraOff = false; //카메라 킨상태로 시작

async function getCameras(){
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device  => device.kind === "videoinput");
    cameras.forEach(camera => {
      const option = document.createElement("option")
      option.value = camera.deviceId;
      option.innerText = camera.label;
      camerasSelect.appendChild(option);
    })
  }catch (e) {
    console.log(e);
  }
}

async function getMedia(){
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      {
        audio: true,
        video: true
      });
      myFace.srcObject = myStream;
  } catch (e) {
    console.log(e)
  }
}

getMedia();

function handleMuteClick() {
  myStream //오디오 껐다 켜기
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if(!muted){
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}
function handleCameraClick() {
  myStream //비디오 껐다 켜기
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if(cameraOff){
    cameraBtn.innerText = "Turn Camera Off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera ON";
    cameraOff = true;
  }
}
function handleCameraChange(){
  console.log(camerasSelect.value);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);