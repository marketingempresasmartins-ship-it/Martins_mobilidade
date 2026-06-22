const SPECIFIC_INTEREST_RE = /ventura|watts|amazon|importway|w160|w125|trail|scooter|quad|lancha|jet|bike|triciclo|moto/i;

function asNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasSpecificInterest(value) {
  const interest = String(value || "").trim();
  if (!interest) return false;

  const generic = [
    "nao informado",
    "não informado",
    "escolha o veículo",
    "escolha o veiculo",
    "outro modelo",
    "ajuda comercial"
  ];

  return !generic.some((term) => interest.toLowerCase().includes(term));
}

export function calculateLeadTemperature(rawLead = {}) {
  let score = 0;
  const reasons = [];

  const seconds = asNumber(rawLead.tempoNaPagina);
  if (seconds >= 120) {
    score += 35;
    reasons.push("2min+ na página");
  } else if (seconds >= 60) {
    score += 25;
    reasons.push("1min+ na página");
  } else if (seconds >= 30) {
    score += 15;
    reasons.push("30s+ na página");
  } else if (seconds >= 15) {
    score += 8;
    reasons.push("15s+ na página");
  }

  const interest = rawLead.interesse || rawLead.modelo || "";
  if (hasSpecificInterest(interest)) {
    score += 20;
    reasons.push("interesse específico");
  }

  if (SPECIFIC_INTEREST_RE.test(String(interest))) {
    score += 8;
  }

  const phoneDigits = String(rawLead.whatsapp || rawLead.telefone || rawLead.phone || "").replace(/\D/g, "");
  if (phoneDigits.length >= 10) {
    score += 15;
    reasons.push("WhatsApp válido");
  }

  if (String(rawLead.email || "").includes("@")) {
    score += 8;
    reasons.push("e-mail informado");
  }

  const messageLength = String(rawLead.mensagem || "").trim().length;
  if (messageLength >= 40) {
    score += 12;
    reasons.push("mensagem detalhada");
  } else if (messageLength >= 15) {
    score += 6;
  }

  const source = String(rawLead.origem || "").toLowerCase();
  if (source.includes("produto_detalhe")) {
    score += 12;
    reasons.push("veio da ficha do produto");
  } else if (source.includes("popup_proposta")) {
    score += 8;
  } else if (source.includes("hero")) {
    score += 5;
  }

  const cappedScore = Math.min(100, score);

  return {
    temperaturaLead: cappedScore >= 60 ? "Quente" : "Frio",
    scoreLead: cappedScore,
    motivoTemperatura: reasons.join(", ") || "Poucos sinais de intenção"
  };
}

export function enrichLeadTemperature(rawLead = {}) {
  const calculated = calculateLeadTemperature(rawLead);

  return {
    ...rawLead,
    temperaturaLead: rawLead.temperaturaLead || rawLead.temperatura || calculated.temperaturaLead,
    scoreLead: rawLead.scoreLead ?? rawLead.score ?? calculated.scoreLead,
    motivoTemperatura: rawLead.motivoTemperatura || calculated.motivoTemperatura
  };
}
