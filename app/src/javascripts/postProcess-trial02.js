/**
 * three js 公式 example
 * post processing 01
 */

import * as THREE from 'three'
import { DotScreenShader } from '../materials/postProcess01/DotScreenShader'
import { RGBShiftShader } from '../materials/postProcess01/RGBShiftShader'

import { RenderPass } from '../materials/postProcess01/RenderPass'
import { ShaderPass } from '../materials/postProcess01/ShaderPass'
import { EffectComposer } from '../materials/postProcess01/EffectComposer'

// カメラ、シーン等の宣言
var camera, scene, renderer, composer;
var object, light;

document.addEventListener('DOMContentLoaded', () => {
  init();
  requestAnimationFrame(animate)
})


const init = () => {
  // レンダラーの初期化
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x2F4858, 0.9 )
  document.body.appendChild( renderer.domElement );

  // カメラの初期化
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400;

  // シーンの初期化
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0x86BBD8, 1, 1000 );

  // オブジェクトの追加
  object = new THREE.Object3D();
  scene.add( object );

  // メッシュの追加
  //
  var geometry = new THREE.BoxBufferGeometry( 1, 1, 0, 10, 10, 10 );
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
  for ( var i = 0; i < 100; i ++ ) {
    var mesh = new THREE.Mesh( geometry, material );
    // ランダムのポジションのセット
    mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize();
    // 全体のスケールを拡大している
    // コメントアウトでオブジェクトが全て中心に集まる
    mesh.position.multiplyScalar( Math.random() * 400 );
    // 初期の回転の状態を設定
    mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 );
    // メッシュの大きさを設定
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
    object.add( mesh );
  }

  // ライトの追加
  scene.add( new THREE.AmbientLight( 0x222222 ) );
  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );

  // ポストプロセッシング
  composer = new EffectComposer( renderer );
  composer.addPass( new RenderPass( scene, camera ) );
  var effect = new ShaderPass( DotScreenShader );
  effect.uniforms[ 'scale' ].value = 7
  // composer.addPass( effect );
  var effect1 = new ShaderPass( RGBShiftShader );
  effect1.uniforms[ 'amount' ].value = 0.01;
  // composer.addPass( effect1 );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  composer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
  requestAnimationFrame( animate );
  object.rotation.x += 0.008;
  object.rotation.y += 0.01;
  object.rotation.z += 0.01
  // console.log(composer.passes[1].uniforms.scale)
  // composer.passes[1].uniforms.scale = composer.passes[1].uniforms.scale + 0
  composer.render();
}
