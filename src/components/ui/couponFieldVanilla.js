/**
 * Normaliza o código do cupom:
 * - Remove espaços no início e no final
 * - Converte para maiúsculas
 * - Aceita letras, números, hífen (-) e underline (_)
 * - Limita a 30 caracteres
 */
export function normalizeCouponCode(rawCode) {
  if (!rawCode) return "";
  let clean = String(rawCode).trim().toUpperCase();
  clean = clean.replace(/[^A-Z0-9_-]/g, "");
  return clean.slice(0, 30);
}

/**
 * Anexa o componente de cupom Vanilla a um formulário HTML existente.
 * O componente é inserido automaticamente antes do botão de submit do formulário.
 */
export function attachCouponField(formElement, options = {}) {
  if (!formElement) return null;
  // Não anexa em formulários que fazem parte do LeadModal do React (já possuem <CouponField />)
  if (formElement.closest(".lead-modal")) return null;

  const formId = options.formId || formElement.getAttribute("data-lead-form") || formElement.id || "form";
  
  // Evita duplicação se já estiver anexado
  if (formElement.querySelector(".coupon-field-group")) {
    return formElement._couponState || null;
  }

  let state = {
    informed: false,
    code: "",
    isOpen: false
  };

  formElement._couponState = state;

  const container = document.createElement("div");
  container.className = "coupon-field-group is-collapsed";
  container.innerHTML = `
    <button type="button" class="coupon-toggle-btn">
      <span class="coupon-toggle-left">
        <span class="coupon-toggle-icon">🏷</span>
        <span>Informar cupom</span>
      </span>
      <span class="coupon-toggle-arrow">˅</span>
    </button>

    <div class="coupon-valid-card" style="display: none;">
      <div class="coupon-valid-info">
        <div class="coupon-valid-title">
          <span>✓</span>
          <span class="coupon-valid-title-text">Cupom</span>
        </div>
        <div class="coupon-valid-desc">Verificação no atendimento</div>
      </div>
      <button type="button" class="coupon-remove-btn">Remover</button>
    </div>

    <div class="coupon-box" style="display: none;">
      <div class="coupon-box-header">
        <label class="coupon-label" for="coupon-input-${formId}">CUPOM DE DESCONTO</label>
        <button type="button" class="coupon-close-btn" title="Fechar">✕</button>
      </div>
      <div class="coupon-input-row">
        <input
          id="coupon-input-${formId}"
          type="text"
          class="coupon-input"
          placeholder="Digite o código"
          maxlength="30"
        />
        <button type="button" class="coupon-apply-btn">CONFIRMAR</button>
      </div>
      <div class="coupon-msg" style="display: none;"></div>
    </div>
  `;

  // Localiza o botão submit do formulário para inserir o cupom logo acima dele
  const submitButton = formElement.querySelector('button[type="submit"]');
  if (submitButton) {
    formElement.insertBefore(container, submitButton);
  } else {
    formElement.appendChild(container);
  }

  // Elementos internos
  const toggleBtn = container.querySelector(".coupon-toggle-btn");
  const couponBox = container.querySelector(".coupon-box");
  const closeBtn = container.querySelector(".coupon-close-btn");
  const inputEl = container.querySelector(".coupon-input");
  const applyBtn = container.querySelector(".coupon-apply-btn");
  const validCard = container.querySelector(".coupon-valid-card");
  const validTitleText = container.querySelector(".coupon-valid-title-text");
  const removeBtn = container.querySelector(".coupon-remove-btn");
  const msgEl = container.querySelector(".coupon-msg");

  const notifyChange = () => {
    state.informed = state.code.length > 0;
    formElement._couponState = state;
    if (typeof options.onCouponChange === "function") {
      options.onCouponChange(state);
    }
  };

  const setMsg = (text) => {
    if (!text) {
      msgEl.style.display = "none";
      msgEl.textContent = "";
      return;
    }
    msgEl.style.display = "flex";
    msgEl.className = "coupon-msg coupon-msg-error";
    msgEl.textContent = `⚠️ ${text}`;
  };

  const updateUI = () => {
    container.classList.remove("is-collapsed", "is-open", "is-applied");

    if (state.code) {
      container.classList.add("is-applied");
      validTitleText.textContent = `Cupom ${state.code}`;
    } else if (state.isOpen) {
      container.classList.add("is-open");
    } else {
      container.classList.add("is-collapsed");
    }
  };

  // Toggle abrir
  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    state.isOpen = true;
    updateUI();
    setMsg(null);
    setTimeout(() => inputEl.focus(), 150);
    notifyChange();
  });

  // Toggle fechar
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      state.isOpen = false;
      updateUI();
      setMsg(null);
      notifyChange();
    });
  }

  // Input sanitization
  inputEl.addEventListener("input", () => {
    const normalized = normalizeCouponCode(inputEl.value);
    inputEl.value = normalized;
    setMsg(null);
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmCoupon();
    }
  });

  // Confirmação do cupom
  const confirmCoupon = () => {
    const sanitized = normalizeCouponCode(inputEl.value);
    if (!sanitized) {
      setMsg("Digite o código do cupom antes de continuar.");
      return;
    }

    state.code = sanitized;
    state.isOpen = false;
    setMsg(null);
    updateUI();
    notifyChange();
  };

  applyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    confirmCoupon();
  });

  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    state.code = "";
    state.isOpen = false;
    inputEl.value = "";
    setMsg(null);
    updateUI();
    notifyChange();
  });

  updateUI();
  return state;
}

/**
 * Extrai e formata o cupom no formato simples (somente o código do cupom).
 */
export function getCouponPayloadFromForm(formElement) {
  const couponState = formElement?._couponState;
  const code = couponState?.code || "";
  return {
    cupom: code
  };
}
