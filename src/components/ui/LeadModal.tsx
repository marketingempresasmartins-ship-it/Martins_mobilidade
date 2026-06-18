import React, { useState, useEffect, useRef } from "react";
import { saveLead } from "../../services/leadsStorage.js";
import { buildLeadWhatsAppUrl } from "../../services/whatsapp.js";
import { MARTINS_CONFIG } from "../../config/martinsConfig.js";
import { maskPhoneInput } from "../../utils/phone.js";

type LeadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialInterest: string;
  isContactForm: boolean;
};

const VEHICLE_OPTIONS = [
  { value: "Watts W160s", label: "Watts W160s (Titan Elétrica)" },
  { value: "Watts W125", label: "Watts W125 (Lançamento)" },
  { value: "Watts W-Trail", label: "Watts W-Trail (Off-Road)" },
  { value: "Scooter WS50", label: "Scooter Watts WS50" },
  { value: "Amazon Move", label: "Amazon Move (Autopropelido)" },
  { value: "Triciclo de Carga", label: "Triciclo de Carga (Amazon Motors)" },
  { value: "Jet Ventura", label: "Jet Ventura (Náutica)" },
  { value: "Outro", label: "Outro modelo / Ajuda comercial" }
];

export function LeadModal({ isOpen, onClose, initialInterest, isContactForm }: LeadModalProps) {
  const dialogRef = useRef<HTMLElement | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("Escolha o veículo");
  
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    mensagem: ""
  });

  const [buttonState, setButtonState] = useState({
    text: "",
    color: "",
    disabled: false
  });

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll while preserving the exact page position behind the modal.
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyLeft = body.style.left;
    const prevBodyRight = body.style.right;
    const prevBodyWidth = body.style.width;
    const prevBodyPaddingRight = body.style.paddingRight;
    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlScrollBehavior = html.style.scrollBehavior;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    html.style.scrollBehavior = "auto";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const preventTouch = (e: TouchEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest(".lead-modal__dialog")) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventTouch, { passive: false });

    requestAnimationFrame(() => {
      dialogRef.current?.focus({ preventScroll: true });
    });

    return () => {
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.left = prevBodyLeft;
      body.style.right = prevBodyRight;
      body.style.width = prevBodyWidth;
      body.style.paddingRight = prevBodyPaddingRight;
      html.style.overflow = prevHtmlOverflow;
      document.removeEventListener("touchmove", preventTouch);
      window.scrollTo({ top: scrollY, left: 0, behavior: "auto" });
      requestAnimationFrame(() => {
        html.style.scrollBehavior = prevHtmlScrollBehavior;
      });
    };
  }, [isOpen]);

  // Set initial interest when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialInterest) {
        const option = VEHICLE_OPTIONS.find(
          (opt) =>
            opt.value.toLowerCase() === initialInterest.toLowerCase() ||
            opt.label.toLowerCase().includes(initialInterest.toLowerCase())
        );
        setSelectedVehicle(option ? option.value : initialInterest);
      } else {
        setSelectedVehicle("Escolha o veículo");
      }

      setFormData({
        nome: "",
        whatsapp: "",
        email: "",
        mensagem: ""
      });

      setButtonState({
        text: isContactForm ? "Falar com Consultor →" : "Solicitar Proposta →",
        color: "",
        disabled: false
      });
    }
  }, [isOpen, initialInterest, isContactForm]);

  // Close dropdown on click outside
  useEffect(() => {
    const clickOutside = () => setIsDropdownOpen(false);
    document.addEventListener("click", clickOutside);
    return () => document.removeEventListener("click", clickOutside);
  }, []);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskPhoneInput(e.target.value);
    setFormData((prev) => ({ ...prev, whatsapp: masked }));
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOptionSelect = (value: string) => {
    setSelectedVehicle(value);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isContactForm && (selectedVehicle === "Escolha o veículo" || !selectedVehicle)) {
      alert("Por favor, selecione um veículo de interesse.");
      return;
    }

    setButtonState({
      text: "Enviando...",
      color: "rgba(255, 255, 255, 0.4)",
      disabled: true
    });

    const leadData: Record<string, any> = {
      nome: formData.nome,
      whatsapp: formData.whatsapp,
      email: formData.email || undefined,
      origem: isContactForm ? "landing_martins_popup_contato" : "landing_martins_popup_proposta",
      enviadoEm: new Date().toISOString()
    };

    if (isContactForm) {
      leadData.mensagem = formData.mensagem;
    } else {
      leadData.interesse = selectedVehicle;
    }

    // Calculate duration spent on current page
    const pageStartTime = (window as any).pageStartTime || Date.now();
    const secondsSpent = Math.round((Date.now() - pageStartTime) / 1000);
    leadData.tempoNaPagina = secondsSpent;

    try {
      const savedLead = await saveLead(leadData);
      
      if (typeof window !== "undefined") {
        (window as any).lastSubmittedLeadId = savedLead.id;
      }

      const successColor = "#7BE721";

      if (MARTINS_CONFIG.leadEndpoint) {
        const response = await fetch(MARTINS_CONFIG.leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadData)
        });

        if (!response.ok) throw new Error("Erro de rede ao enviar.");

        setButtonState({
          text: "✓ Enviado com sucesso!",
          color: successColor,
          disabled: true
        });
      } else {
        const waUrl = buildLeadWhatsAppUrl(leadData, MARTINS_CONFIG);
        if (waUrl) {
          setButtonState({
            text: "✓ Cotação registrada. Abrindo WhatsApp...",
            color: successColor,
            disabled: true
          });
          setTimeout(() => {
            window.open(waUrl, "_blank", "noopener");
          }, 800);
        } else {
          setButtonState({
            text: "✓ Cotação registrada!",
            color: successColor,
            disabled: true
          });
        }
      }

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      setButtonState({
        text: "⚠ Erro ao enviar. Tente novamente.",
        color: "#E53935",
        disabled: false
      });

      setTimeout(() => {
        setButtonState({
          text: isContactForm ? "Falar com Consultor →" : "Solicitar Proposta →",
          color: "",
          disabled: false
        });
      }, 4000);
    }
  };

  return (
    <div className="lead-modal" role="presentation">
      <div className="lead-modal__backdrop" onClick={onClose}></div>
      <section
        ref={dialogRef}
        className="lead-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-modal-title"
        tabIndex={-1}
      >
        <button
          className="lead-modal__close"
          type="button"
          aria-label="Fechar modal"
          onClick={onClose}
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <div className="lead-modal__eyebrow">
          {isContactForm ? "Contato Direto" : "Solicitar Proposta"}
        </div>
        <h2 id="lead-modal-title">
          {isContactForm ? "Fale Conosco" : "Simule sua Proposta"}
        </h2>
        <p className="lead-modal-subtitle">
          {isContactForm
            ? "Deixe sua mensagem e retornaremos em poucos minutos."
            : "Preencha seus dados para receber valores de financiamento ou simulação."}
        </p>

        <form onSubmit={handleSubmit} className="raw-form">
          <div className="form-group">
            <label htmlFor="m-nome">Nome completo</label>
            <input
              type="text"
              id="m-nome"
              name="nome"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="m-tel">Telefone / WhatsApp</label>
            <input
              type="tel"
              id="m-tel"
              name="whatsapp"
              placeholder="(92) 99292-5353"
              value={formData.whatsapp}
              onChange={handlePhoneChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="m-email">E-mail para retorno</label>
            <input
              type="email"
              id="m-email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          {isContactForm ? (
            <div className="form-group">
              <label htmlFor="m-msg">Mensagem / Dúvida</label>
              <textarea
                id="m-msg"
                name="mensagem"
                placeholder="Dúvidas sobre autonomia, financiamento, test ride ou visitas..."
                value={formData.mensagem}
                onChange={handleInputChange}
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Modelo de interesse</label>
              <div className="custom-select-wrapper">
                <div
                  className={`custom-select ${isDropdownOpen ? "open" : ""}`}
                  onClick={handleDropdownClick}
                >
                  <div className="custom-select-trigger">
                    <span>
                      {VEHICLE_OPTIONS.find((o) => o.value === selectedVehicle)?.label ||
                        selectedVehicle}
                    </span>
                    <div className="arrow"></div>
                  </div>
                  <div className="custom-select-options">
                    {VEHICLE_OPTIONS.map((opt) => (
                      <div
                        key={opt.value}
                        className={`custom-option ${
                          selectedVehicle === opt.value ? "selected" : ""
                        }`}
                        onClick={() => handleOptionSelect(opt.value)}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-accent btn-primary"
            style={{
              width: "100%",
              marginTop: "16px",
              backgroundColor: buttonState.color || "",
              borderColor: buttonState.color ? "transparent" : "",
              color: buttonState.color ? "#000" : ""
            }}
            disabled={buttonState.disabled}
          >
            {buttonState.text}
          </button>
        </form>
      </section>
    </div>
  );
}
