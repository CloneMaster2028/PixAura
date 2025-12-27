// State
const state = {
    camera: null,
    hands: null,
    scene: null,
    camera3d: null,
    renderer: null,
    particles: null,
    geometry: null,
    material: null,
    handPosition: { x: 0, y: 0 },
    isPinching: false,
    expandFactor: 1,
    targetExpand: 1,
    rotationSpeed: { x: 0, y: 0 }
};

// Config
const CONFIG = {
    particleCount: 15000,
    spiralArms: 5,
    spiralTightness: 0.3,
    maxRadius: 3,
    expandSpeed: 0.05,
    rotationDamping: 0.95,
    pinchThreshold: 0.05
};

// Initialize
async function init() {
    try {
        await setupCamera();
        setupThreeJS();
        setupMediaPipe();
        setupEventListeners();
        animate();
        hideLoading();
        updateStatus('Ready', true);
    } catch (error) {
        console.error('Initialization error:', error);
        showToast('Error: ' + error.message);
        updateStatus('Error', false);
    }
}

// Setup Camera
async function setupCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
    });
    video.srcObject = stream;
    
    return new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
    });
}

// Setup Three.js
function setupThreeJS() {
    const container = document.getElementById('container');
    
    // Scene
    state.scene = new THREE.Scene();
    
    // Camera
    state.camera3d = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    state.camera3d.position.z = 5;
    
    // Renderer
    state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.setClearColor(0x0f0f23, 1);
    container.appendChild(state.renderer.domElement);
    
    // Create Particles
    createParticles();
    
    // Resize handler
    window.addEventListener('resize', onResize);
}

// Create Particles
function createParticles() {
    const positions = new Float32Array(CONFIG.particleCount * 3);
    const colors = new Float32Array(CONFIG.particleCount * 3);
    
    for (let i = 0; i < CONFIG.particleCount; i++) {
        const i3 = i * 3;
        const t = Math.random();
        const angle = t * Math.PI * 2 * CONFIG.spiralArms;
        const radius = t * CONFIG.maxRadius;
        const armOffset = (i % CONFIG.spiralArms) * (Math.PI * 2 / CONFIG.spiralArms);
        
        positions[i3] = Math.cos(angle + armOffset) * radius;
        positions[i3 + 1] = (Math.random() - 0.5) * 0.5;
        positions[i3 + 2] = Math.sin(angle + armOffset) * radius;
        
        // Color based on distance from center
        const hue = (t * 0.3 + 0.5) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    state.geometry = new THREE.BufferGeometry();
    state.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    state.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    state.material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    state.particles = new THREE.Points(state.geometry, state.material);
    state.scene.add(state.particles);
}

// Setup MediaPipe
function setupMediaPipe() {
    const hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });
    
    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
    });
    
    hands.onResults(onHandResults);
    
    state.hands = hands;
    
    const video = document.getElementById('video');
    state.camera = new Camera(video, {
        onFrame: async () => {
            await hands.send({ image: video });
        },
        width: 640,
        height: 480
    });
    
    state.camera.start();
}

// Hand Results
function onHandResults(results) {
    const canvas = document.getElementById('videoCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = results.image.width;
    canvas.height = results.image.height;
    
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Draw hand
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {color: '#00ff00', lineWidth: 2});
        drawLandmarks(ctx, landmarks, {color: '#ff0000', lineWidth: 1});
        
        // Get hand position (palm center)
        const palmCenter = landmarks[9];
        state.handPosition.x = (palmCenter.x - 0.5) * 2;
        state.handPosition.y = -(palmCenter.y - 0.5) * 2;
        
        // Detect pinch
        const thumb = landmarks[4];
        const index = landmarks[8];
        const distance = Math.sqrt(
            Math.pow(thumb.x - index.x, 2) + 
            Math.pow(thumb.y - index.y, 2)
        );
        
        const wasPinching = state.isPinching;
        state.isPinching = distance < CONFIG.pinchThreshold;
        
        if (state.isPinching && !wasPinching) {
            state.targetExpand = state.targetExpand === 1 ? 2 : 1;
            showToast(state.targetExpand === 2 ? 'Expanding!' : 'Contracting!');
        }
        
        // Update rotation based on hand movement
        state.rotationSpeed.y = state.handPosition.x * 0.02;
        state.rotationSpeed.x = state.handPosition.y * 0.02;
    }
    
    ctx.restore();
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    if (state.particles) {
        // Smooth expand
        state.expandFactor += (state.targetExpand - state.expandFactor) * CONFIG.expandSpeed;
        state.particles.scale.setScalar(state.expandFactor);
        
        // Rotation
        state.particles.rotation.y += state.rotationSpeed.y;
        state.particles.rotation.x += state.rotationSpeed.x;
        
        // Damping
        state.rotationSpeed.x *= CONFIG.rotationDamping;
        state.rotationSpeed.y *= CONFIG.rotationDamping;
        
        // Color cycle on pinch
        if (state.isPinching) {
            const colors = state.geometry.attributes.color;
            const time = Date.now() * 0.001;
            for (let i = 0; i < colors.count; i++) {
                const hue = (i / colors.count + time * 0.1) % 1;
                const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
                colors.setXYZ(i, color.r, color.g, color.b);
            }
            colors.needsUpdate = true;
        }
    }
    
    state.renderer.render(state.scene, state.camera3d);
}

// Event Listeners
function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                state.targetExpand = state.targetExpand === 1 ? 2 : 1;
                showToast(state.targetExpand === 2 ? 'Expanding!' : 'Contracting!');
                break;
            case 'r':
                resetView();
                break;
        }
    });
}

// Utilities
function onResize() {
    state.camera3d.aspect = window.innerWidth / window.innerHeight;
    state.camera3d.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}

function resetView() {
    state.particles.rotation.set(0, 0, 0);
    state.rotationSpeed = { x: 0, y: 0 };
    state.targetExpand = 1;
    showToast('View reset!');
}

function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
    setTimeout(() => loading.style.display = 'none', 500);
}

function updateStatus(text, active) {
    document.getElementById('statusText').textContent = text;
    const dot = document.getElementById('statusDot');
    if (active) {
        dot.classList.add('active');
    } else {
        dot.classList.remove('active');
    }
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Start
init();
