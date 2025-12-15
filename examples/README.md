# Quantum.js - Interactive Examples

Interactive web-based examples demonstrating Quantum.js capabilities with Bloch sphere visualizations.

## 🚀 Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Run development server
npm run examples

# Build for production
npm run examples:build
```

The examples will open automatically in your browser at `http://localhost:3000`.

## 📚 Available Examples

### 🔔 Bell States
Explore the four maximally entangled Bell states (Φ⁺, Φ⁻, Ψ⁺, Ψ⁻) and visualize individual qubits on the Bloch sphere.

**Features:**
- Select and generate different Bell states
- Visualize individual qubits
- Measure qubits and observe state collapse
- Real-time Bloch sphere visualization

### ⚡ Quantum Gates
Apply various single-qubit quantum gates and observe their effects on the Bloch sphere.

**Features:**
- Apply Pauli gates (X, Y, Z)
- Apply Hadamard gate (H)
- Apply phase gates (S, T, S†, T†)
- Apply rotation gates (Rx, Ry, Rz)
- Track gate application history
- Interactive angle selection for rotations

### 🌊 Superposition
Create custom quantum superposition states by adjusting θ and φ angles.

**Features:**
- Interactive sliders for θ (0-180°) and φ (0-360°)
- Preset states (|0⟩, |1⟩, |+⟩, |-⟩, |+i⟩, |-i⟩)
- Real-time state visualization
- Probability distribution display
- Phase visualization

### 🔗 Quantum Entanglement
Generate and manipulate entangled qubit pairs to explore quantum correlations.

**Features:**
- Create Bell state entanglement
- Apply gates to individual qubits
- Measure qubits individually or together
- Observe correlation in measurements
- Dual Bloch sphere visualization

### 🎲 Random Number Generator
Generate truly random numbers using quantum superposition and measurement.

**Features:**
- Generate random numbers from 1-8 bits
- Statistical analysis (average, min, max)
- Distribution chart visualization
- Batch generation (10 numbers at once)
- Recent numbers history

## 🎨 Technology Stack

- **Vite 6+** - Fast development and build tool
- **TypeScript** - Type-safe quantum programming
- **Quantum.js** - Quantum computing library
- **SVG** - Scalable vector graphics for visualizations
- **CSS3** - Modern styling with dark theme

## 📖 Using the Examples

Each example page includes:

1. **Controls Panel** (left side)
   - Interactive controls for quantum operations
   - Parameter adjustments
   - Preset states and operations

2. **Visualization Panel** (right side)
   - Bloch sphere visualization(s)
   - Quantum state information
   - Probability distributions
   - Statistical data

## 🔧 Development

### Project Structure

```
examples/
├── index.html              # Main landing page
├── bell-states.html        # Bell states example
├── quantum-gates.html      # Quantum gates example
├── superposition.html      # Superposition example
├── entanglement.html       # Entanglement example
├── random-number.html      # Random number generator
├── scripts/
│   ├── bell-states.ts
│   ├── quantum-gates.ts
│   ├── superposition.ts
│   ├── entanglement.ts
│   └── random-number.ts
└── styles/
    └── main.css            # Shared styles
```

### Adding New Examples

1. Create HTML file in `examples/`
2. Create TypeScript file in `examples/scripts/`
3. Update `vite.config.ts` to include new entry point
4. Add card to `examples/index.html`

### Customization

All examples use CSS variables defined in `styles/main.css`:

```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --background: #0f172a;
  /* ... more variables ... */
}
```

## 🌐 Deployment

Build static files for deployment:

```bash
npm run examples:build
```

Output will be in `dist-examples/` directory, ready to deploy to any static hosting service.

## 📝 License

ISC License - See main project LICENSE file

## 🤝 Contributing

Contributions are welcome! To add new examples:

1. Fork the repository
2. Create a feature branch
3. Add your example following the existing patterns
4. Test thoroughly
5. Submit a pull request

## 🔗 Links

- [GitHub Repository](https://github.com/EarlOld/quantum.js)
- [Documentation](https://github.com/EarlOld/quantum.js/tree/main/docs)
- [NPM Package](https://www.npmjs.com/package/@earlold/quantum.js)
