# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2025-12-15
## [0.5.0] - 2025-12-15

### ✨ Added
- **3D Bloch Sphere Visualization** with Three.js WebGL rendering
  - Interactive camera controls (rotate, zoom, pan)
  - Light and dark theme support with customizable color schemes
  - Smooth animations for quantum state transitions
  - Reset camera button for easy navigation
  - Real-time quantum state updates

### 🎨 Visualization Features
- `BlochSphereThreeJS` renderer class
- `CameraResetButton` component for camera control
- `CoordinateConverter` utility for quantum state transformations
- Theme switching (`light`, `dark`, `custom`)
- Hemisphere coloring (upper for |0⟩, lower for |1⟩)
- Axis labels and meridians
- State vector arrow with custom materials

### 📚 Examples
- Separated examples into standalone project (`examples/`)
- New theme demo page
- Updated all examples to use Three.js renderer
- Interactive examples with gate controls
- Vercel deployment pipeline for examples

### 🧪 Testing
- Added comprehensive tests for `CoordinateConverter` (15 tests)
- Added tests for `ThreeJSRenderer` (10 tests)
- Co-located tests with source files
- All 41 tests passing

### 🔧 Refactoring
- **Removed** deprecated SVGRenderer and all dependencies
- **Removed** Gulp build system (replaced with npm scripts)
- Moved examples configuration to `examples/vite.config.ts`
- Separated example dependencies from library dependencies
- Cleaned up 111+ unused packages

### 📖 Documentation
- Updated visualization documentation for Three.js approach
- Added camera controls and theme switching documentation
- Updated README with new visualization examples
- Added examples README with deployment instructions

### 🚀 Infrastructure
- GitHub Actions workflow for examples deployment
- Separated library and examples builds
- TypeScript configuration for examples
- Vercel integration for examples hosting

### 🐛 Bug Fixes
- Fixed TypeScript compilation errors in visualization
- Fixed build errors from old example files
- Added `skipLibCheck` to prevent @types/node conflicts

### 📦 Dependencies
- Added `three@^0.170.0` for 3D rendering
- Added `@types/three@^0.170.0` for TypeScript support
- Removed `gulp` and related packages
- Kept minimal dependencies in library package

### 🔄 Breaking Changes
- **Removed** `circuit.visualizeQubit()` method (use `BlochSphereThreeJS` instead)
- **Removed** `circuit.saveVisualization()` method
- **Removed** `BlochSphereSVG` class and all SVG rendering
- Library now requires Three.js for visualization features

### Migration Guide
```typescript
// Old (v0.4.6)
const svg = circuit.visualizeQubit(0);
circuit.saveVisualization(0, './file.svg');

// New (v0.5.0)
import { BlochSphereThreeJS } from '@earlold/quantum.js/visualization';

const container = document.getElementById('bloch-sphere');
const renderer = new BlochSphereThreeJS(container, {
  theme: 'dark',
  width: 600,
  height: 600,
});

// Update visualization
renderer.updateState(circuit.getQubitState(0));
```

## [0.4.6] - Previous Release
- Previous functionality with SVG rendering
- Basic quantum circuit operations
- QAOA algorithm support

---

[0.5.0]: https://github.com/EarlOld/quantum.js/releases/tag/v0.5.0
[0.4.6]: https://github.com/EarlOld/quantum.js/releases/tag/v0.4.6
