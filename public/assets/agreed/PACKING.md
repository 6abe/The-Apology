# Packing rules — The Apology art

## Source of truth
- Notion hub: https://app.notion.com/p/3d1b8aa34ddb81ad87f2f927697affe3?pvs=204
- Spec: https://app.notion.com/p/3d1b8aa34ddb81e28dd4d87d06917cac?pvs=204
- Shot list: https://app.notion.com/p/3d1b8aa34ddb81a3b06fc45b8c76c7bd?pvs=204
- Masters on art director box: `/workspace/game-art/agreed/`

## Grid
- Character / FX game size: **64×64**
- Iso floor tile: **64×32** diamond (2:1)
- Masters: ~1024² (chars/FX) or 1024×512 (tiles) or 1536×1024 (far env)
- Scale masters → game with **nearest-neighbour only**, whole-number factors only (no 1.5×)

## Engine (Three.js / R3F)
- `NearestFilter` mag + min
- `generateMipmaps = false`
- 1–2 px atlas padding
- Pivot: characters bottom-centre on feet; FX centre; tiles diamond centre
- Snap sprite positions to whole pixels

## Naming
`subject_state_direction_frame` e.g. `scout_walk_se_03`

## Agreed keepers (ship these)
See MANIFEST.txt under agreed/. Prefer latest named files over older batch1/2 duplicates.
