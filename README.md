# Martins Tech Landing

Landing page da Martins Tech em Manaus.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente:

```text
http://127.0.0.1:5173
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Variáveis disponíveis:

- `VITE_WHATSAPP_NUMBER`: número com DDI e DDD, somente dígitos. Exemplo: `5592999999999`
- `VITE_INSTAGRAM_URL`: URL do Instagram oficial
- `VITE_CONTACT_EMAIL`: e-mail comercial
- `VITE_ADDRESS`: endereço da filial
- `VITE_LEAD_ENDPOINT`: webhook para receber leads, se existir

Se `VITE_LEAD_ENDPOINT` não for preenchido, o formulário salva o lead no `localStorage` e tenta abrir o WhatsApp quando `VITE_WHATSAPP_NUMBER` estiver configurado.

## Build

```bash
npm run build
```

Os arquivos finais ficam em `dist/`.
