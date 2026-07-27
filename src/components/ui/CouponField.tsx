import React, { useState, useEffect, useRef } from "react";
import { MARTINS_CONFIG } from "../../config/martinsConfig.js";

export type CouponStatus = "idle" | "validating" | "valid" | "invalid" | "pending";

export type CouponState = {
  informed: boolean;
  code: string;
  status: CouponStatus;
  campaign?: string;
  customerMessage?: string;
};

type CouponFieldProps = {
  formId: string;
  selectedModel?: string;
  onCouponChange?: (couponState: CouponState) => void;
};

/**
 * Normaliza o código do cupom:
 * - Remove espaços no início e no final
 * - Converte para maiúsculas
 * - Aceita apenas A-Z, 0-9, hífen (-) e underline (_)
 * - Limita a 30 caracteres
 */
export function normalizeCouponCode(rawCode: string): string {
  if (!rawCode) return "";
  let clean = rawCode.trim().toUpperCase();
  clean = clean.replace(/[^A-Z0-9_-]/g, "");
  return clean.slice(0, 30);
}

export function CouponField({ formId, selectedModel = "", onCouponChange }: CouponFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [status, setStatus] = useState<CouponStatus>("idle");
  const [campaign, setCampaign] = useState<string>("");
  const [customerMessage, setCustomerMessage] = useState<string>("");
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "error" | "warning" | "info" } | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const prevModelRef = useRef<string>(selectedModel);

  const isApplied = status === "valid" || status === "pending";

  // Notifica o formulário pai sempre que o estado do cupom mudar
  useEffect(() => {
    const informed = isApplied && couponCode.length > 0;
    
    if (onCouponChange) {
      onCouponChange({
        informed,
        code: isApplied ? couponCode : "",
        status: isApplied ? status : "idle",
        campaign,
        customerMessage
      });
    }
  }, [isOpen, couponCode, status, campaign, customerMessage, onCouponChange]);

  // Foco automático no input ao abrir a área de cupom
  useEffect(() => {
    if (isOpen && !isApplied && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isApplied]);

  // Revalidação do cupom ao trocar o modelo de veículo selecionado
  useEffect(() => {
    const modelChanged = prevModelRef.current !== selectedModel;
    prevModelRef.current = selectedModel;

    if (modelChanged && isApplied && couponCode) {
      validateCoupon(couponCode, selectedModel, true);
    }
  }, [selectedModel]);

  const handleToggleOpen = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsOpen(true);
    setFeedbackMsg(null);
  };

  const handleToggleClose = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    setFeedbackMsg(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeCouponCode(e.target.value);
    setCouponCode(normalized);
    if (feedbackMsg) setFeedbackMsg(null);
    if (status !== "idle" && status !== "validating") {
      setStatus("idle");
    }
  };

  const validateCoupon = async (codeToValidate: string, modelToValidate: string, isModelChange = false) => {
    const sanitizedCode = normalizeCouponCode(codeToValidate);

    if (!sanitizedCode) {
      setFeedbackMsg({ text: "Digite um cupom antes de continuar.", type: "error" });
      setStatus("idle");
      return;
    }

    setStatus("validating");
    setFeedbackMsg({ text: "Validando cupom...", type: "info" });

    // Se o endpoint do Apps Script não estiver configurado, aceitamos como pendente imediatamente
    if (!MARTINS_CONFIG.leadEndpoint) {
      setStatus("pending");
      setCampaign("Campanha Promocional");
      setCustomerMessage("Será verificado no atendimento");
      setFeedbackMsg(null);
      setIsOpen(false);
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
          couponCode: sanitizedCode,
          selectedModel: modelToValidate,
          formId: formId
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }

      const data = await response.json();

      if (data && data.valid) {
        setStatus("valid");
        setCampaign(data.campaign || "Campanha Promocional");
        setCustomerMessage(data.customerMessage || "Condição especial de cupom");
        setFeedbackMsg(null);
        setIsOpen(false);
      } else {
        setStatus("invalid");
        setCampaign("");
        setCustomerMessage("");
        const errorText = isModelChange
          ? "O cupom aplicado não está disponível para o novo modelo selecionado."
          : (data?.message || "Cupom inválido, expirado ou indisponível para este modelo.");
        setFeedbackMsg({ text: errorText, type: "error" });
      }
    } catch (err) {
      console.warn("Falha na comunicação ao validar cupom. Definido como pendente:", err);
      // Em caso de offline ou timeout: aceita o cupom e marca como pendente_validacao para o consultor comercial
      setStatus("pending");
      setCampaign("Verificação no Atendimento");
      setCustomerMessage("Será verificado pelo consultor no atendimento");
      setFeedbackMsg(null);
      setIsOpen(false);
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    validateCoupon(couponCode, selectedModel);
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponCode("");
    setStatus("idle");
    setCampaign("");
    setCustomerMessage("");
    setFeedbackMsg(null);
    setIsOpen(false);
  };

  return (
    <div className={`coupon-field-group ${isApplied ? "is-applied" : isOpen ? "is-open" : "is-collapsed"}`}>
      {/* 1. Estado Cupom APLICADO (Válido ou Pendente): Card verde compacto com botão Remover */}
      {isApplied && (
        <div className="coupon-valid-card">
          <div className="coupon-valid-info">
            <div className="coupon-valid-title">
              <span>✓</span>
              <span>Cupom {couponCode} aplicado</span>
            </div>
            {customerMessage && (
              <div className="coupon-valid-desc">{customerMessage}</div>
            )}
          </div>
          <button
            type="button"
            className="coupon-remove-btn"
            onClick={handleRemoveCoupon}
          >
            Remover
          </button>
        </div>
      )}

      {/* 2. Estado Recolhido: Apenas o botão "Informar cupom" */}
      {!isApplied && !isOpen && (
        <button
          type="button"
          className="coupon-toggle-btn"
          onClick={handleToggleOpen}
        >
          <span className="coupon-toggle-left">
            <span className="coupon-toggle-icon">🏷</span>
            <span>Informar cupom</span>
          </span>
          <span className="coupon-toggle-arrow">˅</span>
        </button>
      )}

      {/* 3. Estado Revelado: Caixa de digitação do cupom com botão Fechar */}
      {!isApplied && isOpen && (
        <div className="coupon-box">
          <div className="coupon-box-header">
            <label className="coupon-label" htmlFor={`coupon-input-${formId}`}>
              CUPOM DE DESCONTO
            </label>
            <button
              type="button"
              className="coupon-close-btn"
              onClick={handleToggleClose}
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="coupon-input-row">
            <input
              id={`coupon-input-${formId}`}
              ref={inputRef}
              type="text"
              className="coupon-input"
              placeholder="Digite o código"
              value={couponCode}
              onChange={handleInputChange}
              maxLength={30}
              disabled={status === "validating"}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  validateCoupon(couponCode, selectedModel);
                }
              }}
            />
            <button
              type="button"
              className="coupon-apply-btn"
              onClick={handleApplyClick}
              disabled={status === "validating"}
            >
              {status === "validating" ? (
                <>
                  <span className="coupon-spinner-icon" />
                  <span>APLICANDO...</span>
                </>
              ) : (
                "APLICAR"
              )}
            </button>
          </div>

          {/* Mensagem de Feedback */}
          {feedbackMsg && (
            <div className={`coupon-msg coupon-msg-${feedbackMsg.type}`}>
              {feedbackMsg.type === "error" && "⚠️ "}
              {feedbackMsg.type === "warning" && "ℹ️ "}
              {feedbackMsg.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
