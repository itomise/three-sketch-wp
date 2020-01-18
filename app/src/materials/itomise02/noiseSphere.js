import * as THREE from 'three'
import vertexShader from './vertexShader.vert'
import fragmentShader from './fragmentShader.frag'

export class NoiseSphere {

  constructor(x, y, z) {
    this.geometry = new THREE.SphereGeometry(80, 100, 100);
    this.uniforms = {
      time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight) },
      u_mouse: { type: 'v2', value: new THREE.Vector2() },
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      //blending: THREE.AdditiveBlending,
      blending: THREE.NormalBlending,
      transparent: false,
      depthWrite: true,
      side: THREE.DoubleSide
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.x = -89; // 左よりになるように x を移動
    this.mesh.position.y = y;
    this.mesh.position.z = z;
    this.mesh.rotation.y = 1.5; // material のつなぎ目が見えないように回転させる
  }

  draw() {
    this.uniforms.time.value += 0.1;
  }
}
