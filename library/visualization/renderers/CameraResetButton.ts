/**
 * Camera Reset Button for Three.js Renderer
 * Creates a floating button to reset camera position
 */

export interface CameraResetButtonOptions {
  /** Position from top (default: '10px') */
  top?: string;
  /** Position from right (default: '10px') */
  right?: string;
  /** Button size (default: '40px') */
  size?: string;
  /** Background color (default: 'rgba(255, 255, 255, 0.9)') */
  backgroundColor?: string;
  /** Text color (default: '#1e293b') */
  textColor?: string;
  /** Button text (default: '↺') */
  text?: string;
  /** Tooltip text (default: 'Reset Camera') */
  tooltip?: string;
}

export class CameraResetButton {
  private button: HTMLButtonElement;
  private container: HTMLElement;
  private options: Required<CameraResetButtonOptions>;

  constructor(
    container: HTMLElement,
    onReset: () => void,
    options?: CameraResetButtonOptions
  ) {
    this.container = container;
    this.options = {
      top: options?.top || '10px',
      right: options?.right || '10px',
      size: options?.size || '40px',
      backgroundColor: options?.backgroundColor || 'rgba(255, 255, 255, 0.9)',
      textColor: options?.textColor || '#1e293b',
      text: options?.text || '↺',
      tooltip: options?.tooltip || 'Reset Camera',
    };

    this.button = this.createButton(onReset);
    this.mount();
  }

  /**
   * Create button element with styles and event listeners
   */
  private createButton(onReset: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.textContent = this.options.text;
    button.title = this.options.tooltip;
    
    // Base styles
    Object.assign(button.style, {
      position: 'absolute',
      top: this.options.top,
      right: this.options.right,
      width: this.options.size,
      height: this.options.size,
      border: 'none',
      borderRadius: '50%',
      backgroundColor: this.options.backgroundColor,
      color: this.options.textColor,
      fontSize: '24px',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.2s',
      zIndex: '1000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    });

    // Hover effects
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = this.options.backgroundColor.replace('0.9', '1');
      button.style.transform = 'scale(1.1)';
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = this.options.backgroundColor;
      button.style.transform = 'scale(1)';
    });

    // Click handler
    button.addEventListener('click', () => {
      onReset();
      // Add feedback animation
      button.style.transform = 'scale(0.9)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 100);
    });

    return button;
  }

  /**
   * Mount button to container
   */
  private mount(): void {
    // Make container relative if it's not positioned
    if (getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative';
    }

    this.container.appendChild(this.button);
  }

  /**
   * Update button appearance
   */
  updateOptions(options: Partial<CameraResetButtonOptions>): void {
    if (options.top) {
      this.button.style.top = options.top;
    }
    if (options.right) {
      this.button.style.right = options.right;
    }
    if (options.size) {
      this.button.style.width = options.size;
      this.button.style.height = options.size;
    }
    if (options.backgroundColor) {
      this.button.style.backgroundColor = options.backgroundColor;
    }
    if (options.textColor) {
      this.button.style.color = options.textColor;
    }
    if (options.text) {
      this.button.textContent = options.text;
    }
    if (options.tooltip) {
      this.button.title = options.tooltip;
    }
  }

  /**
   * Show button
   */
  show(): void {
    this.button.style.display = 'flex';
  }

  /**
   * Hide button
   */
  hide(): void {
    this.button.style.display = 'none';
  }

  /**
   * Remove button from DOM
   */
  destroy(): void {
    this.button.remove();
  }
}
