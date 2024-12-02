import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import spline from './src/spline.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';



// Set up the scene
const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x000000, 0.3);


// Set up the camera
const fov = 75;
const w = window.innerWidth;
const h = window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, w / h, near, far);
camera.position.z = 5;

// Set up the renderer
const canvas = document.getElementById('wormhole');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// post-processing
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 100);
bloomPass.threshold = 0.002;
bloomPass.strength = 3.5;
bloomPass.radius = 0;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// create a line geometry from the spline
const points = spline.getPoints(100);
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff000 });
const line = new THREE.Line(lineGeometry, lineMaterial);
// scene.add(line);


// Create a tube geometry from the spline
const tubeGeometry = new THREE.TubeGeometry(spline, 222, 0.65, 16, true);



// create edges geometry from the spline
const edges = new THREE.EdgesGeometry(tubeGeometry,0.3);
const lineMat = new THREE.LineBasicMaterial({color: 0xff0000});
const tubeLines = new THREE.LineSegments(edges, lineMat);
scene.add(tubeLines);

const numBoxes = 55;
const size = 0.075;
const boxgeo = new THREE.BoxGeometry(size, size, size);

for (let i = 0; i < numBoxes; i += 1) {
    const boxmat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true
    });
    const box = new THREE.Mesh(boxgeo, boxmat);
    const p = (i / numBoxes + Math.random() * 0.1) % 1;
    const pos = tubeGeometry.parameters.path.getPointAt(p);
    pos.x += Math.random() -0.04;
    pos.z += Math.random() -0.04;
    box.position.copy(pos);
    const rote = new THREE.Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    )
    box.rotation.set(rote.x, rote.y, rote.z);

    const edges = new THREE.EdgesGeometry(boxgeo,0.3);
    const color = new THREE.Color().setHSL(p, 1, 0.5);
    const lineMat = new THREE.LineBasicMaterial({color});
    const boxLines = new THREE.LineSegments(edges, lineMat);
    boxLines.position.copy(pos);
    boxLines.rotation.set(rote.x, rote.y, rote.z);
    // scene.add(box);
    scene.add(boxLines);
}

function updateCamera(t){
    const time = t * 0.1;
   const looptime = 8 * 1000;
   const p = (time % looptime) / looptime;
   const pos = tubeGeometry.parameters.path.getPointAt(p);
   const lookAt = tubeGeometry.parameters.path.getPointAt((p + 0.03) % 1);
   camera.position.copy(pos);
   camera.lookAt(lookAt);
}


// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;



// Animation loop
function animate(t = 0) {
    requestAnimationFrame(animate);


    updateCamera(t);

    composer.render(scene, camera);
    controls.update();
}
animate();


// Handle window resize
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', handleResize, false);