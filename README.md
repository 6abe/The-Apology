# The-Apology

Hi-bit cyberpunk isometric action RPG (Vite + React + TypeScript + React Three Fiber + Three.js + GLSL).

Agreed art from Game Art Director / spryte lives under `public/assets/agreed/`.

## Run the scene

Prototype v0 is one pad, a scout, and two brute drones.

1. Install dependencies.

```
npm install
```

2. Start the dev server. Open http://localhost:5173.

```
npm run dev
```

3. Typecheck.

```
npm run typecheck
```

4. Build and preview the production bundle.

```
npm run build
npm run preview
```

### Controls

- Move: WASD or arrows (world X/Y under a locked ortho camera)
- Attack: Space or left mouse
- Death resets the pad after a short hold on the death still

### Agreed assets used

Idle, attack, hit, and death still hold one SE pose. Walk cycles the `f00`–`f07` strip.

| Role | Path |
| --- | --- |
| Scout idle | `scout/scout_idle_se_30.png` |
| Scout walk | `scout/scout_walk_se_f00.png` … `scout_walk_se_f07.png` |
| Scout walk fallback | `scout/scout_walk_se_33.png` |
| Scout attack | `scout/scout_attack_se_33.png` |
| Scout hit | `scout/scout_hit_se_33.png` |
| Scout death | `scout/scout_death_se_29.png` |
| Brute hover / move / hit | `enemies/enemy_drone_brute_hover_se_31.png` |
| Brute attack | `enemies/enemy_drone_brute_attack_se_28.png` |
| Brute death | `enemies/enemy_drone_brute_death_se_04.png` |
| Floor | `tiles/tile_fill_30.png` |
| Hazard | `tiles/tile_hazard_28.png` |
| Crate | `props/prop_crate_tech_05.png` |
| Ammo crate | `props/prop_ammo_crate_25.png` |

### Art gaps

- Walk strip is in. Softs on some frames (eyes soft or circular, slight chibi vs `walk_33`) are fine for v0. Missing strip frames fall back to `scout_walk_se_33`.
- Brute has no hit still. Hit keeps the hover pose.
- Ally `drone_*` is out of scope.
- 1024² keepers are nearest-neighbour downscaled to the 64×64 character contract at load. The floor keeper stays 1024² and sits at 32 px/unit.

If a keeper is missing or the size is not a whole-number multiple of the contract, the same 64×64 quad draws an 8 px checker with one cyan cell and the console prints the reason.
