varying vec2 vUv;
uniform float u_time;
void main() {
  float speed = 0.1;
  vec2 o = vec2(sin(length(vUv) - u_time* speed), cos(length(vUv) - u_time * speed));
  vec2 ux = vUv + vec2(1.5, 4.5);
  vec2 d = vec2(sin(length(ux) - u_time * speed), cos(length(ux) - u_time * speed));
  vec2 uy = vUv + vec2(-1.5, -0.5);
  vec2 l = vec2(sin(length(uy) - u_time * speed), cos(length(uy) - u_time * speed));

  vec2 c = o * d * l + vec2(0.4, 0.8);

  gl_FragColor = vec4(vec3( c, sin(u_time * 0.01) + 0.4  ) * vec3(0.9), 1.0);
}
