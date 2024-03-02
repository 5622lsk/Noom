const socket = io();
//1. phone call
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

call.hidden = true;

let myStream; //오디오 +  비디오
let muted = false; //처음엔 소리 나는 상태로 시작
let cameraOff = false; //카메라 킨상태로 시작

async function getCameras(){
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device  => device.kind === "videoinput");
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach(camera => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if(currentCamera.label === camera.label) {
        option.selected = true;
      }
      camerasSelect.appendChild(option);
    })
  }catch (e) {
    console.log(e);
  }
}

async function getMedia(deviceId){
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: {exact: deviceId }},
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;
    if(!deviceId){
      await getCameras();
    }
  } catch (e) {
    console.log(e)
  }
}



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
async function handleCameraChange(){
  await getMedia(camerasSelect.value);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

//2. welcome Form(join the room)
const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

function startMedia(){
  welcome.hidden = true;
  call.hidden = false;
  getMedia();
}

function handelWelcomeSubmit(event){
  event.preventDefault(); //폼 제출 전까지 새로고침 방지
  const input = welcomeForm.querySelector("input");
  socket.emit("join_room", input.value, startMedia);
  input.value = "";
}

welcomeForm.addEventListener("submit", handelWelcomeSubmit);