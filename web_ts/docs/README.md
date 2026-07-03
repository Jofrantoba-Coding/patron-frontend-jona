# docs — Documentacion del Patron JONA

Sitio de documentacion (Jekyll + tema [Just the Docs](https://just-the-docs.com/)) publicado como **GitHub Pages**.

- URL: https://jofrantoba-coding.github.io/patron-frontend-jona
- Contenido: el patron JONA (`patron/`), las implementaciones por tecnologia (`implementaciones/`) y la libreria `jona-ui` (`uijona/`).

## Como se publica

GitHub Pages construye este sitio automaticamente a partir de `_config.yml` cuando se hace push. Usa `remote_theme` y plugins soportados por Pages (`jekyll-seo-tag`, `jekyll-remote-theme`), por lo que **no requiere build manual ni commitear salida**.

## Previsualizar en local (opcional)

Necesitas Ruby + Bundler. Como no hay `Gemfile`, crea uno minimo apuntando a `github-pages`:

```bash
# Gemfile
# source "https://rubygems.org"
# gem "github-pages", group: :jekyll_plugins

cd web_ts/docs
bundle install
bundle exec jekyll serve   # http://localhost:4000/patron-frontend-jona/
```

## Editar contenido

Cada pagina es un `.md` con front matter (title, nav_order). El orden lateral se controla con `nav_sort: order` y el campo `nav_order` de cada archivo.

```
docs/
  index.md               # portada
  patron/                # explicacion del patron JONA
  implementaciones/      # una pagina por tecnologia (react-hooks, vuejs, angular, ...)
  uijona/                # documentacion de la libreria jona-ui
```
