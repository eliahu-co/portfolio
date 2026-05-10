import struct
import json
import sys

def parse_glb(file_path):
    with open(file_path, 'rb') as f:
        magic = f.read(4)
        if magic != b'glTF':
            print("Not a glTF file")
            return
        version = struct.unpack('<I', f.read(4))[0]
        length = struct.unpack('<I', f.read(4))[0]
        
        chunk_length = struct.unpack('<I', f.read(4))[0]
        chunk_type = f.read(4)
        if chunk_type != b'JSON':
            print("First chunk is not JSON")
            return
        
        json_data = f.read(chunk_length)
        gltf = json.loads(json_data.decode('utf-8'))
        
        nodes = gltf.get('nodes', [])
        
        print("Node Names and children:")
        for i, node in enumerate(nodes):
            name = node.get('name', 'unnamed')
            children = node.get('children', [])
            print(f"[{i}] {name} - children: {children}")

if __name__ == '__main__':
    parse_glb(sys.argv[1])
