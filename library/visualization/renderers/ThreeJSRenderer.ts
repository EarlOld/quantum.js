/**
 * Three.js 3D Renderer for Bloch Sphere Visualization
 */

import * as THREE from 'three';
import type { QubitState, VisualizationOptions, ColorScheme } from '../types';
import { DEFAULT_VISUALIZATION_OPTIONS, COLOR_SCHEMES } from '../types';
import { CameraResetButton } from './CameraResetButton';

export class BlochSphereThreeJS {
  private options: Required<VisualizationOptions>;
  private colorScheme: ColorScheme;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private sphere: THREE.Mesh | null = null;
  private stateArrow: THREE.Group | null = null;
  private controls: any = null;
  private currentVector: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  private targetVector: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
  private animationProgress: number = 1;
  private resetButton: CameraResetButton | null = null;

  constructor(container: HTMLElement, options?: VisualizationOptions) {
    this.options = { ...DEFAULT_VISUALIZATION_OPTIONS, ...options };
    
    // Determine color scheme
    if (options?.colorScheme) {
      this.colorScheme = options.colorScheme;
    } else if (options?.theme) {
      this.colorScheme = COLOR_SCHEMES[options.theme];
    } else {
      this.colorScheme = COLOR_SCHEMES.light;
    }

    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.colorScheme.background);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      50,
      this.options.width / this.options.height,
      0.1,
      1000
    );
    this.camera.position.set(3, 3, 3);
    this.camera.lookAt(0, 0, 0);
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.options.width, this.options.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    // Add reset camera button
    this.resetButton = new CameraResetButton(container, () => this.resetCamera());

    // Add lights
    this.addLights();
    this.addLights();

    // Add orbit controls (for mouse interaction)
    this.addOrbitControls();

    // Start animation loop
    this.animate();
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    requestAnimationFrame(this.animate);

    // Animate vector transition
    if (this.animationProgress < 1) {
      this.animationProgress = Math.min(1, this.animationProgress + 0.05);
      
      // Smooth interpolation (ease-out)
      const t = 1 - Math.pow(1 - this.animationProgress, 3);
      this.currentVector.lerpVectors(this.currentVector, this.targetVector, t);
      
      // Update arrow position
      this.updateArrowGeometry(this.currentVector);
    }

    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Add lights to the scene
   */
  private addLights(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(3, 4, 5);
    this.scene.add(directionalLight);

    // Fill light from opposite side
    const fillLight = new THREE.DirectionalLight(0xb8c5f0, 0.3);
    fillLight.position.set(-3, -2, -2);
    this.scene.add(fillLight);
  }

  /**
   * Add orbit controls for camera interaction
   */
  private addOrbitControls(): void {
    // We'll use basic mouse controls without external library
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    this.renderer.domElement.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    this.renderer.domElement.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const rotationSpeed = 0.005;
      
      // Rotate camera around the scene
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(this.camera.position);
      
      spherical.theta -= deltaX * rotationSpeed;
      spherical.phi -= deltaY * rotationSpeed;
      
      // Limit phi to avoid flipping
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      this.camera.position.setFromSpherical(spherical);
      this.camera.lookAt(0, 0, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    this.renderer.domElement.addEventListener('mouseup', () => {
      isDragging = false;
    });

    this.renderer.domElement.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    // Zoom with mouse wheel
    this.renderer.domElement.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      const delta = e.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed;
      this.camera.position.multiplyScalar(delta);
      this.camera.position.clampLength(2, 10);
    });
  }

  /**
   * Create the Bloch sphere
   */
  private createSphere(): void {
    // Remove old sphere if exists
    if (this.sphere) {
      this.scene.remove(this.sphere);
    }

    // Create two hemispheres instead of full sphere
    this.createHemispheres();

    // Add meridians
    if (this.options.gridLines) {
      const meridians = 12;
      for (let i = 0; i < meridians; i++) {
        const angle = (i / meridians) * Math.PI * 2;
        const curve = new THREE.EllipseCurve(0, 0, 1, 1, 0, Math.PI * 2, false, 0);
        const points = curve.getPoints(64);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
          color: 0x8090b0,
          transparent: true,
          opacity: 0.12,
        });
        const line = new THREE.Line(geo, mat);
        line.rotation.y = angle;
        line.rotation.x = Math.PI / 2;
        this.scene.add(line);
      }
    }

    // Add equator
    if (this.options.showEquator) {
      this.addEquator();
    }
  }

  /**
   * Create two hemispheres with different colors
   */
  private createHemispheres(): void {
    // Upper hemisphere (|0⟩)
    const upperGeometry = new THREE.SphereGeometry(1, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2);
    const upperMaterial = new THREE.MeshPhysicalMaterial({
      color: this.colorScheme.upperHemisphere,
      transparent: true,
      opacity: 0.15,
      metalness: 0.0,
      roughness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    });
    const upperHemisphere = new THREE.Mesh(upperGeometry, upperMaterial);
    this.scene.add(upperHemisphere);

    // Lower hemisphere (|1⟩)
    const lowerGeometry = new THREE.SphereGeometry(1, 64, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const lowerMaterial = new THREE.MeshPhysicalMaterial({
      color: this.colorScheme.lowerHemisphere,
      transparent: true,
      opacity: 0.15,
      metalness: 0.0,
      roughness: 0.15,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    });
    const lowerHemisphere = new THREE.Mesh(lowerGeometry, lowerMaterial);
    this.scene.add(lowerHemisphere);

    // Add equator circle with fill to clearly separate hemispheres
    const equatorCircle = new THREE.CircleGeometry(1, 64);
    const equatorMaterial = new THREE.MeshBasicMaterial({
      color: this.colorScheme.equatorPlane,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const equatorMesh = new THREE.Mesh(equatorCircle, equatorMaterial);
    equatorMesh.rotation.x = Math.PI / 2;
    this.scene.add(equatorMesh);

    // Add thin border ring around equator
    const ringGeometry = new THREE.RingGeometry(0.99, 1.01, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: this.colorScheme.equatorRing,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    this.scene.add(ring);
  }

  /**
   * Add equator circle
   */
  private addEquator(): void {
    const curve = new THREE.EllipseCurve(
      0, 0,
      1, 1,
      0, 2 * Math.PI,
      false,
      0
    );

    const points = curve.getPoints(64);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x6070a0,
      transparent: true,
      opacity: 0.25,
      linewidth: 2,
    });

    const ellipse = new THREE.Line(geometry, material);
    ellipse.rotation.x = Math.PI / 2;
    this.scene.add(ellipse);
  }

  /**
   * Create coordinate axes
   */
  private createAxes(): void {
    if (!this.options.showAxes) return;

    const axisLength = 1.3;
    const arrowLength = 0.15;
    const arrowWidth = 0.05;

    // X axis (red) - horizontal (both directions)
    this.addArrow(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(axisLength, 0, 0),
      this.colorScheme.axisX,
      arrowLength,
      arrowWidth
    );
    this.addArrow(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-axisLength, 0, 0),
      this.colorScheme.axisX,
      arrowLength,
      arrowWidth
    );

    // Y axis (green) - horizontal (both directions)
    this.addArrow(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, axisLength),
      this.colorScheme.axisY,
      arrowLength,
      arrowWidth
    );
    this.addArrow(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -axisLength),
      this.colorScheme.axisY,
      arrowLength,
      arrowWidth
    );

    // Z axis (blue) - vertical (|0⟩ up, |1⟩ down)
    this.addArrow(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, axisLength, 0),
      this.colorScheme.axisZ,
      arrowLength,
      arrowWidth
    );
    this.addArrow(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, -axisLength, 0),
      this.colorScheme.axisZ,
      arrowLength,
      arrowWidth
    );

    // Add vertical meridians to divide sphere
    this.addVerticalMeridians();

    // Add labels
    if (this.options.showLabels) {
      this.addAxisLabels();
    }

    // Add equatorial plane (horizontal plane at y=0)
    this.addEquatorialPlane();
  }

  /**
   * Add vertical meridians to divide sphere
   */
  private addVerticalMeridians(): void {
    // Create thicker, more visible meridians
    const numMeridians = 4;
    
    for (let i = 0; i < numMeridians; i++) {
      const angle = (i / numMeridians) * Math.PI;
      
      // Create vertical circle
      const curve = new THREE.EllipseCurve(0, 0, 1, 1, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(64);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      // Make meridians more visible
      const material = new THREE.LineBasicMaterial({
        color: this.colorScheme.meridians,
        transparent: true,
        opacity: 0.5,
        linewidth: 3,
      });
      
      const meridian = new THREE.Line(geometry, material);
      
      // Rotate to make vertical
      meridian.rotation.z = Math.PI / 2;
      // Rotate around vertical axis
      meridian.rotation.y = angle;
      
      this.scene.add(meridian);
    }
  }

  /**
   * Add equatorial plane perpendicular to Z axis
   */
  private addEquatorialPlane(): void {
    const planeGeometry = new THREE.CircleGeometry(1, 64);
    const planeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xa0b0d0,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      metalness: 0.0,
      roughness: 0.5,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // Plane is horizontal (perpendicular to Y axis which is now Z)
    plane.rotation.x = Math.PI / 2;
    this.scene.add(plane);

    // Add circle outline for the plane - make it more visible
    const edgeGeometry = new THREE.RingGeometry(0.98, 1.01, 64);
    const edgeMaterial = new THREE.MeshBasicMaterial({
      color: 0x4050b0,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    });
    const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge.rotation.x = Math.PI / 2;
    this.scene.add(edge);
  }

  /**
   * Add an arrow
   */
  private addArrow(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    color: number,
    headLength: number = 0.2,
    headWidth: number = 0.1
  ): THREE.ArrowHelper {
    const length = direction.length();
    const dir = direction.clone().normalize();
    const arrow = new THREE.ArrowHelper(dir, origin, length, color, headLength, headWidth);
    this.scene.add(arrow);
    return arrow;
  }

  /**
   * Add axis labels using sprites
   */
  private addAxisLabels(): void {
    const labels = [
      { text: '|0⟩', position: new THREE.Vector3(0, 1.5, 0), color: this.colorScheme.labels },
      { text: '|1⟩', position: new THREE.Vector3(0, -1.5, 0), color: this.colorScheme.labels },
      { text: '|+⟩', position: new THREE.Vector3(1.5, 0, 0), color: this.colorScheme.labels },
      { text: '|-⟩', position: new THREE.Vector3(-1.5, 0, 0), color: this.colorScheme.labels },
      { text: '|+i⟩', position: new THREE.Vector3(0, 0, 1.5), color: this.colorScheme.labels },
      { text: '|-i⟩', position: new THREE.Vector3(0, 0, -1.5), color: this.colorScheme.labels },
    ];

    labels.forEach((label) => {
      const sprite = this.createTextSprite(label.text, label.color);
      sprite.position.copy(label.position);
      this.scene.add(sprite);
    });
  }

  /**
   * Create a text sprite
   */
  private createTextSprite(text: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.width = 256;
    canvas.height = 128;

    context.font = 'Bold 48px Arial';
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 128, 64);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.5, 0.25, 1);

    return sprite;
  }

  /**
   * Create state vector arrow
   */
  private createStateVector(state: QubitState): void {
    // Remove old arrow if exists
    if (this.stateArrow) {
      this.scene.remove(this.stateArrow);
    }

    this.stateArrow = new THREE.Group();

    // Transform coordinates: x stays x, y becomes z, z becomes y
    const direction = new THREE.Vector3(
      state.blochVector.x,
      state.blochVector.z,
      state.blochVector.y
    );

    const length = direction.length();
    if (length < 0.01) return; // Don't draw if vector is too small

    // Create custom arrow with better appearance
    const arrowGroup = new THREE.Group();

    // Calculate direction
    const dir = direction.clone().normalize();
    
    // Create shaft (cylinder) - thinner
    const shaftRadius = 0.015;
    const shaftLength = length - 0.12;
    const shaftGeometry = new THREE.CylinderGeometry(shaftRadius, shaftRadius, shaftLength, 16);
    const shaftMaterial = new THREE.MeshPhysicalMaterial({
      color: this.colorScheme.arrow,
      metalness: 0.3,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: this.colorScheme.arrow,
      emissiveIntensity: 0.3,
    });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.position.copy(dir.clone().multiplyScalar(shaftLength / 2));
    
    // Align shaft with direction
    shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    arrowGroup.add(shaft);

    // Create cone head
    const coneHeight = 0.12;
    const coneRadius = 0.05;
    const coneGeometry = new THREE.ConeGeometry(coneRadius, coneHeight, 16);
    const coneMaterial = new THREE.MeshPhysicalMaterial({
      color: this.colorScheme.arrowCone,
      metalness: 0.3,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: this.colorScheme.arrowCone,
      emissiveIntensity: 0.3,
    });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.position.copy(dir.clone().multiplyScalar(shaftLength + coneHeight / 2));
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    arrowGroup.add(cone);

    // Add small sphere at the origin
    const originSphereGeometry = new THREE.SphereGeometry(0.04, 32, 32);
    const originSphereMaterial = new THREE.MeshPhysicalMaterial({
      color: this.colorScheme.originSphere,
      metalness: 0.3,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: this.colorScheme.originSphere,
      emissiveIntensity: 0.3,
    });
    const originSphere = new THREE.Mesh(originSphereGeometry, originSphereMaterial);
    originSphere.position.set(0, 0, 0);
    arrowGroup.add(originSphere);

    this.stateArrow.add(arrowGroup);
    this.scene.add(this.stateArrow);
  }

  /**
   * Update arrow geometry for animation
   */
  private updateArrowGeometry(direction: THREE.Vector3): void {
    if (!this.stateArrow) return;

    const length = direction.length();
    if (length < 0.01) return;

    const dir = direction.clone().normalize();
    
    // Find shaft and cone in the arrow group
    const arrowGroup = this.stateArrow.children[0] as THREE.Group;
    if (!arrowGroup) return;

    const shaft = arrowGroup.children[0] as THREE.Mesh;
    const cone = arrowGroup.children[1] as THREE.Mesh;

    if (shaft && cone) {
      const shaftLength = length - 0.12;
      const coneHeight = 0.12;

      // Update shaft position and rotation
      shaft.position.copy(dir.clone().multiplyScalar(shaftLength / 2));
      shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      
      // Update cone position and rotation
      cone.position.copy(dir.clone().multiplyScalar(shaftLength + coneHeight / 2));
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    }
  }

  /**
   * Update visualization with new quantum state
   */
  updateState(state: QubitState): void {
    // Set new target vector
    this.targetVector = new THREE.Vector3(
      state.blochVector.x,
      state.blochVector.z,
      state.blochVector.y
    );

    // Check if this is first call
    if (!this.stateArrow) {
      // First time - setup everything
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }

      this.addLights();
      this.createSphere();
      this.createAxes();
      this.createStateVector(state);
      
      this.currentVector.copy(this.targetVector);
      this.animationProgress = 1;
    } else {
      // Subsequent calls - just animate the vector
      this.animationProgress = 0;
    }
  }

  /**
   * Resize renderer
   */
  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Change color theme
   */
  setTheme(theme: 'light' | 'dark' | 'custom', customScheme?: ColorScheme): void {
    if (theme === 'custom' && customScheme) {
      this.colorScheme = customScheme;
    } else {
      this.colorScheme = COLOR_SCHEMES[theme];
    }
    
    // Update background
    this.scene.background = new THREE.Color(this.colorScheme.background);
    
    // Trigger re-render by forcing update
    if (this.stateArrow) {
      // Clear and rebuild scene
      while (this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
      
      this.addLights();
      this.createSphere();
      this.createAxes();
      
      // Recreate arrow with new colors
      const state = {
        amplitude0: { re: 0, im: 0 },
        amplitude1: { re: 0, im: 0 },
        probability0: 0,
        probability1: 0,
        blochVector: {
          x: this.currentVector.x,
          y: this.currentVector.y,
          z: this.currentVector.z,
        },
        spherical: { theta: 0, phi: 0 },
      };
      this.createStateVector(state);
    }
  }

  /**
   * Reset camera to initial position
   */
  resetCamera(): void {
    this.camera.position.set(3, 3, 3);
    this.camera.lookAt(0, 0, 0);
  }

  /**
   * Cleanup
   */
  /**
   * Cleanup
   */
  dispose(): void {
    if (this.resetButton) {
      this.resetButton.destroy();
    }
    this.renderer.dispose();
    this.scene.clear();
  }
}