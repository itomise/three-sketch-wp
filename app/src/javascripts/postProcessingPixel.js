import * as THREE from 'three';

import { GUI } from 'dat.gui';

import { TrackballControls } from '../materials/postProcess01/TrackballControls';
import { EffectComposer } from '../materials/postProcess01/EffectComposer';
import { RenderPass } from '../materials/postProcess01/RenderPass';
import { ShaderPass } from '../materials/postProcess01/ShaderPass';
import { PixelShader } from '../materials/postProcess01/PixelShader';


var camera, scene, renderer, gui, composer, controls;
var pixelPass, params;

var group;

init();
animate();

function updateGUI() {

  pixelPass.uniforms[ "pixelSize" ].value = params.pixelSize;

}

function resize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

  pixelPass.uniforms[ "resolution" ].value.set( window.innerWidth, window.innerHeight ).multiplyScalar( window.devicePixelRatio );

}

function init() {

  var container = document.getElementById( 'js-container' );
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 0, 0, 30 );
  controls = new TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 2.0;
  controls.panSpeed = 0.8;
  controls.zoomSpeed = 1.5;

  scene = new THREE.Scene();

  var hemisphereLight = new THREE.HemisphereLight( 0xfceafc, 0x000000, .8 );
  scene.add( hemisphereLight );

  var dirLight = new THREE.DirectionalLight( 0xffffff, .5 );
  dirLight.position.set( 150, 75, 150 );
  scene.add( dirLight );

  var dirLight2 = new THREE.DirectionalLight( 0xffffff, .2 );
  dirLight2.position.set( - 150, 75, - 150 );
  scene.add( dirLight2 );

  var dirLight3 = new THREE.DirectionalLight( 0xffffff, .1 );
  dirLight3.position.set( 0, 125, 0 );
  scene.add( dirLight3 );

  var geometries = [
    new THREE.SphereBufferGeometry( 1, 64, 64 ),
    // new THREE.BoxBufferGeometry( 1, 1, 1 ),
    // new THREE.ConeBufferGeometry( 1, 1, 32 ),
    // new THREE.TetrahedronBufferGeometry( 1 ),
    // new THREE.TorusKnotBufferGeometry( 1, .4 )
  ];

  group = new THREE.Group();

  for ( var i = 0; i < 1; i ++ ) {

    var geom = geometries[ Math.floor( Math.random() * geometries.length ) ];
    var color = new THREE.Color();
    color.setHSL( Math.random(), .7 + .2 * Math.random(), .5 + .1 * Math.random() );
    var mat = new THREE.MeshPhongMaterial( { color: color, shininess: 200 } );
    var mesh = new THREE.Mesh( geom, mat );
    var s = 4 + Math.random() * 10;
    mesh.scale.set( s, s, s );

    mesh.position.set(0 ,0, 0 )
    mesh.position.multiplyScalar( Math.random() * 200 );
    mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
    group.add( mesh );

  }

  scene.add( group );

  composer = new EffectComposer( renderer );
  composer.addPass( new RenderPass( scene, camera ) );

  pixelPass = new ShaderPass( PixelShader );
  pixelPass.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
  pixelPass.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio );
  composer.addPass( pixelPass );

  window.addEventListener( 'resize', resize );

  params = {
    pixelSize: 16,
    postprocessing: true
  };
  gui = new GUI();
  gui.add( params, 'pixelSize' ).min( 2 ).max( 32 ).step( 2 );
  gui.add( params, 'postprocessing' );

}

function update() {

  controls.update();
  updateGUI();

  group.rotation.y += .0015;
  group.rotation.z += .001;

}

function animate() {

  update();

  if ( params.postprocessing ) {

    composer.render();



  } else {

    renderer.render( scene, camera );

  }

  window.requestAnimationFrame( animate );

}
