# 📋 Guia de Integração: Classificação de Origem de Leads (`[Origem: ... ]`)

Este documento serve como especificação técnica para o seu **CRM** conseguir ler as mensagens recebidas via WhatsApp do site e classificar automaticamente os leads nos canais:
- 🔍 **Google Ads**
- 📸 **Meta Ads**
- 🌐 **Site**

---

## 💡 1. Como Funciona a Comunicação do Site para o CRM

Quando um visitante chega ao site e clica para falar no WhatsApp, o site injeta automaticamente a origem no final da mensagem padrão:

> *"Olá! Gostaria de um orçamento para meu equipamento. **[Origem: Google Ads]**"*

### Tabela de Mapeamento de Tags

| Tag na Mensagem Recebida | Origem no Site | Campo `Canal de Entrada` no CRM |
| :--- | :--- | :--- |
| `[Origem: Google Ads]` | Anúncio do Google (`gclid`, `gbraid`, `wbraid`, UTMs de Google) | **Google Ads** 🔍 |
| `[Origem: Meta Ads]` | Anúncio do Facebook / Instagram (`fbclid`, UTMs de Meta) | **Meta Ads** 📸 |
| `[Origem: Site]` | Acesso direto ou navegação padrão | **Site** 🌐 |
| `[Origem: Google Orgânico]` | Busca orgânica no Google | **Site** 🌐 (ou *Google Orgânico*) |
| `[Origem: Redes Sociais]` | Links orgânicos de redes sociais | **Site** 🌐 (ou *Redes Sociais*) |
| `[Origem: Anúncio (...)]` | Anúncio de outra plataforma | **Google Ads** / **Meta Ads** / **Anúncio Pago** |

---

## 🔍 2. Expressão Regular (Regex) para Extração

Para extrair o valor da tag da mensagem inicial recebida no WhatsApp, utilize a expressão:

```regex
\[Origem:\s*([^\]]+)\]
```

- **Captura no Grupo 1**: Retorna exatamente a string dentro dos colchetes (ex: `"Google Ads"`, `"Meta Ads"`, `"Site"`).

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

  // Executa a expressão regular na mensagem
  const match = messageText.match(/\[Origem:\s*([^\]]+)\]/i);
  if (!match) return 'Site';

  const rawOrigin = match[1].trim();

  if (rawOrigin === 'Google Ads') {
    return 'Google Ads';
  }

  if (rawOrigin === 'Meta Ads') {
    return 'Meta Ads';
  }

  // Fallback para 'Site' (se for Google Orgânico, Redes Sociais ou Site)
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

    match = re.search(r"\[Origem:\s*([^\]]+)\]", message_text, re.IGNORECASE)
    if not match:
        return "Site"

    raw_origin = match[1].strip()

    if raw_origin == "Google Ads":
        return "Google Ads"
    elif raw_origin == "Meta Ads":
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
const match = text.match(/\[Origem:\s*([^\]]+)\]/i);
const rawOrigin = match ? match[1].trim() : "Site";

let canalEntrada = "Site";
if (rawOrigin === "Google Ads") canalEntrada = "Google Ads";
else if (rawOrigin === "Meta Ads") canalEntrada = "Meta Ads";

return {
  ...$json,
  canal_de_entrada: canalEntrada
};
```

---

### 🔹 Exemplo 4: Supabase / PostgreSQL (Trigger de Inserção)

Se as mensagens do WhatsApp entram direto em uma tabela SQL antes de criar o lead:

```sql
CREATE OR REPLACE FUNCTION fn_classificar_canal_lead()
RETURNS TRIGGER AS $$
DECLARE
  v_origem TEXT;
BEGIN
  -- Extrai o texto contido em [Origem: ...]
  v_origem := substring(NEW.mensagem FROM '\[Origem:\s*([^\]]+)\]');

  IF v_origem = 'Google Ads' THEN
    NEW.canal_de_entrada := 'Google Ads';
  ELSIF v_origem = 'Meta Ads' THEN
    NEW.canal_de_entrada := 'Meta Ads';
  ELSE
    NEW.canal_de_entrada := 'Site';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para executar antes de inserir um novo lead
CREATE TRIGGER trg_classificar_canal_lead
BEFORE INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION fn_classificar_canal_lead();
```

---

## 🧪 4. Como Testar a Integração Ponta a Ponta

1. **Teste do Google Ads**:
   - Acesse no navegador: `https://sigelinformatica.com.br/?gclid=test_gclid_123`
   - Clique no botão do WhatsApp.
   - Verifique se a mensagem preenchida é: `Olá! Gostaria de um orçamento para meu equipamento. [Origem: Google Ads]`.
   - Envie a mensagem e confirme se no CRM o campo **Canal de Entrada** é registrado como **Google Ads**.

2. **Teste do Meta Ads**:
   - Acesse no navegador: `https://sigelinformatica.com.br/?fbclid=test_fbclid_456`
   - Clique no WhatsApp e envie a mensagem contendo `[Origem: Meta Ads]`.
   - Confirme se o CRM atribui o canal **Meta Ads**.

3. **Teste do Site (Orgânico/Direto)**:
   - Acesse a homepage limpa: `https://sigelinformatica.com.br/`
   - Clique no WhatsApp e envie a mensagem contendo `[Origem: Site]`.
   - Confirme se o CRM atribui o canal **Site**.
