// Import necessary modules from Three.js and custom files
import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import getStarfield from './src/getStarfield.js';
import getFresnelMat from './src/getFresnalMat.js';

// Set up the renderer
const canvas = document.querySelector('#globe');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Set up the scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a group for the Earth and its components
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180; // Set Earth's axial tilt
scene.add(earthGroup);

// Set up texture loader and geometry
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 16);

// Helper function to create meshes
const createMesh = (material) => new THREE.Mesh(geometry, material);

// Create Earth's main surface
const earthMesh = createMesh(new THREE.MeshStandardMaterial({
    map: loader.load("./texture/earthmap1k.jpg"),
    specularMap: loader.load("./texture/earthspec1k.jpg"),
    bumpMap: loader.load("./texture/earthbump1k.jpg"),
    bumpScale: 0.04,
}));
earthGroup.add(earthMesh);

// Create Earth's night lights
const lightsMesh = createMesh(new THREE.MeshBasicMaterial({
    map: loader.load("./texture/earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
}));
earthGroup.add(lightsMesh);

// Create Earth's cloud layer
const cloudMesh = createMesh(new THREE.MeshStandardMaterial({
    map: loader.load("./texture/earthcloudmap.jpg"),
    blending: THREE.AdditiveBlending,
}));
cloudMesh.scale.setScalar(1.004); // Scale slightly larger than Earth
earthGroup.add(cloudMesh);

// Create Earth's atmosphere glow
const glowMesh = createMesh(getFresnelMat());
glowMesh.scale.setScalar(1.007); // Scale larger than clouds
earthGroup.add(glowMesh);

// Add starfield to the scene
scene.add(getStarfield({ numStars: 5000 }));

// Set up orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Add sunlight
const sunLight = new THREE.DirectionalLight(0xffffff, 0.5);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Earth and its components
    earthGroup.rotation.y += 0.002;
    cloudMesh.rotation.y += 0.0005;
    glowMesh.rotation.y += 0.0025;

    controls.update();
    renderer.render(scene, camera);
}

animate();
