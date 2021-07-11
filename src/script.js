import ready from 'domready';
import ParticlesLogo from './ParticlesLogo';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
ready(() => {
  new ParticlesLogo({
    element: document.querySelector('.webgl'),
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
});
