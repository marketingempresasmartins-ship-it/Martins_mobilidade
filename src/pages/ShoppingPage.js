import { HeroSection } from "../components/HeroSection.js";
import { ModelsCarouselSection } from "../components/ModelsCarouselSection.js";
import { TestimonialsSection } from "../components/TestimonialsSection.js";
import { ContactSection } from "../components/ContactSection.js";
import { Footer } from "../components/Footer.js";
import { FloatingWhatsApp } from "../components/FloatingWhatsApp.js";

// Menu enxuto específico para a campanha do shopping (oculta rotas externas)
export function ShoppingNavigation() {
  return String.raw`
<nav>
    <div class="container nav-container">
      <a class="logo" href="/">
        <img src="/assets/martins/logo-martins-tech-light-text.webp" alt="Martins Tech" class="logo-img">
      </a>
      <div class="nav-links" id="navLinks">
        <a href="#models-carousel-section">Modelos</a>
        <a href="#features">Vantagens</a>
        <a href="#testimonials">Depoimentos</a>
        <a href="#contact">Contato</a>
        <a href="#hero" class="btn-nav">Quero Cotação</a>
      </div>
      <div class="mobile-toggle" id="mobileToggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
  `;
}

// Seção de vantagens enxuta, sem o simulador interativo de economia
export function ShoppingFeaturesSection() {
  return String.raw`
<style>
  .shopping-features-grid {
    grid-template-columns: repeat(3, 1fr) !important;
  }
  @media (max-width: 991px) {
    .shopping-features-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  @media (max-width: 640px) {
    .shopping-features-grid {
      grid-template-columns: 1fr !important;
    }
  }
</style>
<section id="features">
    <div class="container">
    <div class="section-eyebrow">Eficiência Técnica</div>
    <h2 class="section-title">Vantagens de alto nível</h2>
    
    <div class="features-grid shopping-features-grid reveal-grid">
      <!-- Feature 1: Economia Real -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">01 / ECONOMIA</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
        <h3 class="feature-title">Economia Real</h3>
        <p class="feature-desc">Reduza em até 80% seus gastos mensais com combustível. A recarga elétrica custa apenas uma fração do valor da gasolina e o retorno é imediato no seu bolso.</p>
      </div>

      <!-- Feature 2: Sustentabilidade -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">02 / MEIO AMBIENTE</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.58A7 7 0 0 1 11 20z"></path><path d="M9 22a5 5 0 0 1-5-5c0-4 4-5 4-5"></path></svg>
        </div>
        <h3 class="feature-title">Zero Emissões</h3>
        <p class="feature-desc">Zere sua pegada de carbono no trânsito. Locomoção 100% livre de fumaça, óleo e poluentes, ajudando a preservar a qualidade de vida local no Amazonas.</p>
      </div>

      <!-- Feature 3: Manutenção -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">03 / MECÂNICA</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
        </div>
        <h3 class="feature-title">Manutenção Mínima</h3>
        <p class="feature-desc">Esqueça trocas de óleo, juntas, filtros ou velas de ignição. Motores elétricos Direct Drive de cubo possuem pouquíssimas peças móveis, reduzindo drasticamente custos operacionais.</p>
      </div>

      <!-- Feature 4: Silêncio -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">04 / EXPERIÊNCIA</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
        </div>
        <h3 class="feature-title">Silêncio Total</h3>
        <p class="feature-desc">Conduza sem ruídos mecânicos ou poluição sonora. Sinta o torque instantâneo com uma aceleração contínua, suave, empolgante e 100% silenciosa.</p>
      </div>

      <!-- Feature 5: Isenções -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">05 / LEGISLAÇÃO</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <h3 class="feature-title">Isenções & Facilidades</h3>
        <p class="feature-desc">Aproveite isenção ou alíquota reduzida de IPVA (conforme o modelo), custo zero com licenciamento para autopropelidos e modelos que dispensam CNH.</p>
      </div>

      <!-- Feature 6: Mobilidade & Showroom -->
      <div class="feature-card stagger-item">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div class="feature-num">06 / SHOWROOM & SUPORTE</div>
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 22px; height: 22px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <h3 class="feature-title">Mobilidade & Suporte</h3>
        <p class="feature-desc">Recarga extremamente prática em qualquer tomada padrão (110V/220V). Garantia de fábrica de até 5 anos com showroom físico e oficina local no bairro Flores.</p>
      </div>
    </div>
    </div>
</section>
  `;
}

export function ShoppingPage() {
  return [
    ShoppingNavigation(),
    HeroSection(),
    ModelsCarouselSection(),
    ShoppingFeaturesSection(),
    TestimonialsSection(),
    ContactSection(),
    Footer(),
    FloatingWhatsApp()
  ].join("\n");
}
