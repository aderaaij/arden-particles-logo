import * as THREE from 'three';
import './style.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { modelLoader } from './utils/modelLoader';

export default class ParticlesLogo {
  constructor(options) {
    this.scene = new THREE.Scene();
    this.container = options.element;

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.container
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor('#000000');

    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.1, 2000);
    this.camera.position.set(0, 1, 10);

    this.loader = new GLTFLoader();

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouse = new THREE.Vector2();
    this.uTime = 0;
    this.fragmentShader = options.fragmentShader;
    this.vertexShader = options.vertexShader;
    this.logoGeometry;
    modelLoader(this.loader, '/arden-logo.glb').then((res) => {
      this.logoGeometry = res.scene.children[0].geometry;
      this.resize();
      this.setupResize();
      this.onMouseMove();
      this.addLogo();

      this.render();
      this.onClick();
    });
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addLogo() {
    this.particlesMaterial = new THREE.ShaderMaterial({
      vertexColors: true,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: {
        uTime: { value: 1 },
        uMouse: { value: this.mouse },
        screenWidth: { value: this.width },
        screenHeight: { value: this.height }
      }
    });
    this.random = new Float32Array(this.logoGeometry.attributes.position.count);
    for (let i = 0; i < this.random.length; i++) {
      this.random[i] = Math.random() * 1 + 0.1;
    }
    this.logoGeometry.setAttribute('random', new THREE.BufferAttribute(this.random, 1));
    this.particles = new THREE.Points(this.logoGeometry, this.particlesMaterial);
    this.particles.rotateX(Math.PI / 2);
    this.scene.add(this.particles);
  }

  onMouseMove() {
    window.addEventListener('mousemove', (event) => {
      this.mouseX = (event.clientX - this.width * 0.5) * 0.5;
      this.mouseY = (event.clientY - this.height * 0.5) * 0.5;
      this.mouse.x = event.pageX;
      this.mouse.y = event.pageY;
    });
  }

  onClick() {
    document.addEventListener('click', () => {
      this.particlesMaterial.uniforms.uTime.value = 0;
    });
  }

  render() {
    this.camera.position.x += (this.mouseX * 0.01 - this.camera.position.x) * 0.1;
    this.camera.position.y += (-(this.mouseY * 0.01) - this.camera.position.y) * 0.1;
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
    this.particlesMaterial.uniforms.uTime.value += 1.0;
    window.requestAnimationFrame(this.render.bind(this));
  }
}
