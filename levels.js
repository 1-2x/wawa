let currentLevel = 1;

function generateHeightmap(ground, level) {
    const vertices = ground.geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 1];
        vertices[i + 2] = Math.sin(x * level * 0.1) * Math.cos(z * level * 0.1) * (level * 0.5);
    }
    ground.geometry.attributes.position.needsUpdate = true;
    ground.geometry.computeVertexNormals();
}

function loadLevel(level) {
    currentLevel = level;
    document.getElementById("level").textContent = currentLevel;
    chickens.forEach(chicken => scene.remove(chicken));
    pickups.forEach(pickup => scene.remove(pickup));
    chickens = [];
    pickups = [];

    const levels = [
        { name: "Flat Field", color: 0x00ff00, width: 100, height: 100, chickens: 5, speed: 0.05, ranged: 0, pickups: 2 },
        { name: "Gentle Hills", color: 0x00cc00, width: 100, height: 100, chickens: 6, speed: 0.06, ranged: 1, pickups: 2, heightmap: true },
        { name: "Pond Shore", color: 0x0000ff, width: 80, height: 80, chickens: 7, speed: 0.07, ranged: 1, pickups: 3 },
        { name: "Rolling Hills", color: 0x00aa00, width: 100, height: 100, chickens: 8, speed: 0.08, ranged: 2, pickups: 3, heightmap: true },
        { name: "Forest Edge", color: 0x006600, width: 90, height: 90, chickens: 9, speed: 0.09, ranged: 2, pickups: 3 },
        { name: "Mountain Base", color: 0x666633, width: 100, height: 100, chickens: 10, speed: 0.1, ranged: 3, pickups: 4, heightmap: true },
        { name: "Swamp", color: 0x336633, width: 80, height: 80, chickens: 11, speed: 0.11, ranged: 3, pickups: 4 },
        { name: "Rocky Plains", color: 0x999966, width: 100, height: 100, chickens: 12, speed: 0.12, ranged: 4, pickups: 4, heightmap: true },
        { name: "High Plateau", color: 0xcccc99, width: 90, height: 90, chickens: 13, speed: 0.13, ranged: 4, pickups: 5, heightmap: true },
        { name: "River Valley", color: 0x0066cc, width: 100, height: 100, chickens: 14, speed: 0.14, ranged: 5, pickups: 5, heightmap: true },
        { name: "Dense Forest", color: 0x003300, width: 80, height: 80, chickens: 15, speed: 0.15, ranged: 5, pickups: 5 },
        { name: "Steep Cliffs", color: 0x666666, width: 100, height: 100, chickens: 16, speed: 0.16, ranged: 6, pickups: 6, heightmap: true },
        { name: "Lakeside", color: 0x0099cc, width: 90, height: 90, chickens: 17, speed: 0.17, ranged: 6, pickups: 6 },
        { name: "Mountain Pass", color: 0x999999, width: 100, height: 100, chickens: 18, speed: 0.18, ranged: 7, pickups: 6, heightmap: true },
        { name: "Snowy Peaks", color: 0xdddddd, width: 80, height: 80, chickens: 19, speed: 0.19, ranged: 7, pickups: 7, heightmap: true },
        { name: "Volcanic Rim", color: 0x660000, width: 100, height: 100, chickens: 20, speed: 0.2, ranged: 8, pickups: 7, heightmap: true },
        { name: "Canyon", color: 0xcc6600, width: 90, height: 90, chickens: 21, speed: 0.21, ranged: 8, pickups: 7 },
        { name: "Island", color: 0xffff99, width: 80, height: 80, chickens: 22, speed: 0.22, ranged: 9, pickups: 8 },
        { name: "Sky Highlands", color: 0x99ccff, width: 100, height: 100, chickens: 23, speed: 0.23, ranged: 9, pickups: 8, heightmap: true },
        { name: "Chaos Peaks", color: 0xff3333, width: 100, height: 100, chickens: 25, speed: 0.25, ranged: 10, pickups: 8, heightmap: true }
    ];

    const lvl = levels[level - 1];
    ground = createGround(lvl.color, lvl.width, lvl.height);
    if (lvl.heightmap) generateHeightmap(ground, level);

    for (let i = 0; i < lvl.chickens - lvl.ranged; i++) spawnChicken((Math.random() - 0.5) * lvl.width * 0.8, (Math.random() - 0.5) * lvl.height * 0.8, lvl.speed, "melee");
    for (let i = 0; i < lvl.ranged; i++) spawnChicken((Math.random() - 0.5) * lvl.width * 0.8, (Math.random() - 0.5) * lvl.height * 0.8, lvl.speed, "ranged");
    for (let i = 0; i < lvl.pickups; i++) spawnPickup((Math.random() - 0.5) * lvl.width * 0.8, (Math.random() - 0.5) * lvl.height * 0.8, ["gun", "medkit", "bandage", "shield"][Math.floor(Math.random() * 4)]);
}
