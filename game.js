// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Player
camera.position.set(0, 5, 10);
let moveSpeed = 0.2;
let health = 100, shield = 0, score = 0;
let inventory = ["Pistol", null, null, null, null];
let activeWeapon = 0;
let chickens = [], pickups = [];
let isPaused = false;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Ground
let ground;
function createGround(color = 0x00ff00, width = 100, height = 100) {
    if (ground) scene.remove(ground);
    const geometry = new THREE.PlaneGeometry(width, height, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide });
    ground = new THREE.Mesh(geometry, material);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    return ground;
}
createGround();

// Weapons
const weapons = {
    Pistol: { damage: 10, range: 50, speed: 0.2 },
    Shotgun: { damage: 20, range: 20, speed: 0.5 },
    Rifle: { damage: 15, range: 100, speed: 0.1 },
    Sniper: { damage: 50, range: 200, speed: 1 },
    Sword: { damage: 30, range: 5, speed: 0.3 }
};

// Entities
function spawnChicken(x, z, speed, type = "melee") {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = new THREE.MeshPhongMaterial({ color: type === "ranged" ? 0xff0000 : 0xff5555 });
    const chicken = new THREE.Mesh(geometry, material);
    chicken.position.set(x, 0.5, z);
    chicken.userData = { speed, direction: Math.random() * Math.PI * 2, type, health: 20 };
    scene.add(chicken);
    chickens.push(chicken);
}

function spawnPickup(x, z, type) {
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: { gun: 0xffff00, medkit: 0x00ff00, bandage: 0xffffcc, shield: 0x0000ff }[type] });
    const pickup = new THREE.Mesh(geometry, material);
    pickup.position.set(x, 0.25, z);
    pickup.userData = { type };
    scene.add(pickup);
    pickups.push(pickup);
}

// Controls
let sensitivity = 1, isAiming = false;
const keys = {};
document.addEventListener("keydown", (e) => { keys[e.key.toLowerCase()] = true; handleKeys(e); });
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);
document.addEventListener("mousedown", (e) => {
    if (e.button === 0) shoot();
    if (e.button === 2) { isAiming = true; camera.fov = 30; camera.updateProjectionMatrix(); }
});
document.addEventListener("mouseup", (e) => { if (e.button === 2) { isAiming = false; camera.fov = 75; camera.updateProjectionMatrix(); } });
document.addEventListener("contextmenu", (e) => e.preventDefault());

function handleKeys(e) {
    const key = e.key.toLowerCase();
    if (key === "p") togglePause();
    if (key === "tab") showInventory();
    if (["1", "2", "3", "4", "5"].includes(key)) activeWeapon = parseInt(key) - 1;
}

function shoot() {
    if (isPaused || inventory[activeWeapon] === null) return;
    const weapon = weapons[inventory[activeWeapon]];
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObjects(chickens);
    if (intersects.length > 0 && intersects[0].distance < weapon.range) {
        const chicken = intersects[0].object;
        chicken.userData.health -= weapon.damage;
        if (chicken.userData.health <= 0) {
            scene.remove(chicken);
            chickens = chickens.filter(c => c !== chicken);
            score += 10;
            document.getElementById("score").textContent = score;
        }
    }
}

function updateMovement() {
    const forward = document.getElementById("moveForward").value.toLowerCase();
    const backward = document.getElementById("moveBackward").value.toLowerCase();
    const left = document.getElementById("moveLeft").value.toLowerCase();
    const right = document.getElementById("moveRight").value.toLowerCase();
    const direction = camera.getWorldDirection(new THREE.Vector3());
    if (keys[forward]) camera.position.addScaledVector(direction, moveSpeed);
    if (keys[backward]) camera.position.addScaledVector(direction, -moveSpeed);
    if (keys[left]) camera.position.x -= Math.cos(camera.rotation.y) * moveSpeed;
    if (keys[right]) camera.position.x += Math.cos(camera.rotation.y) * moveSpeed;
}

document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === renderer.domElement) {
        const mouseX = (e.movementX * sensitivity) / 100;
        camera.rotation.y -= mouseX;
    }
});

// Chicken AI
function updateChickens() {
    chickens.forEach(chicken => {
        const { speed, direction, type } = chicken.userData;
        const dx = camera.position.x - chicken.position.x;
        const dz = camera.position.z - chicken.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (type === "melee" && dist < 1) {
            health -= 5;
            updateStats();
        } else if (type === "ranged" && dist < 20 && Math.random() < 0.02) {
            health -= 10;
            shield = Math.max(0, shield - 10);
            updateStats();
        } else {
            chicken.position.x += Math.sin(direction) * speed;
            chicken.position.z += Math.cos(direction) * speed;
            if (Math.random() < 0.02) chicken.userData.direction += (Math.random() - 0.5) * 0.5;
        }
    });
}

// Pickups
function checkPickups() {
    pickups.forEach(pickup => {
        const dist = camera.position.distanceTo(pickup.position);
        if (dist < 1) {
            const { type } = pickup.userData;
            if (type === "gun") {
                const gun = Object.keys(weapons)[Math.floor(Math.random() * 5)];
                for (let i = 0; i < 5; i++) if (!inventory[i]) { inventory[i] = gun; break; }
            } else if (type === "medkit") health = Math.min(100, health + 50);
            else if (type === "bandage") health = Math.min(100, health + 20);
            else if (type === "shield") shield = Math.min(200, shield + 50);
            scene.remove(pickup);
            pickups = pickups.filter(p => p !== pickup);
            updateStats();
            updateInventory();
        }
    });
}

function updateStats() {
    document.getElementById("health").textContent = health;
    document.getElementById("shield").textContent = shield;
    if (health <= 0) alert("Game Over! Score: " + score);
}

function updateInventory() {
    document.getElementById("invSlots").textContent = inventory.map(i => i || "Empty").join(" | ");
}

// UI Handling
document.getElementById("playButton").addEventListener("click", () => {
    document.getElementById("startMenu").style.display = "none";
    document.getElementById("tutorial").style.display = "block";
});
document.getElementById("startGame").addEventListener("click", () => {
    document.getElementById("tutorial").style.display = "none";
    document.getElementById("gameUI").style.display = "block";
    document.getElementById("settings").style.display = "block";
    renderer.domElement.requestPointerLock();
    loadLevel(1);
});
document.getElementById("pauseButton").addEventListener("click", togglePause);

function togglePause() {
    isPaused = !isPaused;
    document.getElementById("pauseButton").textContent = isPaused ? "Resume" : "Pause";
}

function showInventory() {
    alert("Inventory: " + inventory.map((i, idx) => `${idx + 1}: ${i || "Empty"}`).join("\n"));
}

// Game loop
function animate() {
    if (!isPaused) {
        requestAnimationFrame(animate);
        updateMovement();
        updateChickens();
        checkPickups();
        if (chickens.length === 0 && currentLevel < 20) loadLevel(currentLevel + 1);
        renderer.render(scene, camera);
    } else {
        requestAnimationFrame(animate);
    }
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
