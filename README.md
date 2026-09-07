# Stephen Paul's Workshop

A two-path portfolio built with Next.js 15, the App Router, TypeScript, Tailwind CSS 4, and shadcn/ui.

## Routes

- `/` - desktop mode switch; mobile and tablet requests redirect to Normal Mode
- `/portfolio` - responsive, single-page portfolio ordered as Hero, About, Selected Work, Experience/Education, Hobbies, and a combined Contact/Footer
- `/workshop` - route namespace reserved for the future Experience Mode; no page ships yet and the current landing choice is visibly disabled

## Development

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

Project content and drawer details live in `data/projects.ts`; career placeholders live in `data/experience.ts`. Contact and social placeholders are in `components/site-footer.tsx`. Replace `public/files/steve-resume-placeholder.pdf` with the final resume while keeping the filename to avoid changing the link.

Normal Mode includes a persistent light/dark theme, a header that condenses into a floating pill, scroll-reactive section entrances, animated project drawers, draggable hobby cards with shared-layout modals, and an in-flow contact finale. Project and hobby overlays close through their close button, backdrop, or the Escape key, and respect reduced-motion preferences.

## Mobile routing

`middleware.ts` uses Next's user-agent parser to redirect known phones and tablets before rendering the landing screen. The mode-switch component also checks a 767px media query as a fallback for unusual user agents. This avoids a flash for normal mobile traffic while still handling narrow desktop-class browsers.
