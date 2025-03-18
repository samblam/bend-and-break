# Product Context: Bend & Break

## Why This Project Exists
Bend & Break is being developed for the 2025 Vibe Coding Game Jam, which requires 80% AI-coded content. The project aims to create a physics-based fighting game that combines elements of time manipulation and ragdoll physics in a mobile-friendly web format.

## What Problems It Solves
- Creates an accessible physics-based fighting game that works on mobile browsers
- Provides a unique gameplay experience through time manipulation (freezing time during adjustments)
- Delivers a satisfying physics-based combat system with minimal controls
- Meets the requirements of the game jam while being achievable within a tight timeframe

## How It Should Work
The game follows a simple core loop:

1. **Adjust Phase**: Player manipulates joint angles of a ragdoll arm while time moves slowly (TimeScale = 0.1)
2. **Commit Phase**: Player commits to their adjustments
3. **Resolution Phase**: Physics resolves for 1 second, potentially causing the arm to hit the dummy
4. **Win Condition**: If the dummy torso's top hits the floor, the player wins

### Core Mechanics
- **Ragdoll Physics**: One arm with upper and lower segments, hinged at shoulder and elbow
- **Time Control**: Time moves slowly during adjustments (TimeScale = 0.1), then resolves at normal speed when committed
- **Button Controls**: Simple +/- buttons to adjust joint angles in 10° increments
- **Physics-Based Combat**: Arm collides with dummy at ≥5 m/s, applies force
- **Win Condition**: Knock the dummy torso's top to the floor (y < 0)

### MVP vs. Full Version
The current focus is on an ultra-lean MVP that includes:
- One controllable arm (upper and lower segments)
- A static dummy target (single torso block)
- Simple button controls (gesture controls deferred to full version)
- Time manipulation mechanics
- Basic win condition

The full version (potential future development) would expand to include:
- Complete ragdolls with all limbs
- Dual control schemes (button-based and gesture-based)
- Enhanced single-player with AI opponents, missions, and progression
- Optional multiplayer mode
- Visual indicators for motion and strength
- Limb shattering mechanics