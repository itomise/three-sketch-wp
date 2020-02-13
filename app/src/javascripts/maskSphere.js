import * as THREE from 'three'
import { Utils } from './utils'
import vertexShader from '../materials/maskSphere/vertexShader.vert'
import fragmentShader from '../materials/maskSphere/fragmentShader.frag'

/**
 *
 * まずポストプロセッシングを勉強しないと
 * これがなんでだめなのか
 *
 *
 */

let _renderer = undefined

let _mainScene = undefined;
let _mainCamera = undefined;

let _maskScene = undefined;
let _maskTg = undefined;

let _baseScene = undefined;
let _baseTg = undefined;

let _maskMesh = undefined;
let _baseMesh = [];

let _dest = undefined;

// 背景色
let _bgColor = 0x131521;


// 初期設定
document.addEventListener('DOMContentLoaded', () => {

  init()

  // 毎フレーム実行
  window.requestAnimationFrame(update)

})

const init = () => {

  const sw = window.innerWidth
  const sh = window.innerHeight

  // レンダラー
  _renderer = new THREE.WebGLRenderer()
  // _renderer.autoClear = true
  const container = document.getElementById('js-container')
  container.appendChild(_renderer.domElement)

  // メインシーン
  _mainScene = new THREE.Scene()

  // メインカメラ
  _mainCamera = new THREE.PerspectiveCamera(80, 1, 0.1, 50000)

  // マスク用のシーン作成
  setupMask()

  // ベースとなるシーン作成
  setupBase()

  // 描画部分
  _dest = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1),
    new THREE.ShaderMaterial({
      vertexShader:vertexShader,
      fragmentShader:fragmentShader,
      transparent:true,
      uniforms:{
        tDiffuse:{value:_baseTg.texture},
        tMask:{value:_maskTg.texture}
      }
    })
  );
  _mainScene.add(_dest);

  update();
}




const update = () => {

  var sw = window.innerWidth;
  var sh = window.innerHeight;

  // カメラ設定
  // ピクセル等倍になるように
  _mainCamera.aspect = sw / sh;
  _mainCamera.updateProjectionMatrix()
  _mainCamera.position.z = sh / Math.tan(_mainCamera.fov * Math.PI / 360) / 2;

  // レンダラーの設定
  _renderer.setPixelRatio(window.devicePixelRatio || 1);
  _renderer.setSize(sw, sh);


  // マスクとなるシーンのアニメーション
  var maskSize = sw * 0.3;
  _maskMesh.scale.set(maskSize, maskSize, maskSize);
  _maskMesh.rotation.x += 0.005;
  _maskMesh.rotation.y -= 0.006;
  _maskMesh.rotation.z += 0.011;

  // マスク用シーンのレンダリング
  _renderer.setClearColor(_bgColor, 0);
  _maskTg.setSize(sw * window.devicePixelRatio, sh * window.devicePixelRatio);
  _renderer.setRenderTarget(_maskTg, true);
  _renderer.render(_maskScene, _mainCamera, _maskTg);


  // ベースとなるシーンのアニメーション
  for(var i = 0; i < _baseMesh.length; i++) {
    var o = _baseMesh[i];
    var m = o.mesh;
    var scaleNoise = o.scaleNoise;
    var posXNoise = o.posXNoise;
    var posYNoise = o.posYNoise;
    var speedNoise = o.speedNoise;

    // くるくる
    m.rotation.x += 0.005 * speedNoise;
    m.rotation.y -= 0.006 * speedNoise;
    m.rotation.z += 0.011 * speedNoise;

    // 位置とサイズ
    var bs = Math.min(sw, sh)
    m.scale.set(bs * scaleNoise, bs * scaleNoise, bs * scaleNoise);
    m.position.set(sw * posXNoise, sh * posYNoise, 0);
  }


  // ベースとなるシーンのレンダリング
  _renderer.setClearColor(_bgColor, 0);
  _baseTg.setSize(sw * window.devicePixelRatio, sh * window.devicePixelRatio);
  _renderer.setRenderTarget(_baseTg, true);
  _renderer.render(_baseScene, _mainCamera, _baseTg);

  // 出力用メッシュを画面サイズに
  _dest.scale.set(sw, sh, 1);

  // レンダリング
  _renderer.setClearColor(_bgColor, 1);
  _renderer.render(_mainScene, _mainCamera);

  window.requestAnimationFrame(update);
}



// マスク用のシーン作成
const setupMask = () => {

  // マスクシーン
  _maskScene = new THREE.Scene();

  // ↑のレンダリング先
  _maskTg = new THREE.WebGLRenderTarget(16, 16);

  //
  _maskMesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
      color:0xff0000
    })
  );
  _maskScene.add(_maskMesh);

}



// ベースとなるシーン作成
const setupBase = () => {

  const sw = window.innerWidth;
  const sh = window.innerHeight;

  // ベースとなるシーン
  _baseScene = new THREE.Scene();

  // ↑のレンダリング先
  // _baseTg = new THREE.WebGLRenderTarget(16, 16);

  for(var i = 0; i < 50; i++) {

    // この２つのカラーの間
    var colorA = new THREE.Color(0xe84932);
    var colorB = new THREE.Color(0x0a1d6d);

    var mesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color:colorA.lerp(colorB, Utils.random(0, 1)),
        wireframe:Utils.hit(2) // 確率でワイヤー表示
      })
    );
    _baseScene.add(mesh);

    _baseMesh.push({
      mesh:mesh,
      scaleNoise:Utils.random(0.1, 0.2),
      posXNoise:Utils.range(0.6),
      posYNoise:Utils.range(0.6),
      speedNoise:Utils.range(0.6) * 2
    });

  }

}
