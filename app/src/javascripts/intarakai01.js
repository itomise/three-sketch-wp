/**
 * three js 公式 example
 * post processing 01
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { DotScreenShader } from '../materials/postProcess01/DotScreenShader'
import { RGBShiftShader } from '../materials/postProcess01/RGBShiftShader'

import { RenderPass } from '../materials/postProcess01/RenderPass'
import { ShaderPass } from '../materials/postProcess01/ShaderPass'
import { EffectComposer } from '../materials/postProcess01/EffectComposer'

document.addEventListener('DOMContentLoaded', () => {
  init()

})

const init = () => {

  new Main()

}

class Main {

  constructor() {
    this.renderer = undefined
    this.camera = undefined
    this.scene = undefined
    this.object = undefined
    this.light = undefined
    this._init()

    this.composer = undefined
    this.setup()
    this.draw()

    window.addEventListener( 'resize', this.onResize, false )
  }

  _init() {
    // scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog( 0x86BBD8, 1, 1000 )

    // renderer
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    this.renderer.setClearColor( 0x2f4858, 0.9 )
    document.body.appendChild( this.renderer.domElement )

    // camera
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 )
    this.camera.position.z = 400

    // light
    this.scene.add( new THREE.AmbientLight( 0x222222 ) )
    this.light = new THREE.DirectionalLight( 0xffffff )
    this.light.position.set( 1, 1, 1 )

    this.scene.add( this.light )

  }

  setup() {
    // object
    this.object = new THREE.Object3D()
    this.scene.add( this.object )

    // メッシュの追加
    //
    const geometry = new THREE.BoxBufferGeometry( 1, 1, 0, 10, 10, 10 )
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } )
    for ( let i = 0; i < 100; i ++ ) {
      const mesh = new THREE.Mesh( geometry, material )
      // ランダムのポジションのセット
      mesh.position.set( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ).normalize()
      // 全体のスケールを拡大している
      // コメントアウトでオブジェクトが全て中心に集まる
      mesh.position.multiplyScalar( Math.random() * 400 )
      // 初期の回転の状態を設定
      mesh.rotation.set( Math.random() * 2, Math.random() * 2, Math.random() * 2 )
      // メッシュの大きさを設定
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50
      this.object.add( mesh )
    }

    // ポストプロセッシング
    this.composer = new EffectComposer( this.renderer )
    this.composer.addPass( new RenderPass( this.scene, this.camera ) )
    this.effect = new ShaderPass( DotScreenShader )
    this.effect.uniforms[ 'scale' ].value = 0
    this.composer.addPass( this.effect )
    const effect1 = new ShaderPass( RGBShiftShader )
    effect1.uniforms[ 'amount' ].value = 0.01
    this.composer.addPass( effect1 )


  }

  draw() {
    requestAnimationFrame( this.draw.bind(this) )
    // this.object.rotation.x += 0.01
    // console.log(this.effect.uniforms[ 'scale' ].value)
    // this.effect.uniforms[ 'scale' ].value += 0.04
    // const tween = gsap.to( this.effect.uniforms[ 'scale' ], {
    //   duration: 2,
    //   value: 2,

    //   // repeat: -1
    // })

    let tl = new gsap.timeline({
      defaults: {
        duration: 2,
        // ease: "back(1.4)",
        // yoyo: true,
        repeat: -1,
      }
    })
    tl.to(this.effect.uniforms[ 'scale' ],{
      duration: 2,
      value: 1,
    }).to(this.effect.uniforms[ 'scale' ],{
      duration: 2,
      value: -1,
    })
    // tl.play()

    this.composer.render()
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    this.composer.setSize( window.innerWidth, window.innerHeight )
  }

}

