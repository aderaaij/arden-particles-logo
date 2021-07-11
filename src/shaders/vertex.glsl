#ifndef HALF_PI
#define HALF_PI 1.5707963267948966
#endif

attribute float random;
uniform float uTime;

void main() {
  float timeLarge = uTime * 100.0;  
  vec3 newPosition = vec3(
    position.x, 
    (position.y - inversesqrt(timeLarge - 
    (random * 500.0)) * 700.0 + 
    (inversesqrt(uTime) * 65.0) +
    (inversesqrt(uTime) * 10.0)),
    position.z
  );
  gl_PointSize = 1.8; 
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

}