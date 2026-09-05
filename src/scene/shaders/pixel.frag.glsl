uniform sampler2D uMap;
uniform bool uHasMap;
uniform vec2 uPixelSize;
uniform vec3 uVoid;
varying vec2 vUv;

void main() {
  if (uHasMap) {
    vec4 c = texture2D(uMap, vUv);
    if (c.a < 0.5) discard;
    gl_FragColor = c;
  } else {
    vec2 cell = floor(vUv * uPixelSize / 8.0);
    float k = mod(cell.x + cell.y, 2.0);
    vec3 cyan = vec3(0.0, 1.0, 1.0);
    gl_FragColor = vec4(mix(uVoid * 2.0, cyan, k), 1.0);
  }
  #include <colorspace_fragment>
}
