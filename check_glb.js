const fs = require('fs');

function parseGlb(filePath) {
    const buffer = fs.readFileSync(filePath);
    const magic = buffer.readUInt32LE(0);
    if (magic !== 0x46546C67) { // glTF
        console.log("Not a glTF file");
        return;
    }
    
    const chunkLength = buffer.readUInt32LE(12);
    const chunkType = buffer.readUInt32LE(16);
    if (chunkType !== 0x4E4F534A) { // JSON
        console.log("First chunk is not JSON");
        return;
    }
    
    const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
    const gltf = JSON.parse(jsonStr);
    
    const nodes = gltf.nodes || [];
    console.log("Node Hierarchy:");
    
    // Find root nodes (nodes not referenced as children)
    const childSet = new Set();
    nodes.forEach(n => {
        if (n.children) n.children.forEach(c => childSet.add(c));
    });
    
    const printNode = (idx, indent) => {
        const n = nodes[idx];
        console.log(indent + (n.name || 'unnamed'));
        if (n.children) {
            n.children.forEach(c => printNode(c, indent + "  "));
        }
    };
    
    nodes.forEach((n, i) => {
        if (!childSet.has(i)) {
            printNode(i, "");
        }
    });
}

parseGlb(process.argv[2]);
