import * as THREE from 'three';
import { EffectComposer } from '../materials/postProcess01/EffectComposer';
import { ShaderPass } from '../materials/postProcess01/ShaderPass';
import { TexturePass } from '../materials/postProcess01/TexturePass'; // eslint-disable-line
import { ClearPass } from '../materials/postProcess01/ClearPass';
import { MaskPass, ClearMaskPass } from '../materials/postProcess01/MaskPass'; // eslint-disable-line
import { CopyShader } from '../materials/postProcess01/CopyShader';
import panda from '../materials/masking/texture01.png'


class NoiseSphere { //eslint-disable-line
  constructor(x, y, z) { //eslint-disable-line
    this.geometry = new THREE.BoxBufferGeometry( 2, 2, 2, 2, 2, 2 )
    this.material = new THREE.MeshBasicMaterial()
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.x = (Math.random() * 2 - 1) * 20
    this.mesh.position.y = (Math.random() * 2 - 1) * 20
    this.mesh.position.z = (Math.random() * 2 - 1) * 20 - 20

    this.rotationValueX = Math.random() * 0.01
    this.rotationValueY = Math.random() * 0.01
    this.rotationValueZ = Math.random() * 0.01

    this.positionValueX = Math.random() * 0.09
    this.positionValueY = Math.random() * 0.09
    this.positionValueZ = Math.random() * 0.09
  }
  draw( time ) {
    this.mesh.rotation.x += this.rotationValueX
    this.mesh.rotation.y += this.rotationValueY
    this.mesh.rotation.z += this.rotationValueZ

    this.mesh.position.x += Math.sin( this.positionValueX + time + (this.positionValueX * 2) ) * this.positionValueX
    this.mesh.position.y += Math.sin( this.positionValueY + time + (this.positionValueY * 2)) * this.positionValueY
    this.mesh.position.z += Math.sin( this.positionValueZ + time + (this.positionValueZ * 2)) * this.positionValueZ
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
    this.mouse = new THREE.Vector2(0, 0)
    var scene1 = new THREE.Scene();
    // var scene2 = new THREE.Scene();
    // this.noiseSphere = new NoiseSphere(0, 0, 0)
    this.noiseSphere = []
    for( let i = 0; i < 100; i++ ) {
      this.noiseSphere[i] = new NoiseSphere()
      scene1.add( this.noiseSphere[i].mesh );
    }

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
    // var maskPass2 = new MaskPass( scene2, this.camera );
    var texture1 = new THREE.TextureLoader().load( panda );
    texture1.minFilter = THREE.LinearFilter;
    // var texture2 = new THREE.TextureLoader().load( panda );
    var texturePass1 = new TexturePass( texture1 );
    // var texturePass2 = new TexturePass( texture2 );
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
    // this.composer.addPass( maskPass2 );
    // this.composer.addPass( texturePass2 );
    // this.composer.addPass( clearMaskPass );
    this.composer.addPass( outputPass );
    window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
    window.addEventListener( 'mousemove', e => { this.mouseHandle( e ) }, false)
    this.time = 0
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
    // var time = performance.now() * 0.001;
    // this.noiseSphere.draw()

    // this.noiseSphere.rotation.y += 0.01
    // this.noiseSphere.rotation.x += 0.01
    for ( let j = 0; j < this.noiseSphere.length; j++ ) {
      this.noiseSphere[j].draw( this.time * this.noiseSphere[j].rotationValueX )
    }

    this.time += 0.01

    this.renderer.clear();
    this.composer.render( );
  }

  mouseHandle( e ) {
    this.mouse.x = e.clientX
    this.mouse.y = e.clientY
    this.noiseSphere.rotation.x += 0.01
    this.noiseSphere.rotation.y += 0.01
    // console.log(this.mouse)
  }



}
