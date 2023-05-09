import '../style.css'
import * as rsc from '../resources';
import * as THREE from 'three';

let orientation = window.orientation;
function resize() {
    if(!rsc.isTouchDevice()) {  // if not touch device
        location.reload();
    } else {
        if (orientation !== window.orientation) {
            location.reload();
        }
        orientation = window.orientation;
    }
}
window.onresize = resize;

let [scene, camera, renderer, stars] = rsc.heroSetup();

function addPlanet(mapTexture, size, detail) {
  const texture = new THREE.TextureLoader().load(mapTexture);
  const geometry = new THREE.DodecahedronGeometry(size, detail, detail);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const planet = new THREE.Mesh(geometry, material);
  return planet
}



const mars = addPlanet('/2k_mars.jpg', 2, 32);
mars.position.set(0, 0, -7);
scene.add(mars);

var timeDelta;
let smoothDeltaTime = 0;
const lerpFactor = 0.005;
let lastTime = performance.now();

function deltaTime() {
  return smoothDeltaTime;
}

function animate() {
  requestAnimationFrame(animate);
  const currentTime = performance.now();
  const delta = (currentTime - lastTime) / 1000; // convert to seconds
  smoothDeltaTime = THREE.MathUtils.lerp(smoothDeltaTime, delta, lerpFactor);
  smoothDeltaTime = Math.min(smoothDeltaTime, 0.033)
  lastTime = currentTime;
  timeDelta = deltaTime() * 30;
  updatePlanets();
  renderer.render(scene, camera);
}
function updatePlanets() {
  mars.rotation.y += 0.005 * timeDelta;
  stars.rotation.y += 0.0001 * timeDelta;
}
animate();

let prevScrollPos = window.scrollY || document.documentElement.scrollTop;

function handleScroll() {
  const currentScrollPos = window.scrollY || document.documentElement.scrollTop;
  const scrollDirection = currentScrollPos > prevScrollPos ? 'down' : 'up';
  const scrollDistance = Math.abs(currentScrollPos - prevScrollPos);

  const normalizedValue = scrollDistance / 1500;

  const inverter = scrollDirection === 'down' ? -1 : 1;
  
  stars.position.y += inverter * normalizedValue * 50;
  stars.rotation.y += inverter * normalizedValue / 10;
  mars.position.y -= inverter * normalizedValue * 20;
  mars.position.z += inverter * normalizedValue * 20;

  prevScrollPos = currentScrollPos;
}

document.addEventListener('scroll', handleScroll);


rsc.button.onclick = () => {
  rsc.toggle();
} 

document.getElementById("p-2").addEventListener("click", () => {
  document.getElementById("p-2").classList.add("btn-active")
  document.getElementById("p-1").classList.remove("btn-active")
  document.getElementById("p1Form").classList.add("hidden")
  document.getElementById("p2Form").classList.remove("hidden")
})

document.querySelector("#p-1").addEventListener("click",() => {
  this.classList.add("btn-active")
  document.querySelector("#p-2").classList.add("btn-active")
  document.querySelector("#p1Form").classList.remove("hidden")
  document.querySelector("#p2Form").classList.add("hidden")
})