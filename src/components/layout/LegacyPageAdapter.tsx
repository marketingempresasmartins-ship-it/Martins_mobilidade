import { useEffect, useRef } from "react";
import type { LegacyRoute } from "../../router/routes";
import { trackPageView } from "../../services/analyticsStorage.js";

type LegacyPageAdapterProps = {
  normalizedPath: string;
  route: LegacyRoute;
};

const ROUTE_BODY_CLASSES = ["product-light-body", "ventura-body"];

const METADATA_MAPPING: Record<string, { description: string; image: string }> = {
  home: {
    description: "Martins Tech em Manaus. Concessionária oficial de motos, scooters e utilitários elétricos das marcas Watts, Ventura, Amazon Motors e Importway.",
    image: "/assets/watts/hero-bg-wide-new.jpg"
  },
  catalogo: {
    description: "Confira o catálogo completo de veículos e utilitários elétricos na Martins Tech Manaus. Escolha o seu modelo e simule uma proposta.",
    image: "/assets/watts/w160s-carousel.webp"
  },
  produto: {
    description: "Ficha técnica e detalhes do veículo elétrico. Encontre especificações, autonomia e solicite cotação na Martins Tech.",
    image: "/assets/watts/w160s-carousel.webp"
  },
  watts: {
    description: "Conheça a linha Watts de motos elétricas na Martins Tech. W160s, W-Trail e scooters com alta tecnologia e suporte local em Manaus.",
    image: "/assets/watts/w160s-carousel.webp"
  },
  ventura: {
    description: "Explore a linha Ventura Off-Road e Náutica Premium na Martins Tech. Quadriciclos e Jets elétricos de alta performance em Manaus.",
    image: "/assets/ventura/lancha-ventura.webp"
  },
  "amazon-motors": {
    description: "Descubra os utilitários e triciclos de carga da Amazon Motors na Martins Tech. Veículos elétricos fabricados no Polo Industrial de Manaus.",
    image: "/assets/watts/quadriciclo-eletrico.webp"
  },
  importway: {
    description: "Mini veículos elétricos e brinquedos da Importway na Martins Tech. Diversão garantida, segura e sustentável para toda a família.",
    image: "/assets/importway/bike-carousel.webp"
  }
};

function scrollToCurrentHash() {
  if (!window.location.hash) {
    window.scrollTo({ top: 0, behavior: "auto" });
    return;
  }

  requestAnimationFrame(() => {
    document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

export function LegacyPageAdapter({ normalizedPath, route }: LegacyPageAdapterProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 1. Atualizar Título
    document.title = route.title;

    // 2. Atualizar Metadados de SEO baseados no ID da Rota
    const metaData = METADATA_MAPPING[route.id] || METADATA_MAPPING.home;
    
    const updateMeta = (selector: string, attribute: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const parts = selector.replace('meta[', '').replace(']', '').split('=');
        if (parts.length === 2) {
          const attrName = parts[0];
          const attrVal = parts[1].replace(/"/g, '');
          element.setAttribute(attrName, attrVal);
          document.head.appendChild(element);
        }
      }
      element.setAttribute(attribute, content);
    };

    updateMeta('meta[name="description"]', 'content', metaData.description);
    updateMeta('meta[property="og:title"]', 'content', route.title);
    updateMeta('meta[property="og:description"]', 'content', metaData.description);
    updateMeta('meta[property="og:image"]', 'content', metaData.image);

    // 3. Estilos e classes de layout
    document.documentElement.style.removeProperty("--accent");
    document.documentElement.style.removeProperty("--accent-hover");
    document.body.classList.toggle("dashboard-body", Boolean(route.dashboard));
    document.body.classList.toggle("martins-app-shell", Boolean(route.dashboard || route.appShell));
    document.body.classList.toggle("martins-landing-shell", !(route.dashboard || route.appShell));
    document.body.classList.toggle("grid-lines", !(route.dashboard || route.appShell));
    ROUTE_BODY_CLASSES.forEach((bodyClass) => {
      document.body.classList.toggle(bodyClass, route.bodyClass === bodyClass);
    });
  }, [route]);

  useEffect(() => {
    let cancelled = false;

    async function renderLegacyRoute() {
      if (!hostRef.current) return;
      try {
        const html = await route.render();
        if (cancelled) return;
        hostRef.current.innerHTML = html;
        await route.init?.();
        if (cancelled) return;

        scrollToCurrentHash();

        if (!(route.dashboard || route.appShell)) {
          trackPageView(normalizedPath, route.title);
        }
      } catch (error) {
        console.error("Erro ao renderizar rota:", error);
        if (!cancelled) {
          hostRef.current.innerHTML = `
            <div class="container" style="padding: 40px; text-align: center;">
              <h2>Erro de Carregamento</h2>
              <p>Ocorreu um erro ao carregar esta seção. Por favor, tente recarregar a página.</p>
            </div>
          `;
        }
      }
    }

    renderLegacyRoute();

    return () => {
      cancelled = true;
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [normalizedPath, route]);

  return <div ref={hostRef} data-route-id={route.id} />;
}
