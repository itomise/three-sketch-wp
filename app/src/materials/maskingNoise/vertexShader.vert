uniform float u_time;

void main() {
  vec3 newPos = position;
  newPos.x = sin(position.y + u_time) * 0.3;
  newPos.y = cos(position.x + u_time * 0.9) * 0.3;

  gl_Position = projectMatrix * modelViewMatrix * vec4( newPos, 1.0);
}
