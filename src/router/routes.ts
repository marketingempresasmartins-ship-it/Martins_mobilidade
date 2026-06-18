import { initLandingInteractions } from "../interactions/initLandingInteractions.js";
import { HomePage } from "../pages/HomePage.js";
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

export function getRoute(pathname: string): LegacyRoute {
  const path = normalizePath(pathname);

  if (path === "/") {
    return { id: "home", render: HomePage, init: initLandingInteractions, title: "Martins Mobilidade Manaus" };
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

  if (path === "/dashboard") {
    return { id: "dashboard", render: DashboardPage, init: initDashboardPage, title: "Dashboard | Martins Mobilidade", dashboard: true };
  }

  if (path === "/dashboard2") {
    return { id: "dashboard", render: DashboardPage, init: initDashboardPage, title: "Dashboard | Martins Mobilidade", dashboard: true };
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
