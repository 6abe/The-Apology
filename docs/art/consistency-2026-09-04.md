# Consistency report — 2026-09-04

Assets: player still + 3 clips from Grok Imagine.

## Still (player)
- Pass: isometric scout, void bg (~87% near-black), cyan near #1AE8FF, hard silhouette.
- Drift: magenta denser/darker than locked #FF2B8A; 1408² concept scale — needs 32×32 downscale test; backpack detail may collapse at game size.

## Clip — orbit
- Breaks build/look: camera orbits into side profile; pixel morph/soft edges from warp. Mood only, not sprite ref.

## Clip — sword stance
- Pass: fixed isometric; pose readable; dark void.
- Drift: soft AA glow on sword; sparks instead of geometric/pixel explosions.

## Clip — walk
- Pass: fixed isometric; dark tiles; geometric cyan footstep splash + floating pixel particles; strong silhouette.
- Drift: cape morphing (AI frame blend); backpack bloom soft edges; neon count bordering overload.

## Ranked keepers
1. Still (character design lock)
2. Walk clip (animation + FX direction)
3. Sword stance (pose only; rewrite FX)
4. Orbit (reject for sprite pipeline)

## Fix worth doing first
Rewrite attack prompt: geometric cyan/magenta cube+diamond burst, hard pixel edges, no soft bloom, fixed isometric, void ground.
