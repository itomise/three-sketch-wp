/**
 * three js 公式 example
 * post processing 01
 */

import * as THREE from 'three'
import { gsap } from 'gsap'
import { intarakai02Shader } from '../materials/intarakai02/Shader'

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
    this.camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 50000 )
    this.camera.position.z = 2
    this.camera.rotateY(90)
    this.camera.lookAt(0,0,0)

    // light
    this.scene.add( new THREE.AmbientLight( 0x222222 ) )
    this.light = new THREE.DirectionalLight( 0xffffff )
    this.light.position.set( 1, 1, 1 )

    this.scene.add( this.light )

  }

  setup() {

    // メッシュの追加
    //
    const geometry = new THREE.SphereBufferGeometry( 1, 50, 50 )
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } )
    this.mesh = new THREE.Mesh( geometry, material )
    this.scene.add( this.mesh )

    // ポストプロセッシング
    this.composer = new EffectComposer( this.renderer )
    this.composer.addPass( new RenderPass( this.scene, this.camera ) )
    this.effect = new ShaderPass( intarakai02Shader )
    this.effect.uniforms[ 'time' ].value = 0.3
    this.composer.addPass( this.effect )


  }

  draw() {
    requestAnimationFrame( this.draw.bind(this) )
    // this.mesh.rotation.x += 0.01
    // this.mesh.rotation.y += 0.01
    // console.log(this.effect.uniforms[ 'scale' ].value)
    this.effect.uniforms[ 'time' ].value += 2

    this.composer.render()
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize( window.innerWidth, window.innerHeight )
    this.composer.setSize( window.innerWidth, window.innerHeight )
  }

}

