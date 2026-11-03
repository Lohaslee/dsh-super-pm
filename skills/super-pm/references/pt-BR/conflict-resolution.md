# Resolução de Conflitos

As lentes de produto são intencionalmente incompatíveis em alguns pontos. Preserve a divergência o tempo suficiente para expor o tradeoff real.

## Resolva Nesta Ordem

1. Rejeite qualquer opção que viole a fronteira `não deve` do usuário.
2. Rejeite opções inseguras, ilegais, enganosas ou irreversivelmente prejudiciais.
3. Prefira comportamento observado e evidência crível a uma teoria atraente.
4. Prefira a opção que melhor serve o usuário primário acordado e o objetivo estratégico.
5. Compare valor total ao usuário, custo de troca, sustentabilidade do negócio e restrições de entrega.
6. Prefira testes reversíveis quando a evidência for fraca.
7. Use a preferência de um pensador apenas como heurística final.

## Quando as Regras Ainda Empatam

Se a Fronteira Negativa, a evidência, o valor para o usuário primário, o objetivo do produto, as restrições de entrega e a reversibilidade ainda deixarem as opções empatadas:

1. Marque a decisão como `não resolvida`; não fabrique consenso para parecer decisivo.
2. Traduza a divergência em condições observáveis: qual resultado selecionaria A, e qual resultado selecionaria B.
3. Desenhe a ação mais barata de coleta de evidência; prefira um teste seguro e reversível quando houver um disponível.
4. Se a diferença restante se resumir a uma preferência de valor ao usuário ou tolerância a risco, ou se evidência proporcional não conseguir resolvê-la, explique cada consequência e peça ao usuário para decidir.

Não entregue ao usuário um debate não processado. Primeiro defina as condições de evidência e o caminho de validação, depois retorne apenas a escolha que genuinamente exige autoridade do usuário.

## Tensões Comuns

### Foco vs completude

- 乔帮主 pode favorecer remover funcionalidades para proteger a coerência.
- 想哥 pode favorecer uma definição completa de produto para o segmento-alvo.
- Resolva separando uma promessa coerente de ponta a ponta de uma cobertura ampla de funcionalidades. Mantenha tudo o que for necessário para a promessa; remova o resto.

### Contenção vs crescimento

- 龙哥 pode resistir a interrupção, manipulação e pressão social.
- Objetivos comerciais podem favorecer mais prompts e loops de engajamento.
- Resolva com métricas de valor ao usuário e guardrails. Rejeite crescimento que dependa de arrependimento, ação acidental ou erosão de confiança.

### Intensidade emocional vs utilidade

- 梁老师 pode expor uma forte oportunidade emocional.
- 龙哥 pode favorecer uma ferramenta silenciosa que desaparece após o uso.
- Resolva conforme a situação do usuário: energia emocional pode impulsionar a adoção, enquanto a interação ainda deve minimizar carga desnecessária.

### Valor ao usuário vs valor para stakeholders

- A visão transacional de 俞老师 expõe todos os participantes e incentivos.
- Uma narrativa de usuário único pode esconder custos impostos a outra parte.
- Resolva modelando quem cria, recebe e paga pelo valor; não otimize uma parte tornando o sistema instável.

### Ruptura vs viabilidade

- 师母 pode pressionar por um mecanismo de produto diferenciado.
- Restrições de entrega podem favorecer uma versão incremental.
- Resolva testando a hipótese distintiva com o menor mecanismo crível, não removendo a diferenciação em si.

### Coerência do Lead vs desafio do especialista

- Um Lead PM selecionado pelo usuário deve preservar uma direção coerente de produto entre as decisões.
- Uma lente de apoio pode revelar evidência mais forte, uma restrição de especialista ou uma violação da fronteira do usuário.
- Resolva com a hierarquia normal em vez de deixar o Lead PM vencer por status. Se o conselho de apoio vencer, mantenha o Lead PM responsável por integrar a decisão revisada e registre o afastamento da recomendação original.

### Velocidade e reputação vs estágio de validação

- 军哥 pode pressionar por foco, loops de aprendizado mais rápidos, qualidade visível e boca a boca.
- 想哥 ou 俞老师 podem mostrar que o mecanismo central ou a diferença de valor ainda não estão provados.
- Resolva acelerando o menor teste crível de 0-a-1, não a implantação completa de 1-a-10. Proteja segurança, qualidade central e limiares de reversão explícitos.

## Registro de Decisão

```text
Conflito:
Lead PM quando selecionado:
Opção A / princípios de apoio:
Opção B / princípios de apoio:
Evidência e restrições:
Status e conclusão da decisão (provisória / confirmada / não resolvida):
Por que a opção rejeitada perdeu:
Gatilho de revisão:
```
