import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const transformControls = new TransformControls(camera, renderer.domElement);
scene.add(transformControls);

transformControls.addEventListener('dragging-changed', (event) => {
  controls.enabled = !event.value;
});

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff9500, 2, 100);
pointLight.position.set(-3, 3, -3);
pointLight.castShadow = true;
scene.add(pointLight);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg');

const planeGeometry = new THREE.BufferGeometry();
const planeVertices = new Float32Array([
  -5, 0, -5,
  5, 0, -5,
  5, 0, 5,
  -5, 0, -5,
  5, 0, 5,
  -5, 0, 5
]);
const planeNormals = new Float32Array([
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0
]);
const planeUVs = new Float32Array([
  0, 0,
  1, 0,
  1, 1,
  0, 0,
  1, 1,
  0, 1
]);
planeGeometry.setAttribute('position', new THREE.BufferAttribute(planeVertices, 3));
planeGeometry.setAttribute('normal', new THREE.BufferAttribute(planeNormals, 3));
planeGeometry.setAttribute('uv', new THREE.BufferAttribute(planeUVs, 2));

const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.castShadow = false;
plane.name = 'Плоскость';
scene.add(plane);

const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x9b59b6 });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0.5, -2);
torus.castShadow = true;
torus.receiveShadow = true;
torus.name = 'Тор';
scene.add(torus);

const pyramidGeometry = new THREE.BufferGeometry();
const pyramidVertices = new Float32Array([
  0, 1, 0,
  -0.5, 0, 0.5,
  0.5, 0, 0.5,

  0, 1, 0,
  0.5, 0, 0.5,
  0.5, 0, -0.5,

  0, 1, 0,
  0.5, 0, -0.5,
  -0.5, 0, -0.5,

  0, 1, 0,
  -0.5, 0, -0.5,
  -0.5, 0, 0.5,

  -0.5, 0, 0.5,
  0.5, 0, 0.5,
  0.5, 0, -0.5,

  -0.5, 0, 0.5,
  0.5, 0, -0.5,
  -0.5, 0, -0.5
]);
pyramidGeometry.setAttribute('position', new THREE.BufferAttribute(pyramidVertices, 3));
pyramidGeometry.computeVertexNormals();

const pyramidMaterial = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 });
const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
pyramid.position.set(-2, 0, 0);
pyramid.castShadow = true;
pyramid.receiveShadow = true;
pyramid.name = 'Пирамида';
scene.add(pyramid);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6b6b,
  map: texture
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(2, 0.5, 0);
cube.castShadow = true;
cube.receiveShadow = true;
cube.name = 'Куб';
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffe66d });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 1, 2);
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.name = 'Сфера';
scene.add(sphere);

const sceneObjects = [plane, pyramid, cube, sphere, torus];
let selectedObject = null;
let loadedModels = [];

function updateObjectSelect() {
  const select = document.getElementById('objectSelect');
  select.innerHTML = '<option value="">-- Выберите объект --</option>';

  [...sceneObjects, ...loadedModels].forEach((obj, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = obj.name || `Объект ${index + 1}`;
    select.appendChild(option);
  });
}

updateObjectSelect();

document.getElementById('objectSelect').addEventListener('change', (e) => {
  const index = parseInt(e.target.value);
  const allObjects = [...sceneObjects, ...loadedModels];

  if (!isNaN(index) && index >= 0 && index < allObjects.length) {
    selectedObject = allObjects[index];
    transformControls.attach(selectedObject);
    document.getElementById('transformControls').style.display = 'block';
    updateTransformInputs();
  } else {
    selectedObject = null;
    transformControls.detach();
    document.getElementById('transformControls').style.display = 'none';
  }
});

function updateTransformInputs() {
  if (!selectedObject) return;

  document.getElementById('posX').value = selectedObject.position.x.toFixed(2);
  document.getElementById('posY').value = selectedObject.position.y.toFixed(2);
  document.getElementById('posZ').value = selectedObject.position.z.toFixed(2);

  document.getElementById('rotX').value = THREE.MathUtils.radToDeg(selectedObject.rotation.x).toFixed(0);
  document.getElementById('rotY').value = THREE.MathUtils.radToDeg(selectedObject.rotation.y).toFixed(0);
  document.getElementById('rotZ').value = THREE.MathUtils.radToDeg(selectedObject.rotation.z).toFixed(0);

  document.getElementById('scaleX').value = selectedObject.scale.x.toFixed(2);
  document.getElementById('scaleY').value = selectedObject.scale.y.toFixed(2);
  document.getElementById('scaleZ').value = selectedObject.scale.z.toFixed(2);
}

['posX', 'posY', 'posZ'].forEach((id, index) => {
  document.getElementById(id).addEventListener('input', (e) => {
    if (selectedObject) {
      const axis = ['x', 'y', 'z'][index];
      selectedObject.position[axis] = parseFloat(e.target.value);
    }
  });
});

['rotX', 'rotY', 'rotZ'].forEach((id, index) => {
  document.getElementById(id).addEventListener('input', (e) => {
    if (selectedObject) {
      const axis = ['x', 'y', 'z'][index];
      selectedObject.rotation[axis] = THREE.MathUtils.degToRad(parseFloat(e.target.value));
    }
  });
});

['scaleX', 'scaleY', 'scaleZ'].forEach((id, index) => {
  document.getElementById(id).addEventListener('input', (e) => {
    if (selectedObject) {
      const axis = ['x', 'y', 'z'][index];
      selectedObject.scale[axis] = parseFloat(e.target.value);
    }
  });
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', (event) => {
  if (transformControls.dragging) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const allObjects = [...sceneObjects, ...loadedModels];
  const intersects = raycaster.intersectObjects(allObjects, true);

  if (intersects.length > 0) {
    let clickedObject = intersects[0].object;
    while (clickedObject.parent && !allObjects.includes(clickedObject)) {
      clickedObject = clickedObject.parent;
    }

    if (allObjects.includes(clickedObject)) {
      selectedObject = clickedObject;
      transformControls.attach(selectedObject);
      document.getElementById('transformControls').style.display = 'block';

      const index = allObjects.indexOf(selectedObject);
      document.getElementById('objectSelect').value = index;
      updateTransformInputs();
    }
  }
});

const objLoader = new OBJLoader();
const gltfLoader = new GLTFLoader();
const fbxLoader = new FBXLoader();

function loadModel(file) {
  const reader = new FileReader();
  const extension = file.name.split('.').pop().toLowerCase();

  reader.onload = (e) => {
    const contents = e.target.result;

    try {
      if (extension === 'obj') {
        const object = objLoader.parse(contents);
        addLoadedModel(object, file.name);
      } else if (extension === 'gltf' || extension === 'glb') {
        gltfLoader.parse(contents, '', (gltf) => {
          addLoadedModel(gltf.scene, file.name);
        });
      } else if (extension === 'fbx') {
        const object = fbxLoader.parse(contents);
        addLoadedModel(object, file.name);
      }
    } catch (error) {
      console.error('Ошибка загрузки модели:', error);
      alert('Не удалось загрузить модель');
    }
  };

  if (extension === 'glb') {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
}

function addLoadedModel(object, name) {
  object.name = name;
  object.position.set(0, 1, 0);

  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  scene.add(object);
  loadedModels.push(object);
  updateObjectSelect();
}

document.getElementById('modelFile').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    loadModel(file);
  }
});

const dropZone = document.getElementById('canvas-container');

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const file = e.dataTransfer.files[0];
  if (file) {
    const extension = file.name.split('.').pop().toLowerCase();
    if (['obj', 'gltf', 'glb', 'fbx'].includes(extension)) {
      loadModel(file);
    } else {
      alert('Поддерживаются только форматы: OBJ, GLTF, GLB, FBX');
    }
  }
});

document.getElementById('dirLightIntensity').addEventListener('input', (e) => {
  const value = parseFloat(e.target.value);
  directionalLight.intensity = value;
  document.getElementById('dirLightIntensityValue').textContent = value.toFixed(1);
});

document.getElementById('pointLightColor').addEventListener('input', (e) => {
  pointLight.color.set(e.target.value);
});

document.getElementById('cubeColor').addEventListener('input', (e) => {
  cube.material.color.setStyle(e.target.value);
});

transformControls.addEventListener('objectChange', () => {
  updateTransformInputs();
});

function animate() {
  requestAnimationFrame(animate);

  pyramid.rotation.y += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  sphere.position.y = 1 + Math.sin(Date.now() * 0.001) * 0.3;
  torus.rotation.x += 0.005;
  torus.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();