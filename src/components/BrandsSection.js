export function BrandsSection() {
  return String.raw`
  <section id="brands" class="reveal">
    <div class="container">
      <div class="brands-wrapper">
        <div class="brands-grid">
          <a href="/watts" class="brand-item" title="Ver Linha Watts">
            <div class="brand-logo-container">
              <!-- Watts SVG Logo -->
              <svg viewBox="0 0 165 45" class="brand-logo-svg watts-logo">
                <g transform="skewX(-18)" fill="currentColor">
                  <text x="5" y="34" font-family="'Sora', 'Blinker', sans-serif" font-weight="950" font-size="34" letter-spacing="-1.5">watts</text>
                </g>
              </svg>
            </div>
          </a>
          
          <a href="/ventura" class="brand-item" title="Ver Linha Ventura">
            <div class="brand-logo-container">
              <!-- Ventura SVG Logo -->
              <svg viewBox="0 0 180 45" class="brand-logo-svg ventura-logo">
                <g transform="skewX(-18)" fill="currentColor">
                  <text x="5" y="33" font-family="'Sora', 'Blinker', sans-serif" font-weight="950" font-size="28" letter-spacing="-0.5">VENTURA</text>
                </g>
              </svg>
            </div>
          </a>
          
          <a href="/amazon-motors" class="brand-item" title="Ver Linha Amazon Motors">
            <div class="brand-logo-container">
              <!-- Amazon Motors SVG Logo -->
              <svg viewBox="0 0 180 45" class="brand-logo-svg amazon-logo">
                <g fill="currentColor">
                  <path d="M10,24 L22,7 L34,24 L28,24 L22,15 L16,24 Z M10,38 L22,21 L34,38 L28,38 L22,29 L16,38 Z" />
                  <text x="46" y="25" font-family="'Sora', 'Blinker', sans-serif" font-weight="900" font-size="16" letter-spacing="0.5">AMAZON</text>
                  <text x="46" y="36" font-family="'Inter', sans-serif" font-weight="800" font-size="9" letter-spacing="3.5">MOTORS</text>
                </g>
              </svg>
            </div>
          </a>
          
          <a href="/importway" class="brand-item" title="Ver Linha Importway">
            <div class="brand-logo-container">
              <!-- Importway SVG Logo -->
              <svg viewBox="0 0 180 45" class="brand-logo-svg importway-logo">
                <g fill="currentColor">
                  <path d="M8,22.5 L20,12 L20,17.5 L32,17.5 L32,27.5 L20,27.5 L20,33 Z" />
                  <text x="38" y="29" font-family="'Sora', 'Blinker', sans-serif" font-weight="900" font-size="16" letter-spacing="0.5">IMPORTWAY</text>
                </g>
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
  `;
}
