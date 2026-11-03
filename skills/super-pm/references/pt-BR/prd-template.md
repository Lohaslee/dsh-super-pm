# Template de PRD Adaptativo

Escolha o menor artefato que sustenta a próxima decisão. Use o resumo de uma página para trabalho solo, alinhamento inicial ou handoff compacto de decisão. Use o PRD completo apenas quando o usuário solicitar ou quando o produto estiver pronto para implementação ou entrega. Um PRD é um veículo para decisões de produto, não prova de que o produto foi compreendido.

## Resumo de Decisão em Uma Página

Não rotule este resumo como `Pronto para implementação`. Mantenha-o em uma página quando possível:

1. **Decisão**: a pergunta de decisão, recomendação direta e maturidade.
2. **Valor para o usuário**: usuário principal, situação, necessidade não atendida, alternativa atual e promessa decisiva do produto.
3. **Fronteira Negativa**: `não deve`, `não agora`, restrições rígidas e qualidades protegidas.
4. **Escopo**: `obrigatório`, `depois` e `não faremos`.
5. **Evidência**: fatos conhecidos, suposição de maior impacto, objeção mais forte e o que reverteria a decisão.
6. **Próxima validação**: método mais barato, amostra, limite, responsável e próxima ação.

Use as demais seções apenas para o PRD completo.

Mantenha o núcleo curto. Adicione apenas os módulos do tipo de produto que afetam a entrega. Não preencha seções por completude; escreva `Não aplicável` ou `Pendente` com um motivo.

No topo, declare:

- **Maturidade do artefato**: `Snapshot`, `Rascunho` ou `Pronto para implementação`.
- **Cobertura**: discussão, evidência, estado do repositório ou produto, dimensões selecionadas e dimensões excluídas.
- **Lacunas conhecidas**: decisões ou evidências que bloqueiam o próximo nível de maturidade.
- **Modelo de colaboração**: `Conselho dinâmico` ou `Colaboração Lead-PM`, incluindo o Lead PM quando selecionado.
- **Handoff pretendido**: agente de código de IA, time de engenharia, design, operações, manufatura, entrega de serviço ou outro responsável.

Quando solicitado antes da descoberta estar completa, produza o PRD imediatamente a partir de informações confirmadas. Nunca converta informação ausente em prosa confiante.

## Núcleo 1. Resumo da Decisão de Produto

- Definição do produto em uma frase.
- Usuário principal, cliente, beneficiário, comprador ou operador e situação.
- Alternativa atual e barreira de troca.
- Promessa do produto e mecanismo decisivo.
- Sinal primário de sucesso e guardrails.
- Decisão recomendada e maturidade atual.
- Lead PM e Responsável Primário pela decisão atual quando relevante.

## Núcleo 2. Fronteira Negativa

### Não deve

### Não agora

### Restrições rígidas

### Qualidades protegidas

Para cada item, declare a decisão de produto e o critério de aceitação que ele restringe.

## Núcleo 3. Evidência, Suposições e Validação

| Afirmação | Tipo: fato, fala do usuário, suposição, inferência ou recomendação | Confiança | Status de validação |
|---|---|---|---|

Para cada suposição de alto impacto, inclua:

| Hipótese | Comportamento ou resultado previsto | Método e amostra | Limite de decisão | Resultado observado | Interpretação | Decisão alterada ou mantida |
|---|---|---|---|---|---|---|

Deixe os campos de resultado como `Pendente` até existir evidência. Registre se o usuário autorizou pesquisa externa, inspeção de concorrentes ou execução de protótipo.

## Núcleo 4. Dimensões de Produto Selecionadas

Use [product-dimensions.md](product-dimensions.md). Inclua apenas dimensões que mudam o produto:

- **Demanda e valor**: participantes, situação, necessidade, alternativa, troca de valor, objetivo.
- **Sistema do produto**: mecanismo, fronteira do sistema, componentes, regras, economia, escopo.
- **Uso e entrega**: ciclo de uso, operação, propriedade, cumprimento, suporte e recuperação.
- **Pontos de contato e forma**: interface, dispositivo, forma física, serviço, canal, ambiente ou pontos de comunicação.
- **Experiência e confiança**: caráter do produto, compreensão, feedback, sinais de qualidade, acessibilidade, segurança e confiança.

Para cada dimensão selecionada, declare a conclusão e a decisão que ela restringe.

## Módulos por Tipo de Produto

Inclua apenas quando alterarem uma decisão de entrega ou produto:

### Software ou Produto de IA

- Jornada, estado, permissões, exceções, falha e recuperação.
- Contrato de dados, confiabilidade, avaliação, fallback e supervisão humana.
- Integrações, limites de plataforma, migração e compatibilidade.

### Hardware

- Forma física, ambiente de uso, fabricação, tolerâncias, manutenção e descarte.
- Custo por unidade, confiabilidade, certificação e logística.

### Serviço ou Operação

- Papéis operacionais, playbooks, SLA, escalonamento e recuperação de serviço.
- Custo de atendimento, treinamento e consistência de qualidade.

### Conteúdo ou Marketplace

- Papéis dos participantes, troca de valor, incentivos, permissões e governança.
- Oferta, demanda, liquidez, cold start, qualidade, ranking e descoberta.
- Criação, revisão, moderação, disputa, abuso e caminhos de recurso.
- Saúde do ecossistema e métricas de guardrail por parte.

### Comercialização e Adoção

- Empacotamento, precificação, margem, vendas, canal e economia unitária.
- Aquisição, onboarding, educação, migração e plano de troca.
- Promessa de lançamento, prova, mecanismo de reputação, retenção e expansão.
- Suposições comerciais e limites que mudariam o plano.

## Registro de Decisões Materiais

Inclua apenas decisões em que alternativas ou divergências de lentes mudaram o desfecho:

| Pergunta de decisão | Responsável Primário | Recomendação direta | Desafiante e teste nomeado | Evidência | Decisão final | Alternativa rejeitada | Gatilho de revisão |
|---|---|---|---|---|---|---|---|
