# UtilityCS2 - Full Prototype (Ready)

Este repositório contém o protótipo **UtilityCS2** com frontend Next.js + Tailwind e um scraper que recolhe lineups/utilities da HLTV.

## Como funciona
- O frontend lê `data/lineups.json` para mostrar lineups.
- O `scraper/hltv_scraper.py` recolhe dados da HLTV e atualiza `data/lineups.json`.
- O workflow GitHub Actions corre o scraper periodicamente (cada 6h) e commita as mudanças no repositório.

## Deploy rápido
1. Faz fork/clone do repo para a tua conta GitHub.
2. Liga o repo ao Vercel e faz deploy (Next.js detectado automaticamente).

## Configurar o auto-update (GitHub Actions)
- O workflow usa o `GITHUB_TOKEN` integrado para commitar. Após fazeres fork, o Actions já pode correr (pode precisar de permissões).
- Se quiseres alterações mais avançadas (guardar em Supabase, S3 ou aprovações), diz que eu meto.

## Nota legal & técnica
- HLTV: não há API pública; o scraper lê páginas públicas. Ajusta selectors no `scraper/hltv_scraper.py` conforme o layout da HLTV.
- Usa rate limits e evita requests agressivos. Para produção, pede permissão à HLTV e/ou usa fontes oficiais.

