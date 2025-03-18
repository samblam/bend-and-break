// Bend & Break - Main JavaScript File
// Hours 1-2: Scene, Arm, Dummy Setup

// Global variables
let scene, camera, renderer, physicsWorld;
let deltaTime = 0;
const clock = new THREE.Clock();
let tempTransform;

// Initialize the game
function init() {
    // Hide loading message when physics is ready
    const loadingElement = document.getElementById('loading');
    
    // Initialize Ammo.js
    Ammo().then(function() {
        console.log('Ammo.js initialized');
        
        // Hide loading message
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Create transform for physics
        tempTransform = new Ammo.btTransform();
        
        // Setup physics
        setupPhysics();
        
        // Setup scene
        const plane = setupScene();
        
        // Add ground physics
        addGroundPhysics(plane);
        
        // Create ragdoll arm
        const { upperArm, lowerArm } = createRagdollArm();
        
        // Create dummy
        const dummy = createDummy();
        
        // Start animation loop
        animate();
    }).catch(function(error) {
        console.error('Error initializing Ammo.js:', error);
        if (loadingElement) {
            loadingElement.textContent = 'Error loading physics engine. Please refresh the page.';
        }
    });
}

// Setup Three.js scene
function setupScene() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create arena (5x5 white plane)
    const planeGeometry = new THREE.PlaneGeometry(5, 5);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, 0, 0);
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    plane.name = "Ground";
    scene.add(plane);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 1, 0);
    
    // Create lighting
    const light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 10, 0);
    light.castShadow = true;
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 50;
    scene.add(light);
    
    // Add ambient light for better visibility
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    
    // Add resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    return plane;
}

// Setup Ammo.js physics world
function setupPhysics() {
    // Create physics configuration
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const broadphase = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    
    // Create physics world
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    physicsWorld.setGravity(new Ammo.btVector3(0, -7, 0)); // Moderate gravity
}

// Add physics to the ground plane
function addGroundPhysics(plane) {
    const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(2.5, 0.05, 2.5));
    const groundTransform = new Ammo.btTransform();
    groundTransform.setIdentity();
    groundTransform.setOrigin(new Ammo.btVector3(0, -0.05, 0));
    
    const groundMass = 0; // Static object
    const groundLocalInertia = new Ammo.btVector3(0, 0, 0);
    
    const groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
    const groundRbInfo = new Ammo.btRigidBodyConstructionInfo(
        groundMass, groundMotionState, groundShape, groundLocalInertia
    );
    const groundBody = new Ammo.btRigidBody(groundRbInfo);
    
    physicsWorld.addRigidBody(groundBody);
    plane.userData.physicsBody = groundBody;
}

// Create the ragdoll arm with upper and lower segments
function createRagdollArm() {
    // Create upper arm
    const upperArmGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const upperArmMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    upperArm.position.set(0, 2, 0);
    upperArm.castShadow = true;
    upperArm.name = "UpperArm";
    scene.add(upperArm);
    
    // Create upper arm physics
    const upperArmShape = new Ammo.btBoxShape(new Ammo.btVector3(0.25, 0.5, 0.25));
    const upperArmTransform = new Ammo.btTransform();
    upperArmTransform.setIdentity();
    upperArmTransform.setOrigin(new Ammo.btVector3(0, 2, 0));
    
    const upperArmMass = 0.4;
    const upperArmLocalInertia = new Ammo.btVector3(0, 0, 0);
    upperArmShape.calculateLocalInertia(upperArmMass, upperArmLocalInertia);
    
    const upperArmMotionState = new Ammo.btDefaultMotionState(upperArmTransform);
    const upperArmRbInfo = new Ammo.btRigidBodyConstructionInfo(
        upperArmMass, upperArmMotionState, upperArmShape, upperArmLocalInertia
    );
    const upperArmBody = new Ammo.btRigidBody(upperArmRbInfo);
    
    // Add initial angular velocity to make the arm move
    upperArmBody.setAngularVelocity(new Ammo.btVector3(0, 0, 1));
    
    physicsWorld.addRigidBody(upperArmBody);
    upperArm.userData.physicsBody = upperArmBody;
    
    // Create lower arm
    const lowerArmGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const lowerArm = new THREE.Mesh(lowerArmGeometry, upperArmMaterial);
    lowerArm.position.set(0, 1, 0);
    lowerArm.castShadow = true;
    lowerArm.name = "LowerArm";
    scene.add(lowerArm);
    
    // Create lower arm physics
    const lowerArmShape = new Ammo.btBoxShape(new Ammo.btVector3(0.25, 0.5, 0.25));
    const lowerArmTransform = new Ammo.btTransform();
    lowerArmTransform.setIdentity();
    lowerArmTransform.setOrigin(new Ammo.btVector3(0, 1, 0));
    
    const lowerArmMass = 0.2;
    const lowerArmLocalInertia = new Ammo.btVector3(0, 0, 0);
    lowerArmShape.calculateLocalInertia(lowerArmMass, lowerArmLocalInertia);
    
    const lowerArmMotionState = new Ammo.btDefaultMotionState(lowerArmTransform);
    const lowerArmRbInfo = new Ammo.btRigidBodyConstructionInfo(
        lowerArmMass, lowerArmMotionState, lowerArmShape, lowerArmLocalInertia
    );
    const lowerArmBody = new Ammo.btRigidBody(lowerArmRbInfo);
    
    // Add initial angular velocity to make the arm move
    lowerArmBody.setAngularVelocity(new Ammo.btVector3(0, 0, 0.5));
    
    physicsWorld.addRigidBody(lowerArmBody);
    lowerArm.userData.physicsBody = lowerArmBody;
    
    // Create shoulder joint (fixed to world)
    // Create a fixed body for the shoulder anchor point
    const shoulderAnchorShape = new Ammo.btSphereShape(0.1); // Small sphere
    const shoulderAnchorTransform = new Ammo.btTransform();
    shoulderAnchorTransform.setIdentity();
    shoulderAnchorTransform.setOrigin(new Ammo.btVector3(0, 2.5, 0)); // Fixed point above upper arm
    
    const shoulderAnchorMass = 0; // Static object
    const shoulderAnchorInertia = new Ammo.btVector3(0, 0, 0);
    
    const shoulderAnchorMotionState = new Ammo.btDefaultMotionState(shoulderAnchorTransform);
    const shoulderAnchorRbInfo = new Ammo.btRigidBodyConstructionInfo(
        shoulderAnchorMass, shoulderAnchorMotionState, shoulderAnchorShape, shoulderAnchorInertia
    );
    const shoulderAnchorBody = new Ammo.btRigidBody(shoulderAnchorRbInfo);
    
    physicsWorld.addRigidBody(shoulderAnchorBody);
    
    // Create shoulder joint between anchor and upper arm
    const shoulderPivotInA = new Ammo.btVector3(0, 0, 0); // Pivot in anchor local space
    const shoulderPivotInB = new Ammo.btVector3(0, 0.5, 0); // Pivot in upper arm local space
    
    const shoulderAxisInA = new Ammo.btVector3(1, 0, 0); // X-axis rotation
    const shoulderAxisInB = new Ammo.btVector3(1, 0, 0); // X-axis rotation
    
    const shoulderHinge = new Ammo.btHingeConstraint(
        shoulderAnchorBody,
        upperArmBody,
        shoulderPivotInA,
        shoulderPivotInB,
        shoulderAxisInA,
        shoulderAxisInB,
        false // Don't use reference frame A
    );
    
    shoulderHinge.setLimit(-Math.PI / 4, Math.PI / 2); // -45° to 90°
    shoulderHinge.enableAngularMotor(false, 0, 0.1); // Disable motor initially
    physicsWorld.addConstraint(shoulderHinge, true);
    
    // Create elbow joint
    const elbowPivotInA = new Ammo.btVector3(0, -0.5, 0); // Pivot in upper arm
    const elbowAxisInA = new Ammo.btVector3(1, 0, 0);     // X-axis rotation
    
    const elbowPivotInB = new Ammo.btVector3(0, 0.5, 0);  // Pivot in lower arm
    const elbowAxisInB = new Ammo.btVector3(1, 0, 0);     // X-axis rotation
    
    const elbowHinge = new Ammo.btHingeConstraint(
        upperArmBody,
        lowerArmBody,
        elbowPivotInA,
        elbowPivotInB,
        elbowAxisInA,
        elbowAxisInB,
        false // Don't use reference frame A
    );
    
    elbowHinge.setLimit(-Math.PI / 6, Math.PI * 2 / 3); // -30° to 120°
    elbowHinge.enableAngularMotor(false, 0, 0.1); // Disable motor initially
    physicsWorld.addConstraint(elbowHinge, true);
    
    return { upperArm, lowerArm };
}

// Create the static dummy target
function createDummy() {
    // Create dummy visual
    const dummyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const dummyMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const dummy = new THREE.Mesh(dummyGeometry, dummyMaterial);
    dummy.position.set(2, 1, 0);
    dummy.castShadow = true;
    dummy.receiveShadow = true;
    dummy.name = "Dummy";
    scene.add(dummy);
    
    // Create dummy physics
    const dummyShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 1, 0.5));
    const dummyTransform = new Ammo.btTransform();
    dummyTransform.setIdentity();
    dummyTransform.setOrigin(new Ammo.btVector3(2, 1, 0));
    
    const dummyMass = 2;
    const dummyLocalInertia = new Ammo.btVector3(0, 0, 0);
    dummyShape.calculateLocalInertia(dummyMass, dummyLocalInertia);
    
    const dummyMotionState = new Ammo.btDefaultMotionState(dummyTransform);
    const dummyRbInfo = new Ammo.btRigidBodyConstructionInfo(
        dummyMass, dummyMotionState, dummyShape, dummyLocalInertia
    );
    const dummyBody = new Ammo.btRigidBody(dummyRbInfo);
    
    physicsWorld.addRigidBody(dummyBody);
    dummy.userData.physicsBody = dummyBody;
    
    return dummy;
}

// Frame counter for debugging
let frameCount = 0;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    deltaTime = clock.getDelta();
    
    // Step physics simulation
    physicsWorld.stepSimulation(deltaTime, 10, 1/60);
    
    // Update object positions and rotations based on physics
    scene.children.forEach(child => {
        if (child.userData.physicsBody) {
            const body = child.userData.physicsBody;
            const ms = body.getMotionState();
            if (ms) {
                ms.getWorldTransform(tempTransform);
                const pos = tempTransform.getOrigin();
                const quat = tempTransform.getRotation();
                child.position.set(pos.x(), pos.y(), pos.z());
                child.quaternion.set(quat.x(), quat.y(), quat.z(), quat.w());
                
                // Log position for debugging (only for the first few frames)
                if (frameCount < 10) {
                    console.log(`${child.name || 'Object'} position: (${pos.x().toFixed(2)}, ${pos.y().toFixed(2)}, ${pos.z().toFixed(2)})`);
                }
            }
        }
    });
    
    // Increment frame counter
    frameCount++;
    
    // Render scene
    renderer.render(scene, camera);
}

// Start the game
init();