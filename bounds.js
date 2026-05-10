const fs = require('fs');

function computeBounds(filePath) {
    const buffer = fs.readFileSync(filePath);
    const magic = buffer.readUInt32LE(0);
    if (magic !== 0x46546C67) return;
    
    const chunkLength = buffer.readUInt32LE(12);
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    
    let min = [Infinity, Infinity, Infinity];
    let max = [-Infinity, -Infinity, -Infinity];
    
    // Simplistic bounds: just look at accessors for POSITION
    const meshes = gltf.meshes || [];
    const accessors = gltf.accessors || [];
    
    accessors.forEach(acc => {
        if (acc.type === 'VEC3' && acc.min && acc.max) {
            min[0] = Math.min(min[0], acc.min[0]);
            min[1] = Math.min(min[1], acc.min[1]);
            min[2] = Math.min(min[2], acc.min[2]);
            max[0] = Math.max(max[0], acc.max[0]);
            max[1] = Math.max(max[1], acc.max[1]);
            max[2] = Math.max(max[2], acc.max[2]);
        }
    });
    
    console.log("Min:", min);
    console.log("Max:", max);
    console.log("Center:", [
        (min[0] + max[0]) / 2,
        (min[1] + max[1]) / 2,
        (min[2] + max[2]) / 2
    ]);
}

computeBounds(process.argv[2]);
