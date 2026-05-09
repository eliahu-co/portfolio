# scripts/test_ifc_to_gltf.py
import sys, os
sys.path.insert(0, os.path.dirname(__file__))
import pytest
from ifc_to_gltf import classify_part

def test_steel_angle_is_frame():
    assert classify_part('HRS Angle, 90 deg, 3.5" x 3.5", ASTM A572 Steel, Grade 50') == 'layer_frame'

def test_holdown_is_frame():
    assert classify_part('Holdown S/HDU 4 118 mil (10 ga)') == 'layer_frame'

def test_fiberglass_batt_is_insulation():
    assert classify_part('Insulation, Fiberglass, 5.5", Unfaced, R21, Batt, 24" x 96"') == 'layer_insulation'

def test_vapor_membrane_is_insulation():
    assert classify_part('Self-Adhering Membrane, Above-Grade Wall, Vapor Retarder, 6"') == 'layer_insulation'

def test_r_seal_tape_is_insulation():
    assert classify_part('Adhesive construction tape, R-SEAL, 3"') == 'layer_insulation'

def test_hanger_strap_coil_is_mep():
    assert classify_part('3/4" Plastic Hanger Strap Coil, L=14"') == 'layer_mep'

def test_tube_is_mep():
    assert classify_part('Tube-1000X028 Tube 1.000in OD X .028in Wall') == 'layer_mep'

def test_outlet_box_is_electrical():
    assert classify_part('1-Gang 20 cu. in. Electrical and Outlet Box, Old Work, PVC') == 'layer_electrical'

def test_emt_strap_is_electrical():
    assert classify_part('One Hole - EMT Steel Straps, 1"') == 'layer_electrical'

def test_tv_box_is_electrical():
    assert classify_part('2-Gang Non Metallic Recessed TV Box for Power and Low Voltage') == 'layer_electrical'

def test_gypsum_is_gypsum():
    assert classify_part('Flat Panel, Gypsum, 1/2", Mold & Moisture Resistant Panel') == 'layer_gypsum'

def test_thermal_grip_washer_discarded():
    assert classify_part('Thermal-Grip ci prong washer 2"') is None

def test_shimstrip_discarded():
    assert classify_part('CRL Black 1/4" Plastic Bearing Shimstrips') is None

def test_clip_discarded():
    assert classify_part('Clip, Cut In Old Work, for Gang Box, Zinc Plated Steel') is None

def test_unknown_returns_none():
    assert classify_part('Some completely unrecognised part') is None

def test_matching_is_case_insensitive():
    assert classify_part('INSULATION FIBERGLASS BATT 24x96') == 'layer_insulation'
