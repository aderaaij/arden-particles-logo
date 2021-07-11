uniform float screenWidth;
uniform float screenHeight;
uniform vec2 uMouse;
void main() {
  vec2 screen = vec2(screenWidth, screenHeight);
  vec2 st = gl_FragCoord.xy / screen.xy;
  float R = sin( uMouse.x / screenWidth) + 1.0 - st.x;
  float G = sin( uMouse.y / screenHeight) + st.y; 
  vec2 color = vec2(R, G);  
  gl_FragColor = vec4(1.0, color, 1.0);
}
