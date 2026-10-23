# North Arquitetura & Soluções — site

Site institucional da North Arquitetura & Soluções, escritório fundado em janeiro de 2020 por Jennifer Rech e Fernanda Correia.

Conceito visual: **"Entre o traço e o espaço"** — um caderno de arquitetura contemporâneo, em que croquis, desenho técnico e fotografia convivem.

## Páginas

| Arquivo | Página |
| --- | --- |
| `index.html` | Início |
| `servicos.html` | Serviços |
| `projetos.html` | Projetos (com filtro por categoria) |
| `metodo.html` | Método de trabalho |
| `sobre.html` | A North — história, missão, visão e valores |
| `contato.html` | Contato |

## Estrutura

- `assets/css/styles.css` — paleta, tipografia e componentes
- `assets/js/main.js` — animações, menu, filtro e formulário
- `assets/js/config.js` — **WhatsApp, e-mail, Instagram e cidade** (preencher)
- `assets/img/` — favicon
- `tools/sync-layout.sh` — copia o menu e o rodapé de `index.html` para as outras páginas

HTML, CSS e JS puros, sem build. Para editar o menu ou o rodapé, altere só `index.html` e rode:

```bash
bash tools/sync-layout.sh
```

## Pendências

- Substituir as imagens de referência (Unsplash) pelas fotos reais dos projetos e da equipe
- Preencher os contatos em `assets/js/config.js`
- Conectar o formulário a um serviço de envio
