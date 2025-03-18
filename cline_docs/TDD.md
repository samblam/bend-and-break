Bend & Break - Ultra-Lean MVP Technical Design Document (TDD)
Version: 1.0
Date: March 18, 2025
Prepared By: [Your Name]
Target Platform: Mobile Web (Browser-Based)
Engine: Three.js (Rendering) + Ammo.js (Physics)
Input Handling: DOM Events (Button-Based)
Storage: None
Jam: 2025 Vibe Coding Game Jam (80% AI-Coded Requirement)
Development Time: 1 Day (6-8 Hours)  
Table of Contents
System Architecture  

Rendering System  

Physics System  

Input System  

Time Control System  

UI System  

Performance Optimizations  

Development Plan

1. System Architecture
1.1 Overview
This MVP is a barebones mobile-web game using Three.js for 3D rendering and Ammo.js for physics. It includes a single ragdoll arm (two segments) and a static dummy, with button-based input, time control, and a basic UI. The focus is on swinging the arm to knock the dummy over, with no AI or extra features.
1.2 Core Systems
Rendering: Three.js for scene, arm, and dummy.  

Physics: Ammo.js for arm movement and dummy collision.  

Input: DOM buttons for joint tweaks.  

Time Control: Freezes time during adjustments, resolves on commit.  

UI: Buttons and hit feedback.

1.3 Game Loop
Runs at 60 FPS:  
Process button clicks.  

Update time state.  

Step physics with timeScale.  

Render scene.  

Refresh UI.

javascript

function gameLoop() {
  const delta = clock.getDelta();
  inputSystem.process();
  timeControlSystem.update();
  physicsSystem.step(delta * timeControlSystem.timeScale);
  renderingSystem.update();
  uiSystem.refresh();
  requestAnimationFrame(gameLoop);
}

2. Rendering System
2.1 Scene Setup
Scene: THREE.Scene named scene.  

Arena: PlaneGeometry(5, 5), MeshLambertMaterial({ color: 0xaaaaaa }), at [0, 0, 0], rotated [-Math.PI/2, 0, 0].  

Camera: PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000), at [0, 5, 10], targeting [0, 0, 0].  

Lighting: DirectionalLight(0xffffff, 1.0) at [0, 10, 0].  

Renderer: WebGLRenderer({ antialias: true }), appended to <body>.

2.2 Arm and Dummy Rendering
Arm:  
Upper: BoxGeometry(0.5, 1, 0.5), MeshPhongMaterial({ color: 0xff0000 }), mass 0.3 kg.  

Lower: BoxGeometry(0.5, 1, 0.5), MeshPhongMaterial({ color: 0xff0000 }), mass 0.2 kg.

Dummy:  
Torso: BoxGeometry(1, 2, 1), MeshPhongMaterial({ color: 0x0000ff }), mass 2 kg.

Sync: Update position/quaternion from btRigidBody transforms.

2.3 Visual Effects
Hit Flash: Tween dummy material to 0xff5555 and back over 0.2s on collision.

3. Physics System
3.1 Physics World
Setup: Ammo.btDiscreteDynamicsWorld.  

Gravity: [0, -5, 0] m/s².  

Components: btDefaultCollisionConfiguration, btCollisionDispatcher, btDbvtBroadphase, btSequentialImpulseConstraintSolver.  

Ground: Static btRigidBody, btBoxShape(btVector3(2.5, 0.05, 2.5)), mass 0, at [0, -0.05, 0].

3.2 Arm and Dummy Physics
Arm:  
Upper: btBoxShape(btVector3(0.25, 0.5, 0.25)), mass 0.3 kg, fixed shoulder pivot at [0, 2, 0].  

Lower: btBoxShape(btVector3(0.25, 0.5, 0.25)), mass 0.2 kg.

Joints:  
Shoulder: btHingeConstraint, pivot [0, 2, 0] (fixed) and [0, -0.5, 0] (upper arm), axis [1, 0, 0], limits [0, Math.PI/2].  

Elbow: btHingeConstraint, pivot [0, -0.5, 0] (upper) and [0, 0.5, 0] (lower), axis [1, 0, 0], limits [0, Math.PI/2].

Dummy: btBoxShape(btVector3(0.5, 1, 0.5)), mass 2 kg, starts at [2, 1, 0].

3.3 Collision Detection and Response
Hit Detection: Arm collides with dummy at ≥5 m/s.  

Response: Apply force velocity * 10 N to dummy.  

Win Condition: Dummy center y < 0 (head hits floor), reset scene.

4. Input System
4.1 Button-Based Controls
UI:  
<div class="button" data-action="upper_+10">Upper +10°</div>  

<div class="button" data-action="upper_-10">Upper -10°</div>  

<div class="button" data-action="lower_+10">Lower +10°</div>  

<div class="button" data-action="lower_-10">Lower -10°</div>  

<div id="commit-button">Commit</div>

Logic:  
Click adjusts joint angle (±10°).  

Commit triggers resolution.

Feedback: Arm material to 0xff5555 during adjustment, back on commit.

5. Time Control System
5.1 Time States
Idle: timeScale = 0.  

Adjusting: timeScale = 0 (on tweak).  

Resolving: timeScale = 1 (1s after commit).  

Transitions:  
Tweak: Idle → Adjusting.  

Commit: Adjusting → Resolving.  

After 1s: Resolving → Idle.

5.2 Time Scale Management
Physics: world.stepSimulation(delta * timeScale, 10, 1/60).

6. UI System
6.1 DOM Elements
Buttons: 60x60px, position: absolute, bottom-aligned in a row.  

Feedback: Arm color change on adjust, dummy flash on hit.

7. Performance Optimizations
Assets: No textures, inline code (<1MB).  

Physics: Single arm and dummy, no extra objects.  

Rendering: No shadows or complex effects.

8. Development Plan
8.1 One-Day Sprint (March 18, 2025)
Hours 1-2: Scene, arm, dummy setup (AI: Three.js/Ammo.js).  

Hours 3-4: Buttons, time control, hit detection (AI: DOM/logic).  

Hours 5-6: Win condition, UI feedback, mobile test (AI: 4-5 hours, Human: 1-2 hours).  

Buffer (0-1 Hour): Fix physics or reset bugs.

8.2 AI Coding Split
80% AI: Scene, arm, dummy, buttons, time, hit, win (~4-5 hours of prompts).  

20% Human: Debug joints, test mobile (~1-2 hours).

8.3 AI Prompts
“Generate Three.js scene with 5x5 plane, camera, light, and Ammo.js arm (2 segments, hinges at [0, 2, 0]) plus dummy torso at [2, 1, 0].”  

“Create DOM buttons (Upper ±10°, Lower ±10°, Commit) and joint tweak logic with time states (idle/adjust/resolving).”  

“Implement Ammo.js collision detection (≥5 m/s, force = velocity * 10 N) and win condition (dummy y < 0) with reset.”

