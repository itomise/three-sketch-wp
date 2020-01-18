import * as THREE from 'three';
import { EffectComposer } from '../materials/postProcess01/EffectComposer';
import { ShaderPass } from '../materials/postProcess01/ShaderPass';
import { TexturePass } from '../materials/postProcess01/TexturePass'; // eslint-disable-line
import { ClearPass } from '../materials/postProcess01/ClearPass';
import { MaskPass, ClearMaskPass } from '../materials/postProcess01/MaskPass'; // eslint-disable-line
import { CopyShader } from '../materials/postProcess01/CopyShader';
import panda from '../materials/masking/panda.png'
import vertexShader from '../materials/yurayuraShader/vertexShader.vert'
import fragmentShader from '../materials/yurayuraShader/fragmentShader.frag'


class NoiseSphere { //eslint-disable-line
  constructor(x, y, z) { //eslint-disable-line
    this.geometry = new THREE.SphereBufferGeometry( 3.5, 60, 60 )
    this.uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new THREE.Vector2() },
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
    // this.material = new THREE.MeshBasicMaterial()
    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }
  draw() {
    this.uniforms.u_time.value += 0.2;
    console.log('a')
  }
}


window.addEventListener('load', () => {

  const init = new initial()

  init.animate()
})

class initial {
  constructor() {
    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.position.z = 10;
    var scene1 = new THREE.Scene();
    var scene2 = new THREE.Scene();
    // this.noiseSphere = new NoiseSphere(0, 0, 0)
    this.noiseSphere = new NoiseSphere(0, 0, 0)
    scene1.add( this.noiseSphere.mesh );
    // var torus = new THREE.Mesh( new THREE.TorusBufferGeometry( 3, 1, 16, 32 ) );
    // scene2.add( torus );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor( 0xe0e0e0 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.autoClear = false;
    document.body.appendChild( this.renderer.domElement );
    //
    var clearPass = new ClearPass();
    var clearMaskPass = new ClearMaskPass();
    var maskPass1 = new MaskPass( scene1, this.camera );
    var maskPass2 = new MaskPass( scene2, this.camera );
    var texture1 = new THREE.TextureLoader().load( panda );
    texture1.minFilter = THREE.LinearFilter;
    var texture2 = new THREE.TextureLoader().load( panda );
    var texturePass1 = new TexturePass( texture1 );
    var texturePass2 = new TexturePass( texture2 );
    var outputPass = new ShaderPass( CopyShader );
    var parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBFormat,
      stencilBuffer: true
    };
    var renderTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, parameters );
    this.composer = new EffectComposer( this.renderer, renderTarget );
    this.composer.addPass( clearPass );
    this.composer.addPass( maskPass1 );
    this.composer.addPass( texturePass1 );
    this.composer.addPass( clearMaskPass );
    this.composer.addPass( maskPass2 );
    this.composer.addPass( texturePass2 );
    this.composer.addPass( clearMaskPass );
    this.composer.addPass( outputPass );
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
  }
  onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( width, height );
    this.composer.setSize( width, height );
  }
  animate() {
    requestAnimationFrame( this.animate.bind(this) );
    var time = performance.now() * 0.001;
    // this.noiseSphere.draw()

    this.renderer.clear();
    this.composer.render( time );
  }

}
