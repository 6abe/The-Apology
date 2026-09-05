# Style Guide — proposal (not locked)

Hi-bit cyberpunk isometric action RPG. AI drones, huge ships/orbitals, ancient worlds. Medium: hi-bit pixel look via 3D rendered to 2D. Engine: web / Three.js. Grid default: 16×16 tiles, 32×32 character canvas (may bump for iso readability).

## Three pillars
1. Dark first — brightness is scarce; light and FX earn every pixel.
2. Motion sells — animation and impact FX carry combat feel more than static detail.
3. Scale contrast — intimate drones vs monumental ships/orbitals vs buried ancient forms.

## Perspective and camera
True isometric action RPG camera. Pixel diagonals use 2:1 (2 horizontal : 1 vertical). Characters Y-sorted for depth. Default light bias from upper-left unless a scene light says otherwise.

## Palette (proposal)
Every colour has a hex and a role. Bright accents are sparse against dark grounds.

| Name | Hex | Role |
| --- | --- | --- |
| void | `#070B12` | base / bg |
| fog | `#141C28` | atmosphere |
| deep_shadow | `#0A1218` | bg shadow wells |
| stone | `#2C3544` | ancient base |
| stone_mid | `#4A5568` | ancient mid |
| hull | `#5C6778` | ship metal |
| hull_hi | `#9AA6B8` | metal highlight |
| teal_shadow | `#0E3A42` | cool shadow |
| cyan | `#1AE8FF` | light / FX |
| magenta | `#FF2B8A` | danger / FX |
| amber | `#FFB020` | UI / warn |
| relic | `#C9A227` | ancient accent |
| read | `#E8EEF7` | readable light |

## Line and outline
Hard pixel edges from the hi-bit / render-to-pixel pipeline. Thin dark outline only where silhouette fails at game size — prefer value separation over thick black rims. No soft anti-aliased painterly edges on gameplay sprites.

## Light and shadow
Atmosphere darker than most ARPG art. Heavy lighting effects: emissive panels, volumetric shafts, bloom-style glows as discrete pixel clusters (not photo blur). Shadow-filled, visually complex backgrounds are allowed and expected — characters, drones, and FX must still punch through with higher value and clearer silhouettes. One primary light direction per beat; secondary neon is accent only.

## Detail budget
- Backgrounds: high density OK (cables, ruin relief, hull plating) as long as mid-values stay in shadow wells.
- Characters / drones: cleaner silhouettes, fewer mid-tones, readable at 32×32.
- Ships / orbitals: big readable masses first; surface noise second.
- Animation frames: prioritize pose clarity over micro-detail.

## FX language
Signature: geometric and pixel explosion effects — shards, cubes, diamond bursts, stepped pixel sprays. Hit confirms, deaths, and ability pops use this language before soft smoke. Keep FX on cyan / magenta / amber / read; do not flood the whole scene with neon.

## Readability at target size
Must read at game size (32×32 character on web; phone later). Downscale test every hero asset. Complex backgrounds never steal the player silhouette or the active FX burst.

## Out of bounds
- Flat daylight / high-key scenes as default look
- Soft painterly anti-alias on combat sprites
- Competing neon everywhere (cyberpunk overload)
- Pure 2D side-view drift
- Tracing or shipping another game's characters or exact frames
- Photoreal PBR without the hi-bit pixel pass

## References (direction only — never copy or trace)
1. [Hyper Light Drifter](https://store.steampowered.com/app/257850/Hyper_Light_Drifter/) — scarce brightness, dark grounds, saturated accents; hand-animated everything.
2. [Hyper Light Drifter look notes](https://designbycurio.com/learn/hyper-light-drifter-2016) — palette scarcity vs neon overload.
3. [ANNO: Mutationem](https://store.steampowered.com/app/1368030/ANNO_Mutationem/) — pixel + 3D cyberpunk mix; dark neon city.
4. [CyberCorp](https://store.steampowered.com/app/1116170/CyberCorp/) — isometric cyberpunk action framing and combat readability.
5. [Satellite Reign](https://store.steampowered.com/app/318230/Satellite_Reign/) — rain-soaked isometric cyber city, neon as sparse practical light.
6. [Eastward art notes](https://videocue.io/looks/eastward-painterly-pixel) — hi-bit environmental density (take density language, not the warm palette).
