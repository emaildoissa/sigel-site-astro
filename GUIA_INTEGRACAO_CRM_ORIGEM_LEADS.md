# 📋 Guia de Integração: Classificação de Origem de Leads (`(Ref: #SG-...)`)

Este documento serve como especificação técnica para o seu **CRM** conseguir ler as mensagens recebidas via WhatsApp do site e classificar automaticamente os leads nos canais:
- 🔍 **Google Ads** (`#SG-GAD`)
- 📸 **Meta Ads** (`#SG-MET`)
- 🌐 **Site** (`#SG-WEB`)

---

## 💡 1. Como Funciona a Comunicação do Site para o CRM

Quando um visitante clica para falar no WhatsApp, o site insere discretamente um código de referência de atendimento no final da mensagem padrão:

> *"Olá! Gostaria de um orçamento para meu equipamento. **(Ref: #SG-GAD)**"*

### Tabela de Mapeamento de Tags

| Tag na Mensagem Recebida | Origem do Visitante no Site | Campo `Canal de Entrada` no CRM |
| :--- | :--- | :--- |
| `(Ref: #SG-GAD)` | Anúncio do Google (`gclid`, `gbraid`, `wbraid`, UTMs de Google) | **Google Ads** 🔍 |
| `(Ref: #SG-MET)` | Anúncio do Facebook / Instagram (`fbclid`, UTMs de Meta) | **Meta Ads** 📸 |
| `(Ref: #SG-WEB)` | Acesso direto ou busca orgânica no site | **Site** 🌐 |

---

## 🔍 2. Expressão Regular (Regex) para Extração

Para extrair a referência da mensagem recebida no WhatsApp, utilize a expressão:

```regex
#SG-(GAD|MET|WEB)
```

- **Captura do Código (Grupo 1)**:
  - `GAD` ➔ **Google Ads**
  - `MET` ➔ **Meta Ads**
  - `WEB` ➔ **Site**

---

## 💻 3. Exemplos de Implementação em Código para o CRM

### 🔹 Exemplo 1: Node.js / TypeScript (Express / NestJS / Webhook API)

```typescript
/**
 * Função utilitária para extrair e normalizar o canal de entrada do lead.
 * @param messageText Texto da primeira mensagem enviada pelo cliente no WhatsApp
 */
export function parseLeadChannel(messageText: string): 'Google Ads' | 'Meta Ads' | 'Site' {
  if (!messageText) return 'Site';

  const match = messageText.match(/#SG-(GAD|MET|WEB)/i);
  if (!match) return 'Site';

  const code = match[1].toUpperCase();

  if (code === 'GAD') return 'Google Ads';
  if (code === 'MET') return 'Meta Ads';
  return 'Site';
}
```

---

### 🔹 Exemplo 2: Python (FastAPI / Django / Flask)

```python
import re

def parse_lead_channel(message_text: str) -> str:
    """Extrai o canal de entrada da mensagem recebida do WhatsApp."""
    if not message_text:
        return "Site"

    match = re.search(r"#SG-(GAD|MET|WEB)", message_text, re.IGNORECASE)
    if not match:
        return "Site"

    code = match.group(1).upper()

    if code == "GAD":
        return "Google Ads"
    elif code == "MET":
        return "Meta Ads"
    else:
        return "Site"
```

---

### 🔹 Exemplo 3: Automação no n8n / Make / Zapier

Se a entrada dos leads no CRM passa por uma automação (ex: Webhook da Evolution API, Z-API, Baileys):

**No Nó de Código / JavaScript:**
```javascript
const text = $json.message || $json.body?.text || "";
const match = text.match(/#SG-(GAD|MET|WEB)/i);
const code = match ? match[1].toUpperCase() : "WEB";

let canalEntrada = "Site";
if (code === "GAD") canalEntrada = "Google Ads";
else if (code === "MET") canalEntrada = "Meta Ads";

return {
  ...$json,
  canal_de_entrada: canalEntrada
};
```

---

## 🧪 4. Como Testar a Integração Ponta a Ponta

1. **Teste do Google Ads**:
   - Acesse no navegador: `https://sigelinformatica.com.br/?gclid=test_gclid_123`
   - Clique no botão do WhatsApp.
   - Verifique se a mensagem preenchida é: `Olá! Gostaria de um orçamento para meu equipamento. (Ref: #SG-GAD)`.
   - Confirme se no CRM o campo **Canal de Entrada** é registrado como **Google Ads**.

2. **Teste do Meta Ads**:
   - Acesse no navegador: `https://sigelinformatica.com.br/?fbclid=test_fbclid_456`
   - Clique no WhatsApp e verifique a tag `(Ref: #SG-MET)`.
   - Confirme se o CRM atribui o canal **Meta Ads**.

3. **Teste do Site (Orgânico/Direto)**:
   - Acesse a homepage limpa: `https://sigelinformatica.com.br/`
   - Clique no WhatsApp e verifique a tag `(Ref: #SG-WEB)`.
   - Confirme se o CRM atribui o canal **Site**.
