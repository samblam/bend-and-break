# Technical Context: Bend & Break

## Technologies Used

### Core Technologies
- **Three.js**: 3D rendering library for creating and displaying the game scene
- **Ammo.js**: Physics engine (WebAssembly port of Bullet Physics) for ragdoll physics simulation
- **JavaScript**: Primary programming language for game logic and systems
- **HTML/CSS**: For UI elements and styling

### Development Tools
- **Git**: Version control system for tracking changes
- **Claude AI**: Used for 80% of the code generation as per game jam requirements

## Development Setup

### Project Structure
```
/
├── index.html          # Main HTML entry point
├── styles/
│   └── main.css        # CSS styles for UI elements
├── scripts/
│   ├── main.js         # Entry point and game initialization
│   ├── systems/
│   │   ├── rendering.js    # Three.js scene setup and rendering
│   │   ├── physics.js      # Ammo.js physics simulation
│   │   ├── input.js        # Button controls and input handling
│   │   ├── timeControl.js  # Time state management
│   │   └── ui.js           # UI creation and updates
│   └── utils/
│       └── helpers.js      # Utility functions
└── assets/
    └── audio/             # Audio files (if implemented)
```

### Development Environment
- Modern web browser with WebGL support
- Local development server for testing
- Mobile device or emulator for testing touch controls

## Technical Constraints

### Performance Targets
- **FPS**: 30+ on mid-tier mobile devices (2020 models)
- **Load Time**: <1 second
- **Total Size**: <1MB

### Mobile Optimization
- Touch-friendly UI with appropriately sized buttons (60px)
- Responsive design that works across different screen sizes
- Minimal DOM manipulation to avoid performance issues

### Physics Limitations
- Simplified physics model with only essential constraints
- Limited number of rigid bodies (one arm + one dummy torso block)
- Reduced simulation complexity to maintain performance
- TimeScale = 0.1 during adjustments, 1.0 during resolution

### Browser Compatibility
- Target browsers: Chrome, Safari, Firefox (latest versions)
- WebGL 1.0 support required
- No reliance on experimental web features

## AI Coding Split
- **80% AI-Generated**: Scene setup, arm creation, physics configuration, button controls, time control, hit detection (~4-6 hours)
- **20% Human-Coded**: Debugging physics issues, testing on mobile, performance optimization (~1-2 hours)

## Deployment Strategy
- Static site hosting (e.g., GitHub Pages, Netlify)
- No backend requirements
- All assets bundled with the application

## Technical Debt Considerations
- The MVP implementation prioritizes speed over extensibility
- Future expansion to the full version would require refactoring some systems
- Physics system may need optimization for handling multiple ragdolls in the full version