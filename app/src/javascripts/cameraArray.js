import * as THREE from 'three';
import { RenderPass } from '../materials/postProcess01/RenderPass' // eslint-disable-line
import { ShaderPass } from '../materials/postProcess01/ShaderPass' // eslint-disable-line
import { EffectComposer } from '../materials/postProcess01/EffectComposer' // eslint-disable-line
import { DotScreenShader } from '../materials/postProcess01/DotScreenShader'// eslint-disable-line
import { RGBShiftShader } from '../materials/postProcess01/RGBShiftShader'// eslint-disable-line


var camera, scene, renderer;
var mesh;
var AMOUNT = 6;
var composer;
init();
animate();
function init() {
  var ASPECT_RATIO = window.innerWidth / window.innerHeight;
  var WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
  var HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;
  var cameras = [];
  for ( var y = 0; y < AMOUNT; y ++ ) {
    for ( var x = 0; x < AMOUNT; x ++ ) {
      var subcamera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 0.1, 10 );
      subcamera.viewport = new THREE.Vector4( Math.floor( x * WIDTH ), Math.floor( y * HEIGHT ), Math.ceil( WIDTH ), Math.ceil( HEIGHT ) );
      subcamera.position.x = ( x / AMOUNT ) - 0.5;
      subcamera.position.y = 0.5 - ( y / AMOUNT );
      subcamera.position.z = 1.5;
      subcamera.position.multiplyScalar( 2 );
      subcamera.lookAt( 0, 0, 0 );
      subcamera.updateMatrixWorld();
      cameras.push( subcamera );
    }
  }
  camera = new THREE.ArrayCamera( cameras );
  camera.position.z = 3;
  scene = new THREE.Scene();
  scene.add( new THREE.AmbientLight( 0x222244 ) );
  var light = new THREE.DirectionalLight();
  light.position.set( 0.5, 0.5, 1 );
  light.castShadow = true;
  light.shadow.camera.zoom = 4; // tighter shadow map
  scene.add( light );
  var geometry = new THREE.PlaneBufferGeometry( 100, 100 );
  var material = new THREE.MeshPhongMaterial( { color: 0x252627 } );
  var background = new THREE.Mesh( geometry, material );
  background.receiveShadow = true;
  background.position.set( 0, 0, - 1 );
  scene.add( background );
  // var geometry1 = new THREE.CylinderBufferGeometry( 0.5, 0.5, 1, 32 );
  var geometry1 = new THREE.SphereBufferGeometry(0.5, 4, 4)
  var material1 = new THREE.MeshPhongMaterial( { color: 0xBB0A21 } );
  mesh = new THREE.Mesh( geometry1, material1 );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  // // ポストプロセッシング
  // composer = new EffectComposer( renderer );
  // composer.addPass( new RenderPass( scene, camera ) );
  // var effect = new ShaderPass( DotScreenShader );
  // effect.uniforms[ 'scale' ].value = 1
  // composer.addPass( effect );
  // var effect1 = new ShaderPass( RGBShiftShader );
  // effect1.uniforms[ 'amount' ].value = 0.016
  // composer.addPass( effect1 );
  //
  document.body.appendChild( renderer.domElement );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
  var ASPECT_RATIO = window.innerWidth / window.innerHeight;
  var WIDTH = ( window.innerWidth / AMOUNT ) * window.devicePixelRatio;
  var HEIGHT = ( window.innerHeight / AMOUNT ) * window.devicePixelRatio;
  camera.aspect = ASPECT_RATIO;
  camera.updateProjectionMatrix();
  for ( var y = 0; y < AMOUNT; y ++ ) {
    for ( var x = 0; x < AMOUNT; x ++ ) {
      var subcamera = camera.cameras[ AMOUNT * y + x ];
      subcamera.viewport.set(
        Math.floor( x * WIDTH ),
        Math.floor( y * HEIGHT ),
        Math.ceil( WIDTH ),
        Math.ceil( HEIGHT ) );
      subcamera.aspect = ASPECT_RATIO;
      subcamera.updateProjectionMatrix();
    }
  }
  renderer.setSize( window.innerWidth, window.innerHeight );
  composer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  mesh.rotation.x += 0.005;
  mesh.rotation.z += 0.01;
  renderer.render( scene, camera );
  // composer.render();
  requestAnimationFrame( animate );
}
