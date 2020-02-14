import * as THREE from 'three';
import { EffectComposer } from '../materials/postProcess01/EffectComposer';
import { ShaderPass } from '../materials/postProcess01/ShaderPass';
import { TexturePass } from '../materials/postProcess01/TexturePass';
import { ClearPass } from '../materials/postProcess01/ClearPass';
import { MaskPass, ClearMaskPass } from '../materials/postProcess01/MaskPass';
import { CopyShader } from '../materials/postProcess01/CopyShader';
import { RenderPass } from '../materials/postProcess01/RenderPass'
import panda from '../materials/masking/panda.png'
import redTexture from '../materials/maskingNoise/texture_red.jpg'
import whiteTexture from '../materials/maskingNoise/texture_white.jpg'
import blackTexture from '../materials/maskingNoise/texture_black.jpg'
import yellowTexture from '../materials/maskingNoise/texture_yellow.jpg'
import dotTexture from '../materials/maskingNoise/texture_dot.jpg'
import vertexShader from '../materials/maskingNoise/vertexShader.vert'
import fragmentShader from '../materials/maskingNoise/fragmentShader.frag'
import { MyNoiseShader } from '../materials/maskingNoise/MyNoiseShader'
import GLTFLoader from 'three-gltf-loader'

class NoiseSphere {
  constructor(x, y, z) {
    // this.geometry = new THREE.SphereBufferGeometry( 3.5, 60, 60 )
    const randomX = Math.random() * 3
    const randomY = Math.random() * 2
    const randomZ = Math.random() * 3
    this.geometry = new THREE.BoxBufferGeometry(randomX,randomY,randomZ,20,20,20)
    // this.geometry = new THREE.SphereBufferGeometry(randomX, 100, 100)
    // this.geometry = new THREE.IcosahedronGeometry(10,2);
    this.uniforms = {
      u_time: { type: 'f', value: Math.random() * 1000},
      u_resolution: { type: 'v2', value: new THREE.Vector2() },
      u_mouse: { type: 'v2', value: new THREE.Vector2() },
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      // vertexShader: vertexShader,
      // fragmentShader: fragmentShader,
      vertexShader: MyNoiseShader.vertexShader,
      fragmentShader: MyNoiseShader.fragmentShader,
      //blending: THREE.AdditiveBlending,
      blending: THREE.NormalBlending,
      transparent: false,
      depthWrite: true,
      side: THREE.DoubleSide
    });
    // this.material = new THREE.MeshBasicMaterial()
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.position(1, 1, 10)
    this.mesh.position.x = x
    this.mesh.position.y = y
    this.mesh.position.z = z
    // this.mesh.rotation += 0.1
  }
  draw() {
    this.uniforms.u_time.value += 0.01;
    // console.log('a')
    // this.mesh.rotation.x += 0.01
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


    // this.noiseSphere = new NoiseSphere(0, 0, 0)

    const objectsNumber1 = 100
    const objectsNumber2 = 100
    const objectsNumber3 = 20

    // ====== scene1 =======
    var scene0 = new THREE.Scene();
    this.scene0Objects = [];
    for (let i=0; i < 30; i++) {
      const x = (Math.random() * 2 - 1) * 9
      const y = (Math.random() * 2 - 1) * 5
      const z = (Math.random() * 2 - 1) * 5
      this.scene0Objects.push( new NoiseSphere(x, y, z))
    }

    this.scene0Objects.forEach( s => {
      scene0.add(s.mesh)
    })

    // ====== scene1 =======
    var scene1 = new THREE.Scene();
    this.scene1Objects = [];
    for (let i=0; i < objectsNumber1; i++) {
      const x = (Math.random() * 2 - 1) * 9
      const y = (Math.random() * 2 - 1) * 5
      const z = (Math.random() * 2 - 1) * 5
      this.scene1Objects.push( new NoiseSphere(x, y, z))
    }

    this.scene1Objects.forEach( s => {
      scene1.add(s.mesh)
    })


    // ====== scene2 =======
    var scene2 = new THREE.Scene();
    this.scene2Objects = [];
    for (let i=0; i < objectsNumber2; i++) {
      const x = (Math.random() * 2 - 1) * 9
      const y = (Math.random() * 2 - 1) * 5
      const z = (Math.random() * 2 - 1) * 5
      this.scene2Objects.push( new NoiseSphere(x, y, z))
    }

    this.scene2Objects.forEach( s => {
      scene2.add(s.mesh)
    })


    // ====== scene3 =======
    var scene3 = new THREE.Scene();
    this.scene3Objects = []
    for (let i=0; i < objectsNumber3; i++) {
      const x = (Math.random() * 2 - 1) * 9
      const y = (Math.random() * 2 - 1) * 5
      const z = (Math.random() * 2 - 1) * 5
      this.scene3Objects.push( new NoiseSphere(x, y, z))
    }

    this.scene3Objects.forEach( s => {
      scene3.add(s.mesh)
    })

    // ====== scene4 ======= (heart)
    var scene4 = new THREE.Scene()
    const loader = new GLTFLoader()
    loader.load( './public/materials/heart.glb', data => {
      const gltf = data
      this.heart = gltf.scene
      scene4.add(this.heart)
    })


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
    var maskPass0 = new MaskPass( scene0, this.camera );
    var maskPass1 = new MaskPass( scene1, this.camera );
    var maskPass2 = new MaskPass( scene2, this.camera );
    var maskPass3 = new MaskPass( scene3, this.camera );
    var maskPass4 = new MaskPass( scene4, this.camera );
    var texture0 = new THREE.TextureLoader().load( whiteTexture );
    var texture1 = new THREE.TextureLoader().load( redTexture );
    texture1.minFilter = THREE.LinearFilter;
    var texture2 = new THREE.TextureLoader().load( blackTexture );
    var texture3 = new THREE.TextureLoader().load( yellowTexture );
    var texturePass0 = new TexturePass( texture0 );
    var texturePass1 = new TexturePass( texture1 );
    var texturePass2 = new TexturePass( texture2 );
    var texturePass3 = new TexturePass( texture3 );
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

    this.composer.addPass( maskPass0 );
    this.composer.addPass( texturePass1 );

    this.composer.addPass( clearMaskPass );
    this.composer.addPass( maskPass1 );
    this.composer.addPass( texturePass0 );

    this.composer.addPass( clearMaskPass );
    this.composer.addPass( maskPass2 );
    this.composer.addPass( texturePass2 );

    this.composer.addPass( clearMaskPass );
    this.composer.addPass( maskPass3 );
    this.composer.addPass( texturePass3 );

    this.composer.addPass( clearMaskPass );
    this.composer.addPass( maskPass4 );
    this.composer.addPass( texturePass1 );

    this.composer.addPass( clearMaskPass );
    this.composer.addPass( outputPass );

    this.count = 0


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
    this.scene0Objects.forEach(s => {
      s.draw()
    })
    this.scene1Objects.forEach(s => {
      s.draw()
    })
    this.scene2Objects.forEach( s => {
      s.draw()
    })
    this.scene3Objects.forEach( s => {
      s.draw()
    })
    this.heart.rotation.x += 0.02
    this.heart.rotation.z += 0.01
    this.heart.scale.x += Math.sin(this.count* 0.09) * 0.006
    this.heart.scale.y += Math.sin(this.count* 0.09) * 0.006
    this.heart.scale.z += Math.sin(this.count* 0.09) * 0.006
    this.count++

    this.renderer.clear();
    this.composer.render( time );
  }

}
