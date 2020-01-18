uniform sampler2D tDiffuse;
uniform float time;

varying vec2 vUv;

void main() {

  // vUvは取得するテクスチャ座標のこと
  // こいつをずらすことでゆらゆらさせる
  vec2 zure = vec2(sin(vUv.y * 12.0 + time * 0.1) * 0.02, 0.0);

  vec4 dest = texture2D(tDiffuse, vUv + zure);

  gl_FragColor = dest;

}
