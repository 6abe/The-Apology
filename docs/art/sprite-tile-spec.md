# Sprite and tile spec — working version
Engine: web / Three.js · Perspective: isometric 2:1 · Medium: hi-bit via 3D-to-2D pipeline

Numbers are starting points. Bumped from the early 16/32 default after the 64px downscale test: the detailed scout mushs at 32px.

## Grid
| Unit | Size | Notes |
| --- | --- | --- |
| Floor tile (iso diamond) | **64×32** | 2:1 diagonals; one walkable cell |
| Character canvas | **64×64** | whole multiple of tile height×2; fits scout silhouette |
| Prop chunk (ruin etc.) | **128×128** masters → pack to **64×64** or **96×96** | keep masters |
| FX cell | **64×64** | footstep, explosions |
| Far env (ship/orbital) | concept masters OK | not sprite-grid locked |

**Pixels-per-unit (Three.js):** treat 1 world unit = 32 pixels (half tile width). Ortho camera zoom so 1 screen pixel maps to 1 art pixel at target scale — avoid half-pixel camera positions.

**Clean values:** keep character feet on whole pixels; never place sprites at x.5.

## Pivot
- **Characters / drones:** bottom-centre on the feet (or underside of hover drones). Same pivot string for every state so the body does not hop.
- Words: “pivot at the midpoint between the boots on the ground line.”
- Numbers on 64×64 canvas: pivot `(32, 60)` approx (2–4 px above bottom edge) — lock one value and reuse.
- **Tiles:** top-centre of the diamond, or engine tile origin at diamond centre — pick one and hold.
- **FX:** centre of cell `(32, 32)` on 64×64.

## Animation table — player scout
Starting points, not law. Adjust to feel.

| State | Frames | FPS | Loop | Canvas | Pivot | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| idle | 4 | 6 | loop | 64×64 | feet BC | subtle breath / cape; masters exist |
| walk | 4–8 | 10 | loop | 64×64 | feet BC | have 00–03; expand to 6–8 if hitchy |
| run | 8 | 12 | loop | 64×64 | feet BC | not started |
| attack | 4–6 | 12 | once | 64×64 | feet BC | have pose master; need frame strip |
| hit | 2 | 12 | once | 64×64 | feet BC | not started |
| death | 6–8 | 10 | once | 64×64 | feet BC | not started |

Directions: start with **SE** (down-right) only; mirror or redraw for other facings later. Naming still includes direction.

## Animation table — AI drone
| State | Frames | FPS | Loop | Canvas | Pivot | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| hover | 4 | 8 | loop | 48×48 or 64×64 | underside centre | bob thrusters; have still |
| attack | 4 | 12 | once | same | same | have still; strip later |
| death | 6 | 12 | once | same | same | have still; strip later |

## Tilesets
- **Base floor:** single cell 64×32 iso diamond; material = dark stone/tech (spryte floor tile is concept — retarget to diamond footprint).
- **Autotile:** start with **16-tile edge set** (corners + edges + fill). Upgrade to 47-blob only if coasts get complex.
- **Seam rule:** paint overlap in the 1–2 px edge; no unique detail that must meet perfectly on both sides of a seam.
- **Extrude:** 1 px duplicate rim when packing atlases so filtering (if ever on) does not bleed — with NearestFilter still do 1 px padding between atlas cells.
- **Height:** flat walkable only for v1; raised ruin chunks are props, not autotiles.

## Naming
Lower case, no spaces, zero-padded frames:

`subject_state_direction_frame`

Examples:
- `scout_idle_se_00`
- `scout_walk_se_03`
- `scout_attack_se_02`
- `drone_hover_se_01`
- `drone_death_se_05`
- `fx_footstep_00`
- `tile_floor_tech_00`
- `prop_ruin_chunk_a`

## Three.js import (check these by name)
- `texture.magFilter = THREE.NearestFilter`
- `texture.minFilter = THREE.NearestFilter`
- `texture.generateMipmaps = false`
- Prefer `SRGBColorSpace` / correct color space for albedo; don’t let the renderer soft-filter pixels
- Atlas: pack with 1–2 px padding; use a TexturePacker-style or homemade JSON `{frames: {name: {x,y,w,h}}}`
- Sprite / billboard: keep scale on whole pixels; snap position to pixel grid each frame if camera moves
- Unsure of exact helper names in your scene graph — flag and match to your loader

Two settings that always differ vs Unity/Godot: filter/mipmaps naming, and whether pivot is UV-centre or mesh origin — lock pivot in art and set mesh offset once in code.

## Masters vs game
- Spryte outputs ~1024² / 1536×1024 are **masters**.
- Game ships **64×64** (chars/FX) and **64×32** (tiles) via nearest-neighbour only, whole-number scale factors.
- Reject 1.5× scales.

## Out of scope for this spec
UI chrome, fonts, 3D mesh budgets (those live in a model brief if you go full 3D scenes).
