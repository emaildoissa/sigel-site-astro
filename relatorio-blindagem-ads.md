# Relatório de Execução — Blindagem Google Ads & Landing Pages
**Data de Atualização**: 04/09/2026  
**Objetivo**: Adequar o site e as campanhas do Google Ads à política estrita de **"Suporte Técnico de Terceiros"**, evitando reprovações e otimizando a qualidade dos anúncios para nota **Excelente**.

---

## 📌 1. O que foi feito no Site (Landing Pages Astro)

### A. Página "Substituição de Teclado" (`/servicos/hardware/troca-de-teclado`)
- **Arquivo Modificado**: `src/pages/servicos/hardware/[slug].astro`
- **Sanitização de Vocabulário**:
  - Removidas todas as ocorrências de: *"conserto"*, *"reparo"*, *"manutenção"*, *"diagnóstico"*, *"suporte técnico"*.
  - Substituído por foco em hardware físico: *"Substituição de Teclado para Notebook"*, *"Teclados Novos Originais ABNT2 (com Ç) e Internacionais"*, *"Instalação Rápida com Garantia de 90 dias"*.
- **Estrutura & FAQ**: Sintomas e FAQ reformulados sem termos de falha/quebra.

### B. Página "Substituição de Tela" (`/servicos/hardware/troca-de-tela`)
- **Arquivo Modificado**: `src/pages/servicos/hardware/[slug].astro`
- **Sanitização de Vocabulário**:
  - Removidas expressões sensíveis: *"quebrada"*, *"trincada após queda"*, *"vazamento de cristal líquido"*, *"conserto"*.
  - Substituído por: *"Substituição de Tela para Notebook"*, *"Telas Originais HD, Full HD, IPS e Touch"*, *"Instalação com Encaixe Sob Medida e Garantia"*.

### C. Hub de Hardware (`/servicos/hardware`)
- **Arquivo Modificado**: `src/pages/servicos/hardware.astro`
- Cards de serviços atualizados para *"Substituição de Teclado"* e *"Substituição de Tela de Notebook"*.

### D. Compilação e Build
- Build testado e validado com sucesso (`npm run build`), gerando 24 páginas estáticas sem nenhum erro de TypeScript.

---

## 📌 2. O que foi Configurado no Google Ads

### A. Campanha 1: Troca de Teclado
- **Status do Anúncio**: Enviado para análise.
- **Resolução de Dudas**: Esclarecido que a mensagem *"Não qualificada"* ocorria apenas devido ao status de *Campanha Pausada*, sem qualquer violação de política.
- **Qualidade do Anúncio**: Elevada de **Ruim** para **Bom/Excelente** desafixando alfinetes dos títulos e incluindo palavras-chave exatas nos títulos.

### B. Campanha 2: Troca de Tela
- **Palavras-Chave Selecionadas (Correspondência de Frase)**:
  - `"troca de tela de notebook"`, `"troca de tela notebook"`, `"trocar tela de notebook"`, `"substituicao de tela notebook"`, `"tela notebook porto alegre"`, `"tela para notebook"`, `"comprar tela notebook porto alegre"`, `"tela notebook dell porto alegre"`, `"tela notebook lenovo porto alegre"`.
- **Palavras Removidas (Evitar bloqueio/desperdício)**:
  - Removidas: `"reparo notebook"`, `"conserto de notebook porto alegre"`, `"tela de notebook quebrada"`, `"notebook em porto alegre"`.
- **15 Títulos Blindados**: Focados em substituição, peças novas, pronta entrega no Bairro Cristal e garantia de 90 dias.
- **4 Descrições Blindadas**: Focadas em rapidez de instalação, padrão de telas e garantia.

### C. Extension de Sitelinks Cadastrados
1. **Onde Estamos** (`/onde-estamos`)
2. **Fale no WhatsApp** (WhatsApp Direto)
3. **Upgrade de SSD** (`/servicos/hardware/upgrade-ssd`)
4. **Reparo de Dobradiças** (`/servicos/hardware/reparo-carcaca`)
5. **Formatação com Backup** (`/servicos/hardware/formatacao-pc`)
6. **Sobre a Sigel Informática** (`/sobre`)

---

## 🚀 3. Plano de Ação para Terça-Feira

1. **Checar Aprovação dos Anúncios**:
   - Verificar se as campanhas de **Teclado** e **Tela** foram aprovadas pelo robô do Google Ads e se já estão veiculando.
2. **Verificar Tráfego e Leads no WhatsApp**:
   - Acompanhar os primeiros cliques e contatos gerados no WhatsApp.
3. **Blindagem do Próximo Anúncio (Se necessário)**:
   - Se for criar o próximo anúncio (ex: *Upgrade de SSD* ou *Formatação com Backup*), aplicar a mesma metodologia de blindagem na página e anúncios.
