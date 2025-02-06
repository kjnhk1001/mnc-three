import * as THREE from "three";

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
