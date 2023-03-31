import * as THREE from "three";
import './style.css';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

// Create a Sphere (Shape)
let radius = 3;
let widthSegment = 64;
let heightSegment = 64;
const geometry = new THREE.SphereGeometry(radius, widthSegment, heightSegment);

// Design the Sphere
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.5,
});

// Create and Design
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Lights
let lightColor = 0xffffff;
let lightIntensity = 1.25;
let lightDistance = 100;
const light = new THREE.PointLight(lightColor, lightIntensity, lightDistance);
let lightXPosition = 0;
let lightYPosition = 10;
let lightZPosition = 10;
light.position.set(lightXPosition, lightYPosition, lightZPosition);
scene.add(light);

// Camera
let fieldOfView = 50; // How much the camera can see?
let aspectRatio = sizes.width / sizes.height;
let nearClipPoint = 0.1;
let farClipPoint = 100;
const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearClipPoint, farClipPoint);
let ZPositionBack = 20;
camera.position.z = ZPositionBack;
scene.add(camera);

// Render the Scene to the Screen
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
let rendererWidth = sizes.width;
let rendererHeight = sizes.height;
renderer.setSize(rendererWidth, rendererHeight);
let pixelRatio = 2;
renderer.setPixelRatio(pixelRatio); // Add pixels
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; // Adds physics to the movement
controls.enablePan = false; // Stops from dragging
controls.enableZoom = false; // Stops zooms
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener('resize', () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
})

// Rerender the canvas
const loop = () => {
  controls.update(); // Animate after mouse off
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop();

// Timeline Magic
const t1 = gsap.timeline({ defaults: { duration: 1 } });
t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
t1.fromTo('nav', { y: '-100%' }, { y: "0%" });
t1.fromTo('.title', { opacity: 0 }, { opacity: 1 });

//Mouse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round(e.pageX / sizes.width * 255),
      Math.round(e.pageY / sizes.height * 255),
      150
    ];
    // Animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
  }
})