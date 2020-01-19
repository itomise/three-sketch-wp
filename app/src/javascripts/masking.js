import * as THREE from 'three';
import { EffectComposer } from '../materials/postProcess01/EffectComposer';
import { ShaderPass } from '../materials/postProcess01/ShaderPass';
import { TexturePass } from '../materials/postProcess01/TexturePass';
import { ClearPass } from '../materials/postProcess01/ClearPass';
import { MaskPass, ClearMaskPass } from '../materials/postProcess01/MaskPass';
import { CopyShader } from '../materials/postProcess01/CopyShader';
import panda from '../materials/masking/panda.jpg'
var camera, composer, renderer;
var box, torus;
init();
animate();
function init() {
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 10;
  var scene1 = new THREE.Scene();
  var scene2 = new THREE.Scene();
  box = new THREE.Mesh( new THREE.BoxBufferGeometry( 4, 4, 4 ) );
  scene1.add( box );
  torus = new THREE.Mesh( new THREE.TorusBufferGeometry( 3, 1, 16, 32 ) );
  scene2.add( torus );
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor( 0xe0e0e0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  document.body.appendChild( renderer.domElement );
  //
  var clearPass = new ClearPass();
  var clearMaskPass = new ClearMaskPass();
  var maskPass1 = new MaskPass( scene1, camera );
  var maskPass2 = new MaskPass( scene2, camera );
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
  composer = new EffectComposer( renderer, renderTarget );
  composer.addPass( clearPass );
  composer.addPass( maskPass1 );
  composer.addPass( texturePass1 );
  composer.addPass( clearMaskPass );
  composer.addPass( maskPass2 );
  composer.addPass( texturePass2 );
  composer.addPass( clearMaskPass );
  composer.addPass( outputPass );
  window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
  composer.setSize( width, height );
}
function animate() {
  requestAnimationFrame( animate );
  var time = performance.now() * 0.001;
  box.position.x = Math.cos( time / 1.5 ) * 2;
  box.position.y = Math.sin( time ) * 2;
  box.rotation.x = time;
  box.rotation.y = time / 2;
  torus.position.x = Math.cos( time ) * 2;
  torus.position.y = Math.sin( time / 1.5 ) * 2;
  torus.rotation.x = time;
  torus.rotation.y = time / 2;
  renderer.clear();
  composer.render( time );
}
