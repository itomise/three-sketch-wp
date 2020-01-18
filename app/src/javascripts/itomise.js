import * as THREE from 'three';
// import * as Orbitcontrols from 'three-orbitcontrols'; // eslint-disable-line
import {NoiseSphere} from '../materials/itomise/noiseSphere';

window.addEventListener('load', () => { new Visual() })

class Visual {

  constructor() {
    // === common ===
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    let guiControls = new function() {
      this.cameraPosX = 0;
      this.cameraPosY = 0;
      this.cameraPosZ = 54;
      this.spherePosX = -36;
    }
    // === scene ===
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xfd9aa, 100, 950);
    // === renderer ===
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    // === camera ===
    const aspectRatio = WIDTH / HEIGHT,
          fieldOfView = 60,
          nearPlane = 1,
          farPlane = 10000;
    const camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );
    camera.position.x = 0;
    camera.position.z = 54;
    camera.position.y = 0;
    // === light ===
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 10);
    // === helper ===
    //const axes = new THREE.AxesHelper(25);
    //const gridHelper = new THREE.GridHelper(200, 50);
    // const controls = new Orbitcontrols(camera, renderer.domElement);
    // const gui = new dat.GUI();
    // gui.add(guiControls, 'cameraPosX', -500, 500);
    // gui.add(guiControls, 'cameraPosY', -500, 500);
    // gui.add(guiControls, 'cameraPosZ', -100, 100);
    // gui.add(guiControls, 'spherePosX', -50, 50);
    // === model ===
    const noiseSphere = new NoiseSphere(0,0,0);

    this.scene = scene
    this.renderer = renderer
    this.camera = camera
    this.light = light
    //axes = axes
    //gridHelper = gridHelper
    //controls = controls
    this.guiControls = guiControls
    this.noiseSphere = noiseSphere
    this.canRender = false

    this.created()
    this.mounted()


    window.addEventListener('resize', this.handleWindowResize.bind(this), false)
  }

  created() {
    // === sceneにmodel,light, cameraを追加 ===
    this.scene.add(this.camera);
    this.scene.add(this.light);
    //this.scene.add(this.axes);
    //this.scene.add(this.gridHelper);
    this.scene.add(this.noiseSphere.mesh);
    window.addEventListener('resize',this.handleWindowResize, false);
  }

  mounted () {
    /**
     * 現在SPAなので問題ないが、SSRだとmounted内でdocument や window を使えないので
     * update 内で宣言する（SSRだとレンダリング時にupdateが実行される）
     */
    this.canRender = true;
    const stage = document.getElementById('js-container');
    stage.appendChild(this.renderer.domElement);
    this.animate()
  }

  animate() {
    // requestAnimationFrame(this.animate);
    requestAnimationFrame( this.animate.bind(this) )
    // this.camera.position.x = this.guiControls.cameraPosX;
    // this.camera.position.y = this.guiControls.cameraPosY;
    // this.camera.position.z = this.guiControls.cameraPosZ;
    //this.noiseSphere.mesh.position.x = this.guiControls.spherePosX;
    this.noiseSphere.draw();
    this.renderer.render(this.scene, this.camera);
  }

  handleWindowResize() {
    const WIDTH = window.innerWidth;
    const HEIGHT = window.innerHeight;
    this.renderer.setSize(WIDTH, HEIGHT);
    this.camera.aspect = WIDTH / HEIGHT;
    this.camera.updateProjectionMatrix();
  }

}
