export function ContactSection() {
  return String.raw`
<section id="contact">
    <div class="container">
    <div class="contact-layout">
      <div class="contact-info-panel reveal">
        <div class="section-eyebrow">Concessionária Oficial</div>
        <h2 class="section-title">Fale com a Martins Mobilidade</h2>
        <p class="contact-desc">Estamos prontos para agendar seu Test Ride ou tirar suas dúvidas. Escolha o canal de sua preferência:</p>
        
        <div class="contact-boxes">
          <!-- WhatsApp Destacado -->
          <a href="https://wa.me/5592992925353?text=Olá,%20gostaria%20de%20falar%20com%20um%20consultor%20da%20Martins%20Mobilidade." target="_blank" rel="noopener" class="contact-box highlight-wa-box">
            <span class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </span>
            <div>
              <div class="contact-box-lbl">WhatsApp Principal (Mais rápido)</div>
              <div class="contact-box-val" data-contact-whatsapp>(92) 99292-5353</div>
              <span class="contact-sub-action">Falar com um consultor comercial →</span>
            </div>
          </a>

          <!-- Endereço -->
          <div class="contact-box">
            <span class="contact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </span>
            <div>
              <div class="contact-box-lbl">Nosso Showroom</div>
              <div class="contact-box-val" data-contact-address>
                Av. Torquato Tapajós, 5552 - Flores<br>
                Manaus - AM, CEP 69058-830
              </div>
            </div>
          </div>
        </div>

        <!-- Google Map Estilizado -->
        <div class="contact-map-wrapper">
          <iframe 
            src="https://www.google.com/maps?q=Martins%20Mobilidade%20El%C3%A9trica%20-%20Av.%20Torquato%20Tapaj%C3%B3s%2C%205552%20-%20Flores%2C%20Manaus%20-%20AM%2C%2069058-830&z=17&hl=pt-BR&gl=BR&output=embed" 
            width="100%" 
            height="240" 
            style="border:0;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>

      <!-- Formulário de Mensagem -->
      <div class="contact-form-panel reveal">
        <div class="form-card" id="contato-card" style="max-width:100%; background:transparent; border:none; padding:0; backdrop-filter:none;">
          <div class="form-title">Mensagem Direta</div>
          <div class="form-subtitle" style="margin-bottom:32px;">Prefere que nós entremos em contato? Deixe sua mensagem.</div>
          
          <form data-lead-form="contact" class="raw-form">
            <div class="form-group">
              <label for="c-nome">Nome completo</label>
              <input type="text" id="c-nome" name="nome" placeholder="Seu nome completo" required>
            </div>

            <div class="form-group">
              <label for="c-email">E-mail para retorno</label>
              <input type="email" id="c-email" name="email" placeholder="seu@email.com">
            </div>

            <div class="form-group">
              <label for="c-tel">Telefone / WhatsApp</label>
              <input type="tel" id="c-tel" name="whatsapp" placeholder="(92) 99292-5353" required>
            </div>

            <div class="form-group">
              <label for="c-msg">Mensagem / Dúvida</label>
              <textarea id="c-msg" name="mensagem" placeholder="Dúvidas sobre autonomia, financiamento, test ride ou visitas..." required></textarea>
            </div>

            <button type="submit" class="btn btn-accent btn-primary">Falar com Consultor →</button>
          </form>
        </div>
      </div>
    </div>
    </div>
  </section>
  `;
}
