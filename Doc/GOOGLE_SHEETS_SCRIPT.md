# Script do Google Sheets (Google Apps Script)

Copie e cole o código abaixo no editor de **Apps Script** da sua planilha do Google Sheets (em **Extensões** -> **Apps Script**). 

Este script processa o recebimento de leads, atualizações de status comercial e a exclusão definitiva de linhas na planilha.

## Código do Script (`Código.gs`)

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var leads = [];
  
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    
    // Ignora linhas totalmente vazias
    if (!row[1] && !row[2]) continue;

    var lead = {};
    lead.enviadoEm = row[0] ? (row[0] instanceof Date ? row[0].toISOString() : new Date(row[0]).toISOString()) : "";
    lead.nome = row[1] || "";
    lead.whatsapp = row[2] || "";
    lead.email = row[3] || "";
    lead.interesse = row[4] || "";
    lead.mensagem = row[5] || "";
    lead.origem = row[6] || "";
    lead.tempoNaPagina = row[7] || 0;
    lead.status = row[8] || "Novo";
    lead.id = row[9] || ""; // Coluna 10 (J)
    
    // Se não houver ID gravado na planilha, gera um ID baseado no índice da linha
    if (!lead.id) {
      lead.id = "lead-row-" + i;
    }
    
    leads.push(lead);
  }
  
  var result = {
    leads: leads,
    events: []
  };
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid JSON" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var actionType = data.actionType;
  
  // 1. Inserção de Novo Lead
  if (actionType === "lead") {
    sheet.appendRow([
      data.enviadoEm || new Date().toISOString(),
      data.nome || "",
      data.whatsapp || "",
      data.email || "",
      data.interesse || "",
      data.mensagem || "",
      data.origem || "",
      data.tempoNaPagina || 0,
      "Novo", // Status comercial padrão
      data.id || "" // ID gerado pelo app
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "lead" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 2. Atualização de Status Comercial
  if (actionType === "updateStatus") {
    var rows = sheet.getDataRange().getValues();
    var foundIndex = -1;
    
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      // Busca exata pelo ID (Coluna J/10) ou fallback estruturado por Nome + WhatsApp
      if ((data.leadId && row[9] === data.leadId) || 
          (row[1] === data.nome && row[2] === data.whatsapp)) {
        foundIndex = i + 1; // 1-indexed, +1 por causa do cabeçalho
        break;
      }
    }
    
    if (foundIndex !== -1) {
      sheet.getRange(foundIndex, 9).setValue(data.status); // Coluna I (9) é o Status
      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "updateStatus" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Lead não encontrado para atualizar" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 3. Deleção definitiva do Lead
  if (actionType === "deleteLead") {
    var rows = sheet.getDataRange().getValues();
    var foundIndex = -1;
    
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      // Busca exata pelo ID (Coluna J/10) ou fallback estruturado por Nome + WhatsApp
      if ((data.leadId && row[9] === data.leadId) || 
          (row[1] === data.nome && row[2] === data.whatsapp)) {
        foundIndex = i + 1;
        break;
      }
    }
    
    if (foundIndex !== -1) {
      sheet.deleteRow(foundIndex);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "deleteLead" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Lead não encontrado para deleção" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Ação não reconhecida" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Como implantar:
1. No seu Google Sheets, clique em **Extensões** -> **Apps Script**.
2. Apague o código antigo no arquivo `Código.gs` e cole o código acima.
3. Clique em **Salvar** (ícone de disquete).
4. Clique em **Implantar** (canto superior direito) -> **Nova implantação**.
5. Em "Selecionar tipo", escolha **App da Web**.
6. Preencha as configurações:
   - **Descrição**: Sincronizador de Leads Martins V2
   - **Executar como**: Me (seu e-mail da conta do Google Sheets)
   - **Quem tem acesso**: Qualquer pessoa (Anyone)
7. Clique em **Implantar**.
8. Copie a nova **URL do App da Web** gerada e cole no seu arquivo `.env` local na variável `VITE_LEAD_ENDPOINT`.
