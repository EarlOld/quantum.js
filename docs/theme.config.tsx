import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router'

const config: DocsThemeConfig = {
  useNextSeoProps() {
    const { asPath } = useRouter()
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Quantum.js',
      }
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon192.png" />
    </>
  ),
  logo: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <img
      src="/quantum-js.webp"
      alt="Quantum.js"
      style={{ width: '32px', borderRadius: '50%' }}
    />
    <span>Quantum.js</span>
    </div>

  ),
  project: {
    link: 'https://github.com/EarlOld/quantum.js',
  },
  chat: {
    link: 'https://t.me/iot_sdn',
  },
  docsRepositoryBase: 'https://github.com/EarlOld/quantum.js',
  banner: {
    key: 'examples-launch',
    text: (
      <a href="https://quantum-js-examples.iot-sdn.space" target="_blank">
        🎮 Try interactive examples with 3D Bloch sphere visualization →
      </a>
    ),
  },
  footer: {
    text: 'MIT 2024 © EarlOld - Quantum.js@0.5.1',
  },
};

export default config;
