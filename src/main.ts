import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
const videoGeometry = new THREE.PlaneGeometry(16, 9);
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
videoMesh.scale.set(6, 10, 1);
videoMesh.position.z = -10;
scene.add(videoMesh);

// 3Dオブジェクト（ボックス）の作成
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(0, 0, 0);
box.scale.set(2, 2, 2);
scene.add(box);

// モデルの読み込み処理
const loadModel = (url: string): void => {
  const cleanUrl: string = url.split("?")[0];
  const fileExtension: string = cleanUrl.split(".").pop()?.toLowerCase() || "";

  let loader: GLTFLoader | FBXLoader;

  if (fileExtension === "glb" || fileExtension === "gltf") {
    loader = new GLTFLoader();
  } else if (fileExtension === "fbx") {
    loader = new FBXLoader();
  } else {
    console.error("Unsupported file format:", fileExtension);
    return;
  }

  loader.load(
    url,
    (loadedModel: GLTF | THREE.Group) => {
      let model: THREE.Object3D;

      if (fileExtension === "glb" || fileExtension === "gltf") {
        // GLTF の場合は `.scene` プロパティを取得
        model = (loadedModel as GLTF).scene;
      } else {
        // FBX の場合はそのまま `THREE.Group` として扱う
        model = loadedModel as THREE.Group;
      }

      if (!model) {
        console.error("Model is undefined or null after loading.");
        return;
      }

      console.log("Model loaded successfully:", model);
      adjustModelScale(model);
      animate();
    },
    (xhr: ProgressEvent<EventTarget>) => {
      if (xhr.total) {
        console.log(`Loading progress: ${(xhr.loaded / xhr.total) * 100}%`);
      } else {
        console.log(`Loading progress: ${xhr.loaded} bytes loaded`);
      }
    },
    (error) => {
      console.error("An error occurred while loading the model:", error);
    }
  );
};

const adjustModelScale = (model: THREE.Object3D): void => {
  const targetHeight: number = 10;
  const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(model);
  const size: THREE.Vector3 = new THREE.Vector3();
  boundingBox.getSize(size);

  const height: number = size.y;
  const scale: number = height > 0 ? targetHeight / height : 1;

  model.scale.set(scale, scale, scale);
  scene.add(model);

  camera.position.set(0, targetHeight / 2, targetHeight * 2);
  camera.lookAt(0, targetHeight / 2, 0);
};

// モデルのURL
const modelUrl =
  "https://saito-debug.s3.ap-northeast-1.amazonaws.com/FS_1.glb?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjED8aDmFwLW5vcnRoZWFzdC0xIkcwRQIgfOYt9MY3SK24MoHp57%2FdJ4aV4XeU3Lr1gonjb7adudsCIQCOUoEhvos6FCHC%2B1Q%2Bb2bWuXJKRVy7%2FByBZNH%2BE0mdQyroAwhZEAAaDDcyNDc3MjA1MjExNyIMysqhH1eDTFTHZkGEKsUDfiKN7pOcqrveyrKOmKfoXvFLOcA0k9fORIau1jCJseGxSLjAmvfewlJMgj7BRBqwe%2FWdvX3PXSh0M26cFMUWvz4LjlY7K%2FMnNlWCWHKfpsEutQFjkwmy6MDlTFcTW9q9BdWzpwMXaLWyTYSMw9YcPY2Nej%2Bgt%2BlICTr5gT%2FkRcyBKtRKGq8OvHyPR2apy1%2BKeu%2BTsiOz%2BQTpYvM9owVJOC9PFCeK6uxT%2BwqvcSMCogIajL8V0TnQgD5u%2FxEB%2BoPcBXMMZaof3l6D9wX7iIx3ycEWv5%2BnFDwMVwZEJj8DaFTH%2Fe8EnB9qOPSI8%2FUeJRm7LzdLRSe5sxUGUtNBDyHFXkmqnqgbGb4dWKOpVxdCsIT8SYCD2Mspfpu5A1V4qEEwbk4hQD0YnD7oidoOapsNYVy7G5h9lrKkOJpnGh%2B2mETcycTYNfhUjfiB426op6Epiph9zRBgWjOuMr5LQ4pjmCfbLbtXkqyzYlbV32C61vL650Bwl9aLNJrbfkGIxtyHXSfkhID0KVATjfssqOAzmttQEKEQxt%2FrXWVwe1PxUyqF0J0k6%2BlRQCcGjgjLvxI4rCpkyH9twcF1k1%2F7KGpPdpJjCXgkMIvIkb0GOuQCpmAIJKgqCYyuWqoV3LMCAbz2SDpvqbMqAuD6XmujbQg1%2Ff4vJ3db4FqMpQob3VHCyV%2BBv3O6GHfi35JGjSwLVcdQwF%2FPFdTs7Hg8aUBkpfIp0V9Ac3MLHlEq7%2BE4EmKDizrJYTxFbOHjCX8yx9RqM0EZDePgaizwqxmz578oq6HCHPonnkScyZW9NWSTWsdXHU2HjLndITPdS6XNs4IVJaGY%2BIUwbGpsnh2rp4I8rTVB32LT6%2F9%2BdWups5ObhWPatZUMKHPInjhZ1ydXzWDJAl%2BnLKZDQi9bnYZim4kmMXgDi7TGKwPlgXtm3kR2U%2F0BalNQzb%2F1aP4FfcuV7V7BNqNXr8ya1z2YCXoQo5UNsyUoE7VLi1LpS8fahrYyxokHxbsI%2By5aoKPPoU%2FGkyZj%2FYx7R2LB%2BOqdydyZYhfRiRSlhRm5zob0x6OtUGDV%2F4vcSsrnGLiOLOnceZyMkHWJIeVknZE%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA2RP6H3SK23P57CA7%2F20250206%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250206T072631Z&X-Amz-Expires=10800&X-Amz-SignedHeaders=host&X-Amz-Signature=b257541ad41a94e0f37c4aad5b61aa727b51c01ef1bc4f538a72aaacd3906030";

// モデルを読み込む
loadModel(modelUrl);

// カメラの操作設定
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ウィンドウリサイズ時の処理
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// レンダリングループ
function animate() {
  requestAnimationFrame(animate);
  box.rotation.x += 0.01;
  box.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();
