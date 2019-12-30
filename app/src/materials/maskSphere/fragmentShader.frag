uniform sampler2D tDiffuse;
uniform sampler2D tMask;
varying vec2 vUv;
void main() {
  vec4 dest = texture2D(tDiffuse, vUv);
  vec4 mask = texture2D(tMask, vUv);
  dest.a *= mask.a;
  gl_FragColor = dest;
}
