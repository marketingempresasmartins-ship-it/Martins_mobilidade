import { initLandingInteractions } from "../interactions/initLandingInteractions.js";
import { HomePage } from "../pages/HomePage.js";
import { ShoppingPage } from "../pages/ShoppingPage.js";
import { CatalogoPage, initCatalogPage } from "../pages/CatalogPage.js";
import { ProdutoPage, initProductPage } from "../pages/ProductPage.js";
import { WattsPage } from "../pages/WattsPage.js";
import { VenturaPage, initVenturaPage } from "../pages/VenturaPage.js";
import { AmazonMotorsPage, initAmazonMotorsPage } from "../pages/AmazonMotorsPage.js";
import { ImportwayPage } from "../pages/ImportwayPage.js";
import { DashboardPage, initDashboardPage } from "../pages/DashboardPage.js";

export type LegacyRoute = {
  id: string;
  title: string;
  render: () => string;
  init?: () => void | Promise<void>;
  dashboard?: boolean;
  appShell?: boolean;
  bodyClass?: string;
};

export const legacyPaths: Record<string, string> = {
  "/index.html": "/",
  "/catalogo.html": "/catalogo",
  "/produto.html": "/produto",
  "/watts.html": "/watts",
  "/ventura.html": "/ventura",
  "/amazon-motors.html": "/amazon-motors",
  "/importway.html": "/importway",
  "/dashboard.html": "/dashboard",
  "/dashboard2.html": "/dashboard2"
};

export function normalizePath(pathname: string) {
  const legacyPath = legacyPaths[pathname];
  if (legacyPath) return legacyPath;
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

// Trava de segurança para desativar rotas secundárias (pode ser desativada via código alterando para false)
const LOCK_SECONDARY_ROUTES = true;

export function getRoute(pathname: string): LegacyRoute {
  const path = normalizePath(pathname);

  // 1. Rota principal: agora mapeada para a Landing Page simplificada (ShoppingPage)
  if (path === "/") {
    return { id: "home", render: ShoppingPage, init: initLandingInteractions, title: "Martins Mobilidade Manaus" };
  }

  // 2. Dashboards: sempre acessíveis para visualização de leads e analytics
  if (path === "/dashboard") {
    return { id: "dashboard", render: DashboardPage, init: initDashboardPage, title: "Dashboard | Martins Mobilidade", dashboard: true };
  }

  if (path === "/dashboard2") {
    return { id: "dashboard", render: DashboardPage, init: initDashboardPage, title: "Dashboard | Martins Mobilidade", dashboard: true };
  }

  // 3. Se a trava de segurança estiver ativa, bloqueia e redireciona todas as outras rotas para 404
  if (LOCK_SECONDARY_ROUTES) {
    return {
      id: "not-found",
      render: () => `
        <main class="not-found-page">
          <div class="container">
            <h1>Pagina nao encontrada</h1>
            <p>Essa rota nao existe no app da Martins Mobilidade.</p>
            <a class="btn btn-accent" href="/">Voltar para a landing</a>
          </div>
        </main>
      `,
      init: initLandingInteractions,
      title: "Pagina nao encontrada | Martins Mobilidade"
    };
  }

  // 4. Rotas secundárias originais (só acessíveis se LOCK_SECONDARY_ROUTES for false)
  if (path === "/shopping") {
    return { id: "shopping", render: ShoppingPage, init: initLandingInteractions, title: "Ação Shopping | Martins Mobilidade" };
  }

  if (path === "/catalogo") {
    return {
      id: "catalogo",
      render: CatalogoPage,
      init: () => {
        initLandingInteractions();
        initCatalogPage();
      },
      title: "Catalogo | Martins Mobilidade"
    };
  }

  if (path === "/produto" || path.startsWith("/produto/")) {
    return {
      id: "produto",
      render: ProdutoPage,
      init: () => {
        initLandingInteractions();
        initProductPage();
      },
      title: "Ficha do Veiculo | Martins Mobilidade",
      bodyClass: "product-light-body"
    };
  }

  if (path === "/watts") {
    return { id: "watts", render: WattsPage, init: initLandingInteractions, title: "Linha Watts | Martins Mobilidade" };
  }

  if (path === "/ventura") {
    return {
      id: "ventura",
      render: VenturaPage,
      init: () => {
        initLandingInteractions();
        initVenturaPage();
      },
      title: "Linha Ventura | Martins Mobilidade",
      bodyClass: "ventura-body"
    };
  }

  if (path === "/amazon-motors") {
    return {
      id: "amazon-motors",
      render: AmazonMotorsPage,
      init: () => {
        initLandingInteractions();
        initAmazonMotorsPage();
      },
      title: "Amazon Motors | Martins Mobilidade"
    };
  }

  if (path === "/importway") {
    return { id: "importway", render: ImportwayPage, init: initLandingInteractions, title: "Importway | Martins Mobilidade" };
  }

  return {
    id: "not-found",
    render: () => `
      <main class="not-found-page">
        <div class="container">
          <h1>Pagina nao encontrada</h1>
          <p>Essa rota nao existe no app da Martins Mobilidade.</p>
          <a class="btn btn-accent" href="/">Voltar para a landing</a>
        </div>
      </main>
    `,
    init: initLandingInteractions,
    title: "Pagina nao encontrada | Martins Mobilidade"
  };
}
