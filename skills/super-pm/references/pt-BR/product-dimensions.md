# Dimensões Adaptativas de Produto

Use este framework como um mapa de decisão, não uma sequência fixa nem um checklist de completude. Ele precisa funcionar para software, IA, hardware, serviços, conteúdo, marketplaces, produtos corporativos e experiências offline.

Sempre resolva demanda, valor e a Fronteira Negativa. Selecione as demais dimensões e restrições transversais apenas quando puderem mudar a decisão de produto. Declare o que foi intencionalmente pulado.

## Regra de Seleção

Comece pelo sistema real de entrega do produto:

| Tipo de produto | Costuma enfatizar | Adicione quando material |
|---|---|---|
| Software ou app | demanda e valor; sistema do produto; ciclo de uso; pontos de contato | dados, privacidade, acessibilidade, distribuição, suporte |
| Produto de IA | demanda e valor; mecanismo habilitado por modelo; interação e recuperação; confiança | direitos sobre dados, incerteza, supervisão humana, avaliação, custo |
| Hardware ou produto físico | sistema do produto; ciclo de uso e propriedade; forma física | manufatura, fornecimento, segurança, reparo, embalagem, varejo |
| Serviço | demanda e valor; jornada do serviço; pessoas e operações; recuperação | capacidade, treinamento, roteiros, local, política, economia unitária |
| Conteúdo ou comunidade | demanda e valor; sistema de conteúdo; ciclo de participação | governança, recomendação, incentivos a criadores, moderação |
| Marketplace ou plataforma | valor multipartite; regras e incentivos; ciclo de transação | liquidez, confiança, disputas, conformidade, saúde do ecossistema |
| Produto corporativo | valor para stakeholders; ajuste a fluxo de trabalho e sistema; ciclo de adoção | compras, permissões, integração, migração, administração |
| Lugar ou evento offline | demanda e valor; jornada espacial e de serviço; pontos de contato físicos | capacidade, equipe, segurança, acessibilidade, clima, logística |

A tabela é um ponto de partida, não uma taxonomia. Um produto pode combinar vários tipos.

## Modelo de Dependência

`Fronteira Negativa -> demanda e valor -> mecanismo do produto e fronteira do sistema -> ciclo de uso e entrega -> pontos de contato e forma -> experiência e confiança -> critérios de aceitação`

Esta é uma direção de dependência, não um modelo em cascata. Uma contradição a jusante deve reabrir a decisão afetada mais antiga e propagar a mudança adiante.

## 1. Demanda e Valor

Inclua sempre esta dimensão.

Responda:

- Quem é o usuário principal, cliente, beneficiário, comprador ou operador numa situação específica?
- Que progresso, desfecho, alívio, identidade ou obrigação importa para eles?
- O que fazem hoje, e por que essa alternativa ainda é aceitável?
- Que valor é criado, trocado, capturado ou imposto a cada participante importante?
- Por que este problema vale a pena resolver agora?
- Qual resultado observável provaria a aposta do produto?

Produza:

- Participantes primários e excluídos.
- Situação, necessidade não atendida, alternativa atual e barreira de troca.
- Promessa e objetivo do produto.
- Troca de valor e um sinal primário de sucesso com guardrails.
- Suposições estratégicas e validação mais barata.

Saia quando o produto puder ser descrito sem listar funcionalidades ou pontos de contato.

## 2. Sistema do Produto e Escopo

Use esta dimensão quando o produto combinar capacidades, conteúdo, dados, componentes físicos, serviços, pessoas, parceiros ou regras.

Responda:

- Qual é o menor mecanismo coerente capaz de entregar a promessa?
- Quais componentes e capacidades são essenciais, e quais são padrões familiares mas desnecessários?
- Onde o produto começa e termina? O que pertence a usuários, parceiros, equipe ou sistemas externos?
- Quais regras, economia, dependências e limiares de qualidade mantêm o sistema unido?
- O que precisa estar completo para o valor central ser crível?

Produza:

- Mecanismo do produto e fronteira do sistema.
- Componentes, capacidades, conteúdo, dados, pessoas e responsabilidades de parceiros quando relevante.
- Escopo `obrigatório`, `depois` e `não faremos`.
- Regras de negócio, limiares de qualidade e fronteiras de aceitação.
- Rastreabilidade de cada item `obrigatório` até a promessa do produto.

Saia quando remover qualquer item `obrigatório` restante quebrar a promessa e adicionar um item `depois` for desnecessário para testá-la.

## 3. Ciclo de Uso, Operação e Entrega

Use esta dimensão sempre que o valor depender de uma sequência ao longo do tempo, incluindo descoberta, compra, configuração, uso, cumprimento, manutenção, suporte, renovação, descarte ou devolução.

Responda:

- Como o produto chega ao usuário e fica pronto para uso?
- O que usuários, equipe, sistemas, fornecedores ou parceiros fazem em cada estágio significativo?
- Onde a jornada pode falhar, pausar, transferir, recuperar, escalar ou terminar?
- O que acontece antes do primeiro uso e depois do momento principal de valor?
- Qual capacidade operacional é necessária para sustentar a promessa repetidamente?

Produza:

- Ciclo de usuário, serviço, operação ou propriedade conforme relevante.
- Estados, transições, transferências e pontos de decisão.
- Caminhos de cumprimento, manutenção, suporte, devolução, interrupção e recuperação quando relevante.
- Papéis, níveis de serviço e dependências operacionais.
- Contenção de falhas e comportamento de escalonamento.

Saia quando o produto puder ser entregue repetidamente sem inventar um ator, estado, transferência ou regra de recuperação ausente.

## 4. Pontos de Contato e Forma

Use esta dimensão para cada lugar onde uma pessoa, organização ou sistema encontra o produto.

Pontos de contato podem incluir telas, APIs, conversas com IA, dispositivos, controles, forma física, embalagem, varejo, ambientes, equipe de serviço, documentos, notificações, canais ou comunicação de marca.

Responda:

- Qual ponto de contato deve carregar cada decisão, ação ou informação?
- O que deve ser visível, tangível, próximo, persistente, progressivo ou intencionalmente ausente?
- Qual forma melhor se ajusta à situação, ambiente, capacidade e restrição?
- Como o usuário sabe o estado atual e a próxima ação?
- Quais convenções devem ser preservadas, e onde o produto deve se distinguir?

Produza:

- Inventário de pontos de contato e propósito.
- Forma de interface, física, espacial, conversacional, de serviço ou de canal conforme relevante.
- Hierarquia de informação e controle.
- Navegação, descobribilidade, embalagem ou arranjo ambiental quando relevante.
- Representações de baixa fidelidade apenas quando ajudarem a resolver uma decisão de produto.

Saia quando a forma escolhida expressar o ciclo de vida e as regras do produto sem inventar novas.

Para produtos digitais fortemente baseados em interface, a sequência clássica de cinco planos pode ser usada como ferramenta aninhada: estratégia mapeia para demanda e valor, escopo para sistema do produto, estrutura para ciclo de vida e relações de informação, framework para arranjo de interface e superfície para expressão da experiência. Não a imponha a produtos em que decisões físicas, operacionais, comerciais ou de serviço dominam.

## 5. Experiência, Confiança e Caráter do Produto

Use esta dimensão sempre que adoção, compreensão, emoção, segurança, reputação ou uso repetido dependerem de como o produto é percebido e sentido.

Responda:

- Como o produto deve parecer na situação-alvo?
- Quais sinais sensoriais, verbais, comportamentais, materiais ou interpessoais esclarecem qualidade e estado?
- O que os usuários precisam entender ou confiar antes de agir?
- Como o produto se comporta durante espera, incerteza, falha, recuperação, manutenção e saída?
- Qual expressão violaria a Fronteira Negativa ou o caráter do produto?

Produza:

- Caráter do produto e princípios de confiança.
- Direção visual, material, espacial, verbal, de movimento, áudio, háptica ou de serviço conforme relevante.
- Feedback, definição de expectativas, prova e linguagem de recuperação.
- Acessibilidade, inclusão, privacidade e restrições sensoriais.
- Referências positivas, referências negativas e expressões proibidas quando útil.

Saia quando a experiência reforçar compreensão, valor e confiança sem esconder uma fraqueza do sistema do produto ou da entrega.

## Restrições Transversais

Verifique apenas as restrições capazes de mudar a decisão:

- **Negócio e economia**: precificação, estrutura de custos, incentivos, receita, ciclo de caixa, sustentabilidade.
- **Tecnologia, dados e IA**: viabilidade, arquitetura, comportamento do modelo, direitos sobre dados, avaliação, incerteza, supervisão.
- **Operações e fornecimento**: equipe, manufatura, sourcing, controle de qualidade, capacidade, logística, manutenção.
- **Segurança, lei e governança**: segurança física, privacidade, segurança da informação, acessibilidade, regulação, moderação, responsabilização.
- **Distribuição e adoção**: canal, vendas, onboarding, migração, custo de troca, educação, participação no ecossistema.
- **Impacto ambiental e de ciclo de vida**: durabilidade, reparabilidade, energia, materiais, descarte, suporte de longo prazo.

Não transforme estas restrições em seções de boilerplate. Nomeie a restrição, a decisão que ela altera e a fronteira de aceitação que ela cria.

## Registro de Decisão de Dimensão

Use apenas quando o registro melhorar a rastreabilidade:

```text
Pergunta de decisão:
Dimensão selecionada e motivo:
Responsável Primário:
Evidência e falas do usuário:
Recomendação:
Objeção ou alternativa mais forte:
Verificação da Fronteira Negativa:
Decisão e alternativa rejeitada:
Suposição remanescente e limiar de validação:
Restrições a jusante:
```
