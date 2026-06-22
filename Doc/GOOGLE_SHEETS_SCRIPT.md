# Script do Google Sheets (Google Apps Script)

Copie e cole o codigo abaixo no editor de **Apps Script** da sua planilha do Google Sheets em **Extensoes -> Apps Script**.

Este script recebe leads, atualiza status comercial, exclui linhas e agora grava duas colunas de priorizacao:

- `Temperatura`: `Quente` ou `Frio`
- `Score`: pontuacao de 0 a 100 calculada pelo site

## Colunas da planilha

Use esta ordem no cabecalho:

`Data/Hora | Nome | WhatsApp | E-mail | Interesse | Mensagem | Origem | Tempo na Pagina (s) | Temperatura | Score | Status | ID`

## Codigo do Script (`Codigo.gs`)

```javascript
function isHotCold(value) {
  return value === "Quente" || value === "Frio";
}

function isNewLeadFormat(row) {
  return isHotCold(row[8]) || typeof row[9] === "number";
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var leads = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (!row[1] && !row[2]) continue;

    var newFormat = isNewLeadFormat(row);
    var lead = {};

    lead.enviadoEm = row[0] ? (row[0] instanceof Date ? row[0].toISOString() : new Date(row[0]).toISOString()) : "";
    lead.nome = row[1] || "";
    lead.whatsapp = row[2] || "";
    lead.email = row[3] || "";
    lead.interesse = row[4] || "";
    lead.mensagem = row[5] || "";
    lead.origem = row[6] || "";
    lead.tempoNaPagina = row[7] || 0;
    lead.temperaturaLead = newFormat ? (row[8] || "Frio") : "";
    lead.scoreLead = newFormat ? (row[9] || 0) : "";
    lead.status = newFormat ? (row[10] || "Novo") : (row[8] || "Novo");
    lead.id = newFormat ? (row[11] || "") : (row[9] || "");

    if (!lead.id) {
      lead.id = "lead-row-" + i;
    }

    leads.push(lead);
  }

  return ContentService.createTextOutput(JSON.stringify({ leads: leads, events: [] }))
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
      data.temperaturaLead || "Frio",
      data.scoreLead || 0,
      "Novo",
      data.id || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "lead" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (actionType === "updateStatus") {
    var rows = sheet.getDataRange().getValues();
    var foundIndex = -1;

    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if ((data.leadId && (row[11] === data.leadId || row[9] === data.leadId)) ||
          (row[1] === data.nome && row[2] === data.whatsapp)) {
        foundIndex = i + 1;
        break;
      }
    }

    if (foundIndex !== -1) {
      var foundRow = rows[foundIndex - 1];
      var statusColumn = isNewLeadFormat(foundRow) ? 11 : 9;
      sheet.getRange(foundIndex, statusColumn).setValue(data.status);

      return ContentService.createTextOutput(JSON.stringify({ status: "success", action: "updateStatus" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Lead nao encontrado para atualizar" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (actionType === "deleteLead") {
    var rows = sheet.getDataRange().getValues();
    var foundIndex = -1;

    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if ((data.leadId && (row[11] === data.leadId || row[9] === data.leadId)) ||
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

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Lead nao encontrado para delecao" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Acao nao reconhecida" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Como implantar

1. No Google Sheets, clique em **Extensoes -> Apps Script**.
2. Apague o codigo antigo em `Codigo.gs` e cole o codigo acima.
3. Salve.
4. Clique em **Implantar -> Nova implantacao**.
5. Escolha **App da Web**.
6. Use:
   - **Executar como**: voce
   - **Quem tem acesso**: qualquer pessoa
7. Implante e copie a URL para `VITE_LEAD_ENDPOINT`.
