# PixAura 🌌

> Hand-controlled 3D spiral particle system powered by MediaPipe and Three.js

An interactive web application that lets you control a mesmerizing 15,000-particle spiral galaxy using hand gestures. Built with vanilla JavaScript, Three.js for 3D rendering, and MediaPipe for real-time hand tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-r128-green.svg)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Hands-orange.svg)

## ✨ Features

- **Hand Gesture Control**: Control particles with natural hand movements
- **Pinch Gesture**: Expand/contract the particle system with a pinch
- **Real-time Tracking**: Smooth hand tracking with MediaPipe
- **15,000 Particles**: Beautiful spiral galaxy visualization
- **Live Camera Feed**: See your hand movements in real-time
- **Keyboard Controls**: Alternative controls for accessibility
- **Responsive Design**: Works on desktop and mobile devices
- **Minimal UI**: Clean, modern interface that doesn't interfere

## 🎮 Controls

### Hand Gestures
- **✋ Move Hand**: Rotate the particle system
- **👌 Pinch**: Toggle expand/contract with rainbow color animation

### Keyboard
- **Space**: Toggle expand/contract
- **R**: Reset view to default position
- **S**: Toggle statistics (if enabled)

## 🚀 Quick Start

### Prerequisites
- Modern web browser with WebGL support
- Webcam/camera access
- HTTPS connection (required for camera access)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/princekjha-dev/pixaura.git
cd pixaura
```

2. Serve the files using a local server:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server
```

**Using PHP:**
```bash
php -S localhost:8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

4. Allow camera access when prompted

## 📁 Project Structure

```
pixaura/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── app.js              # Core application logic
├── README.md           # Documentation
└── LICENSE             # MIT License
```

## 🛠️ Technologies

- **[Three.js](https://threejs.org/)** (r128) - 3D graphics and particle system
- **[MediaPipe Hands](https://google.github.io/mediapipe/)** - Hand tracking and gesture detection
- **Vanilla JavaScript** - No frameworks, pure JS
- **WebGL** - Hardware-accelerated 3D rendering
- **HTML5 Canvas** - Camera feed visualization

## ⚙️ Configuration

You can customize the particle system by modifying the `CONFIG` object in `app.js`:

```javascript
const CONFIG = {
    particleCount: 15000,      // Number of particles
    spiralArms: 5,             // Number of spiral arms
    spiralTightness: 0.3,      // How tight the spiral is
    maxRadius: 3,              // Maximum spiral radius
    expandSpeed: 0.05,         // Expansion animation speed
    rotationDamping: 0.95,     // Rotation slowdown factor
    pinchThreshold: 0.05       // Pinch detection sensitivity
};
```

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note:** HTTPS is required for camera access. Use `localhost` for local development.

## 📱 Mobile Support

PixAura works on mobile devices with front-facing cameras. The UI automatically adapts to smaller screens with a responsive layout.

## 🐛 Troubleshooting

### Camera not working
- Ensure HTTPS connection (or use localhost)
- Check browser camera permissions
- Try a different browser
- Verify camera is not used by another application

### Performance issues
- Reduce `particleCount` in config
- Close other browser tabs
- Update graphics drivers
- Use a device with better GPU

### Hand tracking not detecting
- Ensure good lighting
- Keep hand within camera frame
- Try adjusting `minDetectionConfidence` in MediaPipe settings

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Prince Kumar Jha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**Prince Kumar Jha**

- GitHub: [@princekjha-dev](https://github.com/princekjha-dev)

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for the amazing 3D library
- [MediaPipe](https://google.github.io/mediapipe/) for hand tracking technology
- Inspired by interactive particle systems and gesture-based interfaces

## 🔮 Future Enhancements

- [ ] Multiple hand tracking support
- [ ] More gesture controls (swipe, rotate, etc.)
- [ ] Particle color themes
- [ ] Record and replay hand movements
- [ ] VR/AR support
- [ ] Audio reactivity
- [ ] Save particle configurations

## 📊 Stats

- **15,000** particles rendered in real-time
- **30-60 FPS** on modern hardware
- **<100ms** hand tracking latency
- **Pure vanilla JS** - no build tools needed

---

**Made with ❤️ by Prince Kumar Jha**

If you found this project helpful, please consider giving it a ⭐!
