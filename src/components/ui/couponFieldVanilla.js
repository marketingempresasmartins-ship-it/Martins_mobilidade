import { MARTINS_CONFIG } from "../../config/martinsConfig.js";

/**
 * Normaliza o código do cupom:
 * - Remove espaços no início e no final
 * - Converte para maiúsculas
 * - Aceita apenas A-Z, 0-9, hífen (-) e underline (_)
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

  const getSelectedModel = typeof options.getModel === "function"
    ? options.getModel
    : () => {
        const select = formElement.querySelector('select[name="interesse"]') || formElement.querySelector('[name="selectedModel"]');
        return select ? select.value : "";
      };

  let state = {
    informed: false,
    code: "",
    status: "idle", // idle | validating | valid | invalid | pending
    campaign: "",
    customerMessage: "",
    isOpen: false
  };

  formElement._couponState = state;

  const container = document.createElement("div");
  container.className = "coupon-field-group";
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
          <span class="coupon-valid-title-text">Cupom aplicado</span>
        </div>
        <div class="coupon-valid-desc"></div>
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
        <button type="button" class="coupon-apply-btn">APLICAR</button>
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
  const validDesc = container.querySelector(".coupon-valid-desc");
  const removeBtn = container.querySelector(".coupon-remove-btn");
  const msgEl = container.querySelector(".coupon-msg");

  const notifyChange = () => {
    const isApplied = state.status === "valid" || state.status === "pending";
    state.informed = isApplied && state.code.length > 0;
    formElement._couponState = state;
    if (typeof options.onCouponChange === "function") {
      options.onCouponChange(state);
    }
  };

  const setMsg = (text, type) => {
    if (!text) {
      msgEl.style.display = "none";
      msgEl.textContent = "";
      msgEl.className = "coupon-msg";
      return;
    }
    msgEl.style.display = "flex";
    msgEl.className = `coupon-msg coupon-msg-${type}`;
    const icon = type === "error" ? "⚠️ " : type === "warning" ? "ℹ️ " : "";
    msgEl.textContent = `${icon}${text}`;
  };

  const updateUI = () => {
    const isApplied = state.status === "valid" || state.status === "pending";

    container.classList.remove("is-collapsed", "is-open", "is-applied");

    if (isApplied) {
      container.classList.add("is-applied");
      validTitleText.textContent = `Cupom ${state.code} aplicado`;
      validDesc.textContent = state.customerMessage || "Condição especial aplicada";
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
    state.code = normalized;
    if (state.status !== "idle" && state.status !== "validating") {
      state.status = "idle";
    }
    setMsg(null);
    notifyChange();
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateCoupon();
    }
  });

  // Validação do cupom
  const validateCoupon = async (isModelChange = false) => {
    const codeToValidate = normalizeCouponCode(inputEl.value);

    if (!codeToValidate) {
      setMsg("Digite um cupom antes de continuar.", "error");
      state.status = "idle";
      notifyChange();
      return;
    }

    state.status = "validating";
    applyBtn.disabled = true;
    applyBtn.innerHTML = '<span class="coupon-spinner-icon"></span> APLICANDO...';
    setMsg("Validando cupom...", "info");
    notifyChange();

    const modelToValidate = getSelectedModel();

    if (!MARTINS_CONFIG.leadEndpoint) {
      state.status = "pending";
      state.code = codeToValidate;
      state.campaign = "Campanha Promocional";
      state.customerMessage = "Será verificado no atendimento";
      state.isOpen = false;
      applyBtn.disabled = false;
      applyBtn.textContent = "APLICAR";
      setMsg(null);
      updateUI();
      notifyChange();
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(MARTINS_CONFIG.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "validate_coupon",
          actionType: "validate_coupon",
          couponCode: codeToValidate,
          selectedModel: modelToValidate,
          formId: formId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      applyBtn.disabled = false;
      applyBtn.textContent = "APLICAR";

      if (data && data.valid) {
        state.status = "valid";
        state.code = codeToValidate;
        state.campaign = data.campaign || "Campanha Promocional";
        state.customerMessage = data.customerMessage || "Condição especial de cupom";
        state.isOpen = false;
        setMsg(null);
      } else {
        state.status = "invalid";
        state.campaign = "";
        state.customerMessage = "";
        const errorText = isModelChange
          ? "O cupom aplicado não está disponível para o novo modelo selecionado."
          : (data?.message || "Cupom inválido, expirado ou indisponível para este modelo.");
        setMsg(errorText, "error");
      }
    } catch (err) {
      console.warn("Falha de conexão na validação do cupom. Status definido como pendente:", err);
      applyBtn.disabled = false;
      applyBtn.textContent = "APLICAR";
      state.status = "pending";
      state.code = codeToValidate;
      state.campaign = "Verificação no Atendimento";
      state.customerMessage = "Será verificado pelo consultor no atendimento";
      state.isOpen = false;
      setMsg(null);
    }

    updateUI();
    notifyChange();
  };

  applyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    validateCoupon();
  });

  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    state.code = "";
    state.status = "idle";
    state.campaign = "";
    state.customerMessage = "";
    state.isOpen = false;
    inputEl.value = "";
    setMsg(null);
    updateUI();
    notifyChange();
  });

  // Revalidação em caso de alteração no modelo de veículo selecionado
  const selectElement = formElement.querySelector('select[name="interesse"]') || formElement.querySelector('[name="selectedModel"]');
  if (selectElement) {
    selectElement.addEventListener("change", () => {
      const isApplied = state.status === "valid" || state.status === "pending";
      if (isApplied && state.code) {
        validateCoupon(true);
      }
    });
  }

  updateUI();
  return state;
}

/**
 * Extrai e formata os dados do cupom prontos para envio no payload de lead.
 */
export function getCouponPayloadFromForm(formElement) {
  const couponState = formElement?._couponState;
  if (!couponState || !couponState.informed || !couponState.code) {
    return {
      coupon: { informed: false, code: "", status: "NAO_INFORMADO", campaign: "" },
      cupom_informado: "NAO",
      cupom_codigo: "",
      cupom_status: "NAO_INFORMADO",
      cupom_campanha: "",
      cupom_beneficio: "",
      cupom_validado_em: ""
    };
  }

  let finalStatus = "NAO_INFORMADO";
  if (couponState.status === "valid") finalStatus = "VALIDO";
  else if (couponState.status === "invalid") finalStatus = "INVALIDO";
  else if (couponState.status === "pending") finalStatus = "PENDENTE_VALIDACAO";

  return {
    coupon: {
      informed: true,
      code: couponState.code,
      status: finalStatus,
      campaign: couponState.campaign || ""
    },
    cupom_informado: "SIM",
    cupom_codigo: couponState.code,
    cupom_status: finalStatus,
    cupom_campanha: couponState.campaign || "",
    cupom_beneficio: couponState.customerMessage || "",
    cupom_validado_em: new Date().toISOString()
  };
}
