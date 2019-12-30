precision mediump float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float variable;

attribute vec3 sPosition;
attribute vec3 pPosition;
attribute vec3 rPosition;
attribute vec3 color;

varying vec3 vColor;

void main() {
  vColor = color;

  vec3 p = mix(pPosition, mix(rPosition, sPosition, variable), variable);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
