import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

// モデルの読み込み処理
export const loadModel = (url: string, scene: THREE.Scene): THREE.Object3D => {
  const cleanUrl: string = url.split("?")[0];
  const fileExtension: string = cleanUrl.split(".").pop()?.toLowerCase() || "";

  let loader: GLTFLoader | FBXLoader;
  let model: THREE.Object3D;
  model = new THREE.Object3D();

  if (fileExtension === "glb" || fileExtension === "gltf") {
    loader = new GLTFLoader();
  } else if (fileExtension === "fbx") {
    loader = new FBXLoader();
  } else {
    console.error("Unsupported file format:", fileExtension);
    return model;
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

      // const adjustModel = adjustModelScale(model, camera);
      scene.add(model);
      // console.log("Model loaded successfully:", adjustModel);
      return model;
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
  return model;
};

// 3Dモデルのサイズ調整
// const adjustModelScale = (
//   model: THREE.Object3D,
//   camera: THREE.PerspectiveCamera
// ): THREE.Object3D => {
//   const targetHeight: number = 10;
//   const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(model);
//   const size: THREE.Vector3 = new THREE.Vector3();
//   boundingBox.getSize(size);

//   const height: number = size.y;
//   const scale: number = height > 0 ? targetHeight / height : 1;

//   model.scale.set(scale, scale, scale);

//   camera.position.set(0, targetHeight / 2, targetHeight * 2);
//   camera.lookAt(0, targetHeight / 2, 0);
//   return model;
// };

// 3Dオブジェクト（ボックス）の作成
export const createBox = () => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(0, 0, 0);
  box.scale.set(2, 2, 2);
  return box;
};
