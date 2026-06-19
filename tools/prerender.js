import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configura caminhos para rodar como módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function prerender() {
  try {
    console.log("Iniciando pré-renderização estática (SSG) da Landing Page...");
    
    // Importa dinamicamente a ShoppingPage (Landing Page principal)
    const shoppingPageModule = await import("../src/pages/ShoppingPage.js");
    const htmlContent = shoppingPageModule.ShoppingPage();
    
    const distIndexPath = path.resolve(__dirname, "../dist/index.html");
    
    if (!fs.existsSync(distIndexPath)) {
      throw new Error(`Arquivo dist/index.html não encontrado no caminho: ${distIndexPath}`);
    }
    
    let indexHtml = fs.readFileSync(distIndexPath, "utf8");
    
    // Substitui o container vazio do app pelo HTML pré-renderizado
    const appPlaceholder = '<div id="app"></div>';
    if (indexHtml.includes(appPlaceholder)) {
      indexHtml = indexHtml.replace(appPlaceholder, `<div id="app">${htmlContent}</div>`);
      fs.writeFileSync(distIndexPath, indexHtml, "utf8");
      console.log("Pré-renderização concluída com sucesso! Conteúdo HTML injetado no dist/index.html.");
    } else {
      console.warn("Aviso: Placeholder <div id='app'></div> não encontrado no index.html. O arquivo já foi modificado?");
    }
  } catch (error) {
    console.error("Erro durante a pré-renderização:", error);
    process.exit(1);
  }
}

prerender();
