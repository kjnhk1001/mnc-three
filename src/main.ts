import * as THREE from "three";
import { createBox, loadModel } from "./model";

// シーンの作成
const scene = new THREE.Scene();

// カメラの設定
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);
camera.fov = 140;
camera.updateProjectionMatrix();

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// 環境光と方向光の追加
const ambientLight = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// カメラ映像を取得して背景に設定
const video = document.createElement("video");
video.setAttribute("autoplay", "");
video.setAttribute("playsinline", "");
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => console.error("カメラの取得エラー:", err));

const videoTexture = new THREE.VideoTexture(video);
const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
const videoGeometry = new THREE.PlaneGeometry(25, 15);
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
videoMesh.scale.set(6, 10, 1);
videoMesh.position.z = -10;
scene.add(videoMesh);

// 3Dオブジェクト（ボックス）の作成
const box = createBox();
scene.add(box);

// モデルのURL
const modelUrl =
  "https://saito-debug.s3.ap-northeast-1.amazonaws.com/FS_1.glb?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEE8aDmFwLW5vcnRoZWFzdC0xIkgwRgIhAOmKFu8e%2F6rPWOQcD%2FhtDaXBFNLiUgCWJBJC2mf6RMmtAiEA9Y3YLOpq%2B0HYfIPOgAaGhsPW1rbSXUsOa1%2BP%2BKj5eTMq6AMIaRAAGgw3MjQ3NzIwNTIxMTciDFDm7PZwgFM34pcncyrFA8n4VQ8ldJ%2FcC2P%2FK%2BiHTSo8r7xjU%2BlwzJdz9pDykX0GbzW8mGT3ywciF8pllmr5GogAH1ntgAQeXSIZ3ABuIQ2axNkvf6afrfbBqcks%2F8pduSKxxcQwVr6qXwdz%2Fa5PHFo9g28f%2B6sI4j3b%2BQ5qVpUIQMO4dVgDxIfPwm6rYRTto0OzrPLSqykL3%2Bn6RIdoq1jMoipHtUdj8iPSHryDPCrf%2FeiukmSFj%2FZJbKWvWY8VT4FoL3A7QWcwOvK5pwLuEAnMsNY7tXRsxacr3HJ89JmMs603nrds1ZHko4jGl0SpCdHeXAJw%2FB3vf1mlSAtjViltDeP2tL01PE0XhRS2YYdimhE0EKZoYp96aFTXC6jB0obh7K8VxHX4jXS%2BjgXtZuEnuxMLK9bZ5h0CXPEHDWFOmNqgci7hVdZGLwc4R9637KmT4%2BUOjquXkk381HSosg4QL%2B34d8jcAbjYdn7YuMjD%2FSnZ6kEHxd3j8cnmhVs4yQeinO6WjkZGcOM4RFyJUPrLqzHxIb%2F4OWfbenceowxlFSyK3J0P4hb9tEGAPJVN66RWx69k%2B%2FPAujr%2FGtYTnx0pDLzZMs%2Bxtnmj6SL1dr0MnUFdcjCIipW9BjrjAlBnt8eVvo95XLKU3iAY5qlzaURbERWf4dZuBii1p3hNvoDLFi5sOMCGoCd41l09j177d7NpDG0crDFli5PoDMMV6bu9Gu38sdPkxgsPp9iNBf7wWq%2BWh5%2BmIE4tF6Aqo35RIlcJYB6vxHvH821eDQbGZVK3Hyh58o3%2FH9xDEYApljTyWoLF0tYaKn9K50V6lGwKHSTf3us9yO%2Fl6YZJnaT2pzZ8omNYV%2BBn7oqPJgjEOsF3An4FbWtBy%2FV26wan%2BkGr5iL7cZPUUfAKo%2B9%2Bqdh3tP7DwOt3vHDqvcXtrfkypmfNCJBPI%2BRVrDYdwsM2QPT7xpTsKtFHaSKaEhZQdc6DGuWurRFmjQdfPqjL%2FzltTMA6rLj8XjIa2gU01wkohCJdmX55kHyD%2Fce4j59AC3z0667Y2Q5FICE9ZWKwrhKNw4p4jJyyVwq9kCKqq6qtJUPXzonCxcKSwNB%2BZaaSX6X4m3k%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA2RP6H3SKR2SHXXWG%2F20250206%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250206T232620Z&X-Amz-Expires=43200&X-Amz-SignedHeaders=host&X-Amz-Signature=6cccd05fd5f2e775b6875cd18f024638625270cb57aadfd6b0740ed6add4e07e";
const model = loadModel(modelUrl, scene, camera);
// scene.add(model);
console.log("Model loaded successfully:", model);

// カメラの操作設定
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// 🌟 マウスの座標
const mouse = new THREE.Vector2();

// 🌟 マウスイベントの追加（mousemove でボックスを動かす）
renderer.domElement.addEventListener("mousemove", (event) => {
  // 📌 マウス座標を正規化（-1 ～ 1）
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  console.log("mousemove イベント発火！", `Mouse: (${mouse.x}, ${mouse.y})`);

  // 🎯 マウスの座標を `box` に適用
  box.position.x = mouse.x * 5; // 左右の移動
  box.position.y = mouse.y * 5; // 上下の移動
});

// レンダリングループ
function animate() {
  requestAnimationFrame(animate);
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  // controls.update();
  renderer.render(scene, camera);
}

animate();
