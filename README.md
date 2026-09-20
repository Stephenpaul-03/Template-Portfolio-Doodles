# Template Portfolio Doodles

<p align="center"><strong>A playful portfolio template for serious work and unserious little details.</strong></p>

This React portfolio is a scrapbook-style single page with case studies, personal context, hand-drawn energy, motion, project artwork, and a contact footer. It takes the work seriously, but not itself. Finally, some balance.

## What it is for

Adapting a doodle-style portfolio for a designer, builder, curious problem solver, studio, or wonderfully mysterious internet entity.

## What it includes

- Hero, about, journey, selected work, hobbies, and contact sections
- Responsive layout with light and dark themes
- Project and hobby detail modals
- Draggable hobbies board and playful visual treatments
- Editable content in data/portfolio.json

## Run it

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint && npm run build
```

## Publish to GitHub Pages

This project is configured for GitHub Pages without GitHub Actions. The Vite build uses relative URLs, so it works for both a repository site (`username.github.io/repository-name`) and a user site (`username.github.io`).

1. Run `npm install` and `npm run build`.
2. In GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Publish the `dist` folder from your preferred Pages branch. If the Pages UI only offers a branch root, commit or copy the contents of `dist` to a dedicated `gh-pages` branch and select that branch’s root folder.

The generated `dist` directory is intentionally ignored by git. Rebuild and republish it whenever the portfolio changes.

## Customize it

Start with data/portfolio.json for the identity, copy, projects, links, and résumé. Change the content there before hunting through JSX like a detective in a very small, very stylish crime drama.

## License

[MIT License](LICENSE). Doodle responsibly.
