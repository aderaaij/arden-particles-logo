import * as THREE from 'three';
import './style.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
/**
 * Basics
 */
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

let logoGeometry;
let particlesMaterial;
let particles;
let mouseX = 0,
  mouseY = 0;

const loader = new GLTFLoader();

/**
 * @param {*} url
 * https://discourse.threejs.org/t/most-simple-way-to-wait-loading-in-gltf-loader/13896
 */
function modelLoader(url) {
  return new Promise((resolve, reject) => {
    loader.load(url, (data) => resolve(data), null, reject);
  });
}

const init = async () => {
  const sceneData = await modelLoader('/arden-logo.glb');
  logoGeometry = sceneData.scene.children[0].geometry;

  particlesMaterial = new THREE.ShaderMaterial({
    vertexColors: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    fog: true,
    uniforms: {
      uTime: { value: 1 },
      screenWidth: { value: sizes.width },
      screenHeight: { value: sizes.height }
    }
  });

  let random = new Float32Array(logoGeometry.attributes.position.count);
  for (let i = 0; i < random.length; i++) {
    random[i] = Math.random() * 1 + 0.1;
  }
  logoGeometry.setAttribute('random', new THREE.BufferAttribute(random, 1));
  document.addEventListener('click', function () {
    if (particlesMaterial) {
      particlesMaterial.uniforms.uTime.value = 0;
    }
  });

  particles = new THREE.Points(logoGeometry, particlesMaterial);
  particles.rotateX(Math.PI / 2);
  scene.add(particles);
};

init();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - sizes.width * 0.5) * 0.5;
  mouseY = (event.clientY - sizes.height * 0.5) * 0.5;
});

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 2000);
camera.position.set(0, 1, 10);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#000000');

const render = () => {
  camera.position.x += (mouseX * 0.01 - camera.position.x) * 0.1;
  camera.position.y += (-(mouseY * 0.01) - camera.position.y) * 0.1;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
};

const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElapsedTime;
  lastElapsedTime = elapsedTime;

  if (particlesMaterial) {
    particlesMaterial.uniforms.uTime.value += 1.0;
  }

  render();
  window.requestAnimationFrame(tick);
};

tick();
