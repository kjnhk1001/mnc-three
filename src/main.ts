import * as THREE from "three";

let videoElement;
let currentDeviceIndex = 0; // 現在のカメラインデックス（0: リア, 1: イン）

// 📷 使用可能なカメラデバイスを取得する関数
async function getCameraDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === "videoinput");
}

// 📷 指定したデバイスIDでカメラを起動する関数
async function startCamera(deviceId = null) {
  try {
    const constraints = {
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: "environment" },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (!videoElement) {
      videoElement = document.createElement("video");
      videoElement.setAttribute("autoplay", "");
      videoElement.setAttribute("playsinline", "");
      document.body.appendChild(videoElement);
    } else {
      // 現在のカメラストリームを停止
      videoElement.srcObject?.getTracks().forEach((track) => track.stop());
    }

    videoElement.srcObject = stream;
    return videoElement;
  } catch (err) {
    console.error("カメラの取得エラー:", err);
  }
}

// 📷 カメラの切り替え
async function switchCamera() {
  try {
    const videoDevices = await getCameraDevices();

    if (videoDevices.length < 2) {
      console.warn("カメラの切り替えができません（1つしか検出されていません）");
      return;
    }

    // 🔄 現在のカメラインデックスを変更
    currentDeviceIndex = (currentDeviceIndex + 1) % videoDevices.length;
    console.log("切り替え後のカメラ:", videoDevices[currentDeviceIndex].label);

    // 新しいカメラでストリームを取得
    const video = await startCamera(videoDevices[currentDeviceIndex].deviceId);
    updateVideoTexture(video);
  } catch (err) {
    console.error("カメラの切り替えエラー:", err);
  }
}

// 📷 カメラ映像を取得
const video = document.createElement("video");
video.setAttribute("autoplay", "");
video.setAttribute("playsinline", "");
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } }) // 📷 リアカメラ
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => console.error("カメラの取得エラー:", err));

// 🎥 Three.js の初期化
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5; // カメラを後ろに移動
camera.fov = 140; // 広角にする
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 📺 VideoTexture を作成（カメラ映像を背景として使用）
const videoTexture = new THREE.VideoTexture(video);
const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const videoGeometry = new THREE.PlaneGeometry(16, 9);
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
videoMesh.scale.set(6, 10, 1); // 背景サイズを適切な比率に
videoMesh.position.z = -10; // 背景を遠くに配置
scene.add(videoMesh);

// 🟢 3D オブジェクト（ボックス）を作成
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0, 0); // カメラの前に配置
box.scale.set(2, 2, 2); // ボックスを小さく調整
scene.add(box);

// 💡 照明の追加
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(1, 1, 1);
scene.add(light);

// 🔄 アニメーションループ
function animate() {
  requestAnimationFrame(animate);
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
