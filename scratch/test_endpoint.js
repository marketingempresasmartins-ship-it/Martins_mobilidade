// Script de teste - rode com: node scratch/test_endpoint.js SUA_URL_DO_APPS_SCRIPT
const ENDPOINT = process.argv[2] || "COLE_SUA_URL_AQUI";

const payload = {
  actionType: "lead",
  nome: "TESTE CUPOM DIRETO",
  whatsapp: "(00) 00000-0000",
  email: "teste@teste.com",
  interesse: "Teste Direto",
  mensagem: "",
  origem: "teste_direto_terminal",
  enviadoEm: new Date().toISOString(),
  tempoNaPagina: 1,
  temperaturaLead: "Frio",
  scoreLead: 0,
  id: "test-" + Date.now(),
  cupom: "CUPOM_TESTE_DIRETO",
  cupom_codigo: "CUPOM_TESTE_DIRETO"
};

console.log("\n Enviando payload para:", ENDPOINT);
console.log(" Campos de cupom enviados:");
console.log("   cupom:", payload.cupom);
console.log("   cupom_codigo:", payload.cupom_codigo);

fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "text/plain" },
  body: JSON.stringify(payload),
  redirect: "follow"
})
  .then((res) => res.text())
  .then((text) => {
    console.log("\n Resposta do Google Apps Script:");
    console.log(text);
    console.log("\n Verifique a planilha:");
    console.log("   Coluna M deve ter APENAS: CUPOM_TESTE_DIRETO");
    console.log("   Se aparecer SIM/VALIDO/NAO_INFORMADO = script ANTIGO ainda publicado");
  })
  .catch((err) => {
    console.error("Erro:", err.message);
  });
