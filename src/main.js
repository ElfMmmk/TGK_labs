import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Освещение
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

// Текстура
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('https://threejs.org/examples/textures/uv_grid_opengl.jpg');

// Плоскость (BufferGeometry)
const planeGeometry = new THREE.BufferGeometry();
const planeVertices = new Float32Array([
  -5, 0, -5,
   5, 0, -5,
   5, 0,  5,
  -5, 0, -5,
   5, 0,  5,
  -5, 0,  5
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
scene.add(plane);

// Пирамида (BufferGeometry)
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
scene.add(pyramid);

// Куб с текстурой
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xff6b6b,
  map: texture
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(2, 0.5, 0);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Сфера
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffe66d });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 1, 2);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// Тор
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x9b59b6 });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0.5, -2);
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

// UI
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

// Анимация
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