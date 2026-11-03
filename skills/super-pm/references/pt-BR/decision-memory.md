# Memória de Decisão

Use este esquema apenas para decisões de produto confirmadas que precisam sobreviver à conversa atual. Mantenha `.super-pm/decisions.md` compacto e legível; não o transforme em transcrição.

```markdown
## <ID estável da decisão>: <pergunta de decisão>

- Status: atual | substituída
- Data: AAAA-MM-DD
- Decisão: <direção confirmada>
- Fronteira Negativa: <não deve; não agora; restrições rígidas; qualidades protegidas>
- Evidência: <fatos ou resultados observados que sustentam a decisão>
- A validar: <suposições de alto impacto ainda não resolvidas>
- Próxima validação: <método, amostra, limite de decisão e próxima ação>
- Gatilho de revisão: <evidência, data, escala, custo ou restrição que reabre a decisão>
- Responsável: <responsável conhecido ou Pendente>
- Substitui: <ID da decisão ou Nenhuma>
- Substituída por: <ID da decisão ou Nenhuma>
- Motivo da mudança: <obrigatório quando a decisão substitui uma anterior>
```

## Regras de Atualização

1. Mantenha o ID estável enquanto a direção da decisão não mudar.
2. Atualize evidência, status de validação, responsável ou gatilho de revisão no próprio registro quando a decisão permanecer inalterada.
3. Quando a direção mudar, crie um novo ID, marque o registro anterior como `substituída`, preencha `Substitui` e `Substituída por` nos dois sentidos e registre o motivo da mudança.
4. Exponha conflitos não resolvidos entre o arquivo e a solicitação atual antes de usar qualquer um dos dois como restrição.
5. Preserve o histórico confirmado; remova um registro apenas quando o usuário pedir explicitamente para apagá-lo.
