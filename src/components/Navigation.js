export function Navigation() {
  return String.raw`
<nav>
    <div class="container nav-container">
      <a class="logo" href="/">
        <img src="/assets/martins/logo-martins-mobilidade.svg" alt="Martins Mobilidade" class="logo-img">
      </a>
      <div class="nav-links" id="navLinks">
        <a href="/#showroom">Veículos</a>
        <a href="/catalogo">Catálogo</a>
        <a href="/#tech">Tecnologia</a>
        <a href="/#features">Vantagens</a>
        <a href="/#testimonials">Depoimentos</a>
        <a href="/#contact">Contato</a>
        <a href="/#hero" class="btn-nav">Quero Cotação</a>
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
