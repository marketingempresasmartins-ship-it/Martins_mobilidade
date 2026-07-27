import React, { useState, useEffect, useRef } from "react";

export type CouponState = {
  informed: boolean;
  code: string;
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
 * - Aceita letras, números, hífen (-) e underline (_)
 * - Limita a 30 caracteres
 */
export function normalizeCouponCode(rawCode: string): string {
  if (!rawCode) return "";
  let clean = rawCode.trim().toUpperCase();
  clean = clean.replace(/[^A-Z0-9_-]/g, "");
  return clean.slice(0, 30);
}

export function CouponField({ formId, onCouponChange }: CouponFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Notifica o formulário pai sempre que o estado do cupom mudar
  useEffect(() => {
    if (onCouponChange) {
      onCouponChange({
        informed: isApplied && couponCode.length > 0,
        code: isApplied ? couponCode : ""
      });
    }
  }, [isApplied, couponCode, onCouponChange]);

  // Foco automático no input ao abrir a área de cupom
  useEffect(() => {
    if (isOpen && !isApplied && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isApplied]);

  const handleToggleOpen = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsOpen(true);
    setErrorMsg(null);
  };

  const handleToggleClose = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    setErrorMsg(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = normalizeCouponCode(e.target.value);
    setCouponCode(normalized);
    if (errorMsg) setErrorMsg(null);
  };

  const handleConfirmClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const sanitized = normalizeCouponCode(couponCode);
    if (!sanitized) {
      setErrorMsg("Digite o código do cupom antes de continuar.");
      return;
    }
    setCouponCode(sanitized);
    setIsApplied(true);
    setIsOpen(false);
    setErrorMsg(null);
  };

  const handleRemoveCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    setCouponCode("");
    setIsApplied(false);
    setIsOpen(false);
    setErrorMsg(null);
  };

  const containerClass = `coupon-field-group ${
    isApplied ? "is-applied" : isOpen ? "is-open" : "is-collapsed"
  }`;

  return (
    <div className={containerClass}>
      {/* 1. Estado Cupom APLICADO / INFORMADO: Card verde compacto com botão Remover */}
      {isApplied && (
        <div className="coupon-valid-card">
          <div className="coupon-valid-info">
            <div className="coupon-valid-title">
              <span>✓</span>
              <span>Cupom {couponCode}</span>
            </div>
            <div className="coupon-valid-desc">Verificação no atendimento</div>
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

      {/* 2. Estado Recolhido: Botão "Informar cupom" */}
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

      {/* 3. Estado Revelado: Caixa de digitação do cupom */}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleConfirmClick(e as any);
                }
              }}
            />
            <button
              type="button"
              className="coupon-apply-btn"
              onClick={handleConfirmClick}
            >
              CONFIRMAR
            </button>
          </div>

          {errorMsg && (
            <div className="coupon-msg coupon-msg-error">
              ⚠️ {errorMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
