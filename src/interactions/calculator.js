export function initEconomyCalculator() {
  const kmSlider = document.getElementById("kmSlider");
  const simDailyKm = document.getElementById("simDailyKm");
  const simGasValue = document.getElementById("simGasValue");
  const simElecValue = document.getElementById("simElecValue");
  const simSavingsValue = document.getElementById("simSavingsValue");
  const simSavingsAnnualValue = document.getElementById("simSavingsAnnualValue");
  const gasBar = document.getElementById("simGasBar");
  const elecBar = document.getElementById("simElecBar");
  const presetBtns = document.querySelectorAll(".preset-btn");

  if (!kmSlider) return;

  const updateSimulation = () => {
    const dailyKm = parseInt(kmSlider.value, 10);
    const minVal = parseInt(kmSlider.min, 10) || 10;
    const maxVal = parseInt(kmSlider.max, 10) || 150;
    
    // Atualizar label do slider
    if (simDailyKm) simDailyKm.textContent = dailyKm;

    // Sincronizar preenchimento da trilha do slider
    const percent = ((dailyKm - minVal) / (maxVal - minVal)) * 100;
    kmSlider.style.background = `linear-gradient(to right, var(--accent) ${percent}%, #edf0f3 ${percent}%)`;

    // Cálculo proporcional (referência 40km/dia: gasolina = 560, elétrica = 65)
    const referenceKm = 40;
    const factor = dailyKm / referenceKm;

    const gasCost = Math.round(560 * factor);
    const elecCost = Math.round(65 * factor);
    const savings = gasCost - elecCost;
    const annualSavings = savings * 12;

    if (simGasValue) simGasValue.textContent = `R$ ${gasCost} /mês`;
    if (simElecValue) simElecValue.textContent = `R$ ${elecCost} /mês`;
    if (simSavingsValue) simSavingsValue.textContent = savings;
    if (simSavingsAnnualValue) {
      simSavingsAnnualValue.textContent = `R$ ${annualSavings.toLocaleString('pt-BR')}`;
    }

    // Sincronizar barras comparativas de gasolina vs elétrica
    const maxGasCost = 560 * (maxVal / referenceKm);
    const gasPercent = Math.max(5, (gasCost / maxGasCost) * 100);
    const elecPercent = Math.max(5, (elecCost / maxGasCost) * 100);

    if (gasBar) gasBar.style.width = `${gasPercent}%`;
    if (elecBar) elecBar.style.width = `${elecPercent}%`;

    // Sincronizar classe ativa nos botões presets
    presetBtns.forEach(btn => {
      const btnKm = parseInt(btn.getAttribute("data-km"), 10);
      if (btnKm === dailyKm) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  };

  kmSlider.addEventListener("input", updateSimulation);

  // Escutar cliques nos presets
  presetBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetKm = btn.getAttribute("data-km");
      if (targetKm) {
        kmSlider.value = targetKm;
        updateSimulation();
      }
    });
  });
  
  // Sincronizar no carregamento inicial
  updateSimulation();
}
