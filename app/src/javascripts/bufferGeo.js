import * as THREE from 'three'
import fs from '../materials/bufferGeo/fragmentShader.frag'
import vs from '../materials/bufferGeo/vertexShader.vert'

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x000000)

const container = document.getElementById('js-container')
container.appendChild(renderer.domElement)
const mouse = new THREE.Vector2()
container.addEventListener('mousemove', handleMouseMove)

const handleMouseMove = (event) => {
  const element = event.currentTarget
  const x = event.clientX - element.offsetLeft
  const y = event.clientY - element.offsetTop
  const w = element.offsetWidth
  const h = element.offsetHeight

  mouse.x = ( x / w ) * 2 - 1;
  mouse.y = -( y / h ) * 2 + 1;
}

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 20)
camera.position.z = 10

// 使用するジオメトリ
const geometry = new THREE.BufferGeometry()

// 球体ジオメトリ
const sGeometry = new THREE.SphereBufferGeometry(3.5, 32, 32)
// 球体ジオメトリのポジション
const sGeometryPosition = sGeometry.attributes.position.array

// 平面ジオメトリ
const pGeometry = new THREE.PlaneBufferGeometry(12, 9, 32, 32)
// 平面ジオメトリのポジション
const pGeometryPosition = pGeometry.attributes.position.array
// 平面ジオメトリのインデックス
const pGeometryIndex = pGeometry.index.array

const count = pGeometryIndex.length * 3

let sPosition = new Float32Array(count)
let pPosition = new Float32Array(count)
let rPosition = new Float32Array(count)
let color = new Float32Array(count)
let index = new Uint16Array(count / 3)
let r = new THREE.Vector3(0), c

for (let i = 0; i < count / 3; i++) {
  // 平面ジオメトリのインデックスから球体のポジションを代入
  sPosition[i * 3 + 0] = sGeometryPosition[pGeometryIndex[i] * 3 + 0]
  sPosition[i * 3 + 1] = sGeometryPosition[pGeometryIndex[i] * 3 + 1]
  sPosition[i * 3 + 2] = sGeometryPosition[pGeometryIndex[i] * 3 + 2]

  // 平面ジオメトリのインデックスから平面のポジションを代入
  pPosition[i * 3 + 0] = pGeometryPosition[pGeometryIndex[i] * 3 + 0]
  pPosition[i * 3 + 1] = pGeometryPosition[pGeometryIndex[i] * 3 + 1]
  pPosition[i * 3 + 2] = pGeometryPosition[pGeometryIndex[i] * 3 + 2]

  if (i % 3 == 0) {
    // ランダムポジションの作成
    r.x = Math.random() * 60 - 30
    r.y = Math.random() * 60 - 30
    r.z = Math.random() * 60 - 30

    // ランダムカラーの作成
    c = new THREE.Color(Math.floor(Math.random() * 16777215))
  }

  rPosition[i * 3 + 0] = r.x
  rPosition[i * 3 + 1] = r.y
  rPosition[i * 3 + 2] = r.z

  color[i * 3 + 0] = c.r
  color[i * 3 + 1] = c.g
  color[i * 3 + 2] = c.b

  index[i] = i
}

// 使用するジオメトリに各情報を代入
geometry.setAttribute("sPosition", new THREE.BufferAttribute(sPosition, 3))
geometry.setAttribute("pPosition", new THREE.BufferAttribute(pPosition, 3))
geometry.setAttribute("rPosition", new THREE.BufferAttribute(rPosition, 3))
geometry.setAttribute("color", new THREE.BufferAttribute(color, 3))
geometry.setIndex(new THREE.BufferAttribute(index, 1))


let uniforms = {
  variable: {type: "f", value: 0.0},
  autoplay: {type: "bool", value: true}
}
const material = new THREE.RawShaderMaterial({
  uniforms: uniforms,
  vertexShader: vs,
  fragmentShader: fs,
  side: THREE.DoubleSide
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const raycaster = new THREE.Raycaster() // eslint-disable-line

requestAnimationFrame(update)

function update(frame) { // eslint-disable-line

  renderer.setRenderTarget(null)

  raycaster.setFromCamera(mouse, camera);

  // // その光線とぶつかったオブジェクトを得る
  // var intersects = raycaster.intersectObjects( scene.children ); // eslint-disable-line

  // if(intersects.length > 0){
  //   console.log('a')
  // }

  if (uniforms.autoplay.value) {
    uniforms.variable.value = (Math.cos(frame * 0.0009) + 1) / 2
  }


  renderer.render(scene, camera)
  requestAnimationFrame(update)
}
