export function initCustomSelect() {
  const customSelect = document.getElementById("customSelect");
  const selectTrigger = customSelect?.querySelector(".custom-select-trigger span");
  const hiddenInput = document.getElementById("interesse");
  const options = Array.from(customSelect?.querySelectorAll(".custom-option") || []);

  const selectModel = (model) => {
    if (!model) return;

    const option = options.find((item) => item.getAttribute("data-value") === model);

    if (hiddenInput) hiddenInput.value = model;
    if (selectTrigger) {
      selectTrigger.innerHTML = "";
      
      const img = option?.querySelector(".dropdown-thumb")?.cloneNode(true);
      const placeholder = option?.querySelector(".dropdown-thumb-placeholder")?.cloneNode(true);
      
      if (img) {
        img.className = "dropdown-thumb-trigger";
        img.removeAttribute("style");
        selectTrigger.appendChild(img);
      } else if (placeholder) {
        placeholder.className = "dropdown-thumb-trigger";
        selectTrigger.appendChild(placeholder);
      }
      
      const spanText = option?.querySelector("span")?.textContent || option?.textContent || model;
      const textNode = document.createTextNode(" " + spanText.trim());
      selectTrigger.appendChild(textNode);
    }
    options.forEach((item) => item.classList.remove("selected"));
    option?.classList.add("selected");
  };

  customSelect?.addEventListener("click", function (event) {
    event.stopPropagation();
    this.classList.toggle("open");
  });

  options.forEach((option) => {
    option.addEventListener("click", function (event) {
      event.stopPropagation();
      selectModel(this.getAttribute("data-value"));
      customSelect.classList.remove("open");
    });
  });

  document.addEventListener("click", () => {
    customSelect?.classList.remove("open");
  });

  document.querySelectorAll("[data-interest]").forEach((button) => {
    if (button.closest("#models-carousel-section")) return;

    button.addEventListener("click", function (event) {
      const interest = this.getAttribute("data-interest");

      if (!customSelect || !hiddenInput || !document.querySelector("#hero")) {
        event.preventDefault();
        const href = `/?interesse=${encodeURIComponent(interest)}#hero`;
        window.dispatchEvent(new CustomEvent("martins:navigate", { detail: { href } }));
        return;
      }

      event.preventDefault();
      selectModel(interest);
      document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Pre-selecionar caso haja interesse na URL
  const params = new URLSearchParams(window.location.search);
  const interestParam = params.get("interesse");
  if (interestParam) {
    selectModel(interestParam);
    setTimeout(() => {
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }
}
