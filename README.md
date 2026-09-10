# Peaxels Studio — Portfolio

Portfolio site for **Ayeelagbe Peace**, brand, social & motion designer (Peaxels Studio), Lagos, Nigeria.

Static site — plain HTML, CSS and JS, no build step.

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, work, services, about, process, testimonials, contact |
| `projects.html` | Filterable project archive |
| `style.css` | All styles (solid colour, no gradients) |
| `script.js` | Cursor, nav, reveals, marquee, project filter |
| `images/` | Portraits + `images/projects/` artwork |

## Local preview

Open `index.html` in a browser, or:

```sh
python3 -m http.server 8000
```

## Deploy (Netlify)

No build command. Publish directory: `.` (repo root) — configured in `netlify.toml`.
