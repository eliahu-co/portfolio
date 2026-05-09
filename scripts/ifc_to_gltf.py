# scripts/ifc_to_gltf.py
"""
Offline IFC -> glTF pipeline.
Reads P1016-WL1135.01.IFC + bim_schema JSON, groups parts into 5 layers,
triangulates B-rep geometry, decimates, exports panel_raw.glb.

Then run Draco compression manually:
    npx gltf-pipeline -i public/panel_raw.glb -o public/panel.glb --draco.compressionLevel 7

Usage:
    python scripts/ifc_to_gltf.py
"""

from __future__ import annotations
import json
import sys
from pathlib import Path
from typing import Optional

import numpy as np

IFC_PATH = Path("C:/Users/Eliahu/Documents/repo/test44/backend/app/etl/data/P1016-WL1135.01.IFC")
SCHEMA_PATH = Path("C:/Users/Eliahu/Documents/repo/test44/backend/app/etl/data/bim_schema_P1016-WL1135.01.json")
OUTPUT_DIR = Path("public")
OUTPUT_RAW = OUTPUT_DIR / "panel_raw.glb"

# Keyword -> layer name mapping. Order matters: first match wins.
LAYER_RULES: list[tuple[str, list[str]]] = [
    ("layer_gypsum",      ["Gypsum", "Flat Panel"]),
    ("layer_insulation",  ["Insulation", "Fiberglass", "Batt", "Membrane", "Vapor", "R-SEAL", "tape"]),
    ("layer_mep",         ["Hanger Strap Coil", "Tube", "Cable", "Flexible", "conduit"]),
    ("layer_electrical",  ["Outlet Box", "Gang", "Octagon Box", "EMT", "Strap", "Bracket",
                           "Bushing", "Flashing Panel", "TV Box", "In Box"]),
    ("layer_frame",       ["Steel", "Angle", "Holdown"]),
]

DISCARD_KEYWORDS = ["washer", "Shim", "Clip", "prong"]

LAYER_ORDER = ["layer_frame", "layer_insulation", "layer_mep", "layer_electrical", "layer_gypsum"]


def classify_part(description: str) -> Optional[str]:
    """Return the layer name for a part description, or None if discarded/unknown."""
    desc_lower = description.lower()
    for keyword in DISCARD_KEYWORDS:
        if keyword.lower() in desc_lower:
            return None
    for layer_name, keywords in LAYER_RULES:
        for keyword in keywords:
            if keyword.lower() in desc_lower:
                return layer_name
    return None


def load_schema(schema_path: Path) -> dict[str, str]:
    """Return mapping of global_id -> description."""
    with open(schema_path, encoding="utf-8") as f:
        data = json.load(f)
    result: dict[str, str] = {}
    for gid, part in data.get("parts", {}).items():
        desc = part.get("properties", {}).get("description", "")
        result[gid] = desc
    return result


def extract_geometry(ifc_path: Path, schema: dict[str, str]) -> dict[str, list]:
    """
    Returns dict of layer_name -> list of (vertices: np.ndarray, faces: np.ndarray).
    """
    try:
        import ifcopenshell
        import ifcopenshell.geom
    except ImportError:
        print("ERROR: ifcopenshell not installed. Run: pip install ifcopenshell", file=sys.stderr)
        sys.exit(1)

    settings = ifcopenshell.geom.settings()
    settings.set(settings.USE_WORLD_COORDS, True)

    ifc = ifcopenshell.open(str(ifc_path))
    layer_meshes: dict[str, list] = {name: [] for name in LAYER_ORDER}

    element_types = ["IfcBuildingElementProxy", "IfcPlate", "IfcMember", "IfcCovering"]
    elements = []
    for t in element_types:
        elements.extend(ifc.by_type(t))
    total = len(elements)
    print(f"Processing {total} elements...")

    for i, element in enumerate(elements):
        if i % 100 == 0:
            print(f"  {i}/{total}")

        gid = element.GlobalId
        description = schema.get(gid, "")
        layer = classify_part(description)
        if layer is None:
            continue

        try:
            shape = ifcopenshell.geom.create_shape(settings, element)
        except Exception:
            continue

        verts = np.array(shape.geometry.verts).reshape(-1, 3)
        faces = np.array(shape.geometry.faces).reshape(-1, 3)

        if len(verts) == 0 or len(faces) == 0:
            continue

        layer_meshes[layer].append((verts, faces))

    return layer_meshes


def merge_and_simplify(layer_meshes: dict[str, list], target_total_faces: int = 40_000) -> dict[str, object]:
    """Merge parts per layer, simplify to target face count, return trimesh objects."""
    try:
        import trimesh
    except ImportError:
        print("ERROR: trimesh not installed. Run: pip install trimesh", file=sys.stderr)
        sys.exit(1)

    total_input_faces = sum(
        sum(f.shape[0] for _, f in meshes)
        for meshes in layer_meshes.values()
    )
    ratio = target_total_faces / max(total_input_faces, 1)

    result: dict[str, object] = {}
    for layer_name in LAYER_ORDER:
        parts = layer_meshes[layer_name]
        if not parts:
            print(f"  WARNING: {layer_name} has no geometry - skipping")
            continue

        combined = trimesh.util.concatenate([
            trimesh.Trimesh(vertices=v, faces=f) for v, f in parts
        ])

        target_faces = max(500, int(combined.faces.shape[0] * ratio))
        try:
            simplified = combined.simplify_quadric_decimation(face_count=target_faces)
        except TypeError:
            # Older trimesh API used a percent. Compute reduction ratio instead.
            try:
                reduction = max(0.0, min(0.99, 1.0 - (target_faces / max(combined.faces.shape[0], 1))))
                simplified = combined.simplify_quadric_decimation(percent=1 - reduction)
            except Exception as e:
                print(f"  WARNING: simplification failed for {layer_name} ({e}); using original mesh")
                simplified = combined
        except Exception as e:
            print(f"  WARNING: simplification failed for {layer_name} ({e}); using original mesh")
            simplified = combined
        result[layer_name] = simplified
        print(f"  {layer_name}: {combined.faces.shape[0]} -> {simplified.faces.shape[0]} faces")

    return result


def export_glb(layer_trimeshes: dict[str, object], output_path: Path) -> None:
    try:
        import trimesh
    except ImportError:
        print("ERROR: trimesh not installed.", file=sys.stderr)
        sys.exit(1)

    scene = trimesh.scene.Scene()
    for name, mesh in layer_trimeshes.items():
        scene.add_geometry(mesh, geom_name=name, node_name=name)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    export_bytes = trimesh.exchange.gltf.export_glb(scene)
    with open(output_path, "wb") as f:
        f.write(export_bytes)
    size_mb = output_path.stat().st_size / 1_048_576
    print(f"\nExported {output_path} ({size_mb:.1f} MB)")


def main() -> None:
    print("Loading schema...")
    schema = load_schema(SCHEMA_PATH)
    print(f"  {len(schema)} parts loaded")

    print("Extracting geometry from IFC (this takes 5-15 minutes)...")
    layer_meshes = extract_geometry(IFC_PATH, schema)

    counts = {k: len(v) for k, v in layer_meshes.items()}
    print(f"Parts per layer: {counts}")

    print("Merging and simplifying...")
    layer_trimeshes = merge_and_simplify(layer_meshes)

    print("Exporting GLB...")
    export_glb(layer_trimeshes, OUTPUT_RAW)

    print("\nNext step - apply Draco compression:")
    print(f"  npx gltf-pipeline -i {OUTPUT_RAW} -o public/panel.glb --draco.compressionLevel 7")


if __name__ == "__main__":
    main()
