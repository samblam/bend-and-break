Bend & Break - Ultra-Lean MVP Game Design Document (GDD)
Version: 1.0
Date: March 18, 2025
Prepared By: [Your Name]
Target Platform: Mobile Web (Browser-Based)
Development Time: 1 Day (6-8 Hours)
Jam Context: 2025 Vibe Coding Game Jam (80% AI-Coded Requirement)  
1. Executive Summary
This ultra-lean MVP is a mobile-web game where you control a single ragdoll arm to punch a static dummy. Time freezes while you adjust the arm’s joints, then resolves when you commit, aiming to knock the dummy over. It’s a single-player "hit-the-target" game—no AI opponent, no limb shattering, just the core of ragdoll control, time manipulation, and a win condition.
Key Highlights:  
One Arm: Simple button controls for one ragdoll arm.  

Time Freeze: Adjust, commit, resolve.  

Win Condition: Knock the dummy’s head to the floor.

2. Game Overview
2.1 Concept
You manipulate one ragdoll arm (upper and lower segments) using buttons to set joint angles. Time is frozen during adjustments; press "Commit" to let physics resolve for 1 second. The arm swings at a static dummy (a torso block). If the dummy’s head hits the floor (y < 0), you win, and the game resets. No opponent AI—just a physics sandbox withFacades a clear goal.
2.2 Unique Selling Points (USPs)
Physics-based arm swinging with time-freeze control.  

Minimalist "knock it over" challenge.  

Mobile-optimized, instant-play.

2.3 Target Audience
Game jam testers looking for a quick physics toy.  

Casual players for basic feedback.

3. Core Mechanics
3.1 Ragdoll Structure
Player Arm:  
Upper Arm: 0.5x1x0.5 box (0.3 kg), hinged at shoulder (fixed point at [0, 2, 0]).  

Lower Arm: 0.5x1x0.5 box (0.2 kg), hinged at elbow.

Dummy:  
Torso: 1x2x1 box (2 kg), free-standing at [2, 1, 0].

Joints:  
Shoulder: Hinge (X-axis), 0°–90°.  

Elbow: Hinge (X-axis), 0°–90°.

Physics: Gravity (-5 m/s²).

3.2 Joint Manipulation
Control Scheme: Button-Based  
Buttons (60px, bottom screen):  
"Upper +10°" / "Upper -10°" (shoulder).  

"Lower +10°" / "Lower -10°" (elbow).  

"Commit".

Feedback: Arm turns red during adjustment.

3.3 Time Mechanics
States:  
Idle: TimeScale = 0.  

Adjusting: TimeScale = 0 (on tweak).  

Resolving: TimeScale = 1 (1s after commit).

Flow: Adjust → Commit → Resolve → Idle.

3.4 Physics-Based Combat
Hit Detection: Arm collides with dummy at ≥5 m/s, applies force (velocity * 10 N).  

Win Condition: Dummy head (top of torso) hits floor (y < 0).  

Feedback: Dummy flashes red on hit.

4. Single-Player Mode
4.1 Setup
Objective: Knock the dummy over.  

Gameplay:  
One arm at [0, 2, 0], dummy at [2, 1, 0].  

Adjust arm, commit, watch it swing.

End: Dummy KO’d (win) → reset.

5. Visual and Audio Design
5.1 Art Style
Arena: 5x5 white plane.  

Arm: Red low-poly (2 segments).  

Dummy: Blue low-poly torso.  

Effects: Red flash on hit.

5.2 User Interface (UI)
Buttons: 5x 60px buttons (bottom screen).  

Feedback: Arm red during adjust, dummy red on hit.

5.3 Audio
None.

6. Technical Requirements
6.1 Tools
Rendering: Three.js.  

Physics: Ammo.js.  

AI Coding: 80% via Claude.

6.2 Performance Targets
FPS: 30+ on mid-tier mobile.  

Load: <1s, <1MB.

7. Development Plan
7.1 One-Day Sprint (6-8 Hours)
Hours 1-2: Scene, arm, dummy (AI).  

Hours 3-4: Buttons, time control, hit detection (AI).  

Hours 5-6: Win condition, UI feedback, test (AI/Human).  

Buffer (0-1 Hour): Fix physics bugs.

7.2 AI Coding Split
80% AI: Scene, arm, buttons, time, hit (~4-6 hours).  

20% Human: Debug, test (~1-2 hours).

