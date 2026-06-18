const PREVIEW_NOTICE_SESSION_KEY = "martins_preview_notice_dismissed_v2";

function canUseSessionStorage() {
  try {
    const testKey = "__martins_preview_notice_test__";
    sessionStorage.setItem(testKey, "1");
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function buildPreviewNotice() {
  const wrapper = document.createElement("div");
  wrapper.className = "preview-notice";
  wrapper.setAttribute("role", "presentation");
  wrapper.innerHTML = `
    <div class="preview-notice__backdrop" data-preview-notice-close></div>
    <section class="preview-notice__dialog" role="dialog" aria-modal="true" aria-labelledby="preview-notice-title" aria-describedby="preview-notice-description" tabindex="-1">
      <button class="preview-notice__close" type="button" aria-label="Fechar aviso" data-preview-notice-close>
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="preview-notice__eyebrow">Aviso de preview</div>
      <h2 id="preview-notice-title">P&aacute;gina em visualiza&ccedil;&atilde;o</h2>
      <p id="preview-notice-description">
        Esta landing page ainda n&atilde;o est&aacute; completamente finalizada. Ela serve apenas para visualiza&ccedil;&atilde;o e valida&ccedil;&atilde;o inicial da experi&ecirc;ncia.
      </p>
      <ul class="preview-notice__list">
        <li>Dados, textos, produtos, especifica&ccedil;&otilde;es e simula&ccedil;&otilde;es podem estar em formato mock ou demonstrativo.</li>
        <li>Os leads de teste s&atilde;o salvos apenas em um DB interno local do navegador, sem envio para nuvem ou servidor.</li>
        <li>Para visualizar os leads na dashboard, use a landing e a dashboard no mesmo navegador e no mesmo endere&ccedil;o local.</li>
        <li>As informa&ccedil;&otilde;es devem ser revisadas e refinadas antes de colocar a p&aacute;gina em produ&ccedil;&atilde;o.</li>
        <li>Fluxos, formul&aacute;rios, integra&ccedil;&otilde;es e detalhes comerciais ainda podem precisar de ajustes finais.</li>
      </ul>
      <button class="btn btn-accent preview-notice__action" type="button" data-preview-notice-close>
        Entendi, visualizar
      </button>
    </section>
  `;

  return wrapper;
}

export function initPreviewNotice() {
  if (!document.body || document.querySelector(".preview-notice")) return;

  const hasSessionStorage = canUseSessionStorage();
  if (hasSessionStorage && sessionStorage.getItem(PREVIEW_NOTICE_SESSION_KEY) === "true") {
    return;
  }

  const notice = buildPreviewNotice();
  const dialog = notice.querySelector(".preview-notice__dialog");

  function closeNotice() {
    notice.classList.add("preview-notice--closing");
    document.body.classList.remove("preview-notice-open");

    if (hasSessionStorage) {
      sessionStorage.setItem(PREVIEW_NOTICE_SESSION_KEY, "true");
    }

    setTimeout(() => {
      notice.remove();
      document.removeEventListener("keydown", handleKeydown);
    }, 180);
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      closeNotice();
    }
  }

  notice.querySelectorAll("[data-preview-notice-close]").forEach((button) => {
    button.addEventListener("click", closeNotice);
  });

  document.body.appendChild(notice);
  document.body.classList.add("preview-notice-open");
  document.addEventListener("keydown", handleKeydown);
  dialog?.focus({ preventScroll: true });
}
