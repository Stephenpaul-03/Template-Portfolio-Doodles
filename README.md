# Stephen Paul's Workshop

A two-path portfolio built with Next.js 15, the App Router, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, and Lenis.

## Routes

- `/` - desktop mode switch; mobile and tablet requests redirect to Normal Mode
- `/portfolio` - responsive, single-page portfolio ordered as Hero, About, Selected Work, Experience/Education, Hobbies, and a combined Contact/Footer
- `/workshop` - route namespace reserved for the future Experience Mode; no page ships yet and the current landing choice is visibly disabled

## Development

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

## Editing content

Edit **`data/portfolio.json`** for all visitor-facing content. Components and the compatibility exports in `data/projects.ts` and `data/experience.ts` read from this single source; do not edit copy inside components.

- `site`: name, brand, monogram, language, and search metadata.
- `navigation`, `modeSwitch`, `ui`: navigation, landing choices, theme controls, and accessibility labels.
- `hero`, `about`: introduction, photo/caption, sticky-note thoughts, profile facts, skills, and principles.
- `work`: chapter copy, project cards, case-study details, tags, images, and links.
- `journey`: experience entries, education copy, and the future chapter.
- `hobbies`: board captions and each hobby's image, description, modal text, and facts.
- `contact`: email, resume download, social links/icons, stamp, signature, and footer copy.

For example, replace `contact.email` and set `contact.resume.href` to `/files/your-resume.pdf`, then put that PDF in `public/files/`. Project contact links are separate `work.projects[].links[].href` values, so update their email addresses too. Images use paths relative to `public/`, such as `/images/hobbies/photography.svg`. The current contact URLs, projects, resume, and career details are placeholders.

Reorder project, experience, or hobby objects to change their order. Keep hobby IDs unique and stable (lowercase letters, numbers, hyphens). The current scattered board has eight designed positions; extra cards reuse these positions and can be dragged apart. Social icon keys are `linkedin`, `github`, and `instagram`. Keep navigation anchor targets unchanged unless also changing section IDs in code.

Keep note/principle collections nonempty. Fields containing two display lines (such as `hero.stamp` or `contact.description`) should retain two entries. Labels containing `{title}` substitute the relevant project/hobby name automatically. JSON is plain text, not HTML.

Save during `npm run dev` to refresh the content. Production changes require a rebuild/redeploy. Run `npm test` to catch missing local assets, invalid links/IDs, or accidentally hardcoded component copy.

## Animation sequencing

Normal Mode has one root Lenis instance in `components/portfolio-scroll.tsx`. It handles smooth wheel scrolling and anchor navigation, respects reduced-motion preferences, and runs on Framer Motion's frame loop. Header section tracking, chapter rules, card entrance checks, and doodle timelines subscribe to Lenis updates. Modals stop the page instance while open, their detail panel retains native nested scrolling, and draggable hobby cards opt out of Lenis touch capture.

Timed entrances cover the introduction, content/paper, and handwritten notes. Doodles are independently scrubbed by scroll position, not played on a timer. Within the introduction, the hero eyebrow, letter-by-letter greeting, word-by-word headline lines, description, and links have separate ordered phases. The accent underline draws only after its words finish; the header then fades in with the introduction. Chapter titles also reveal word by word. Related cards stagger lightly within their beat; different beats never run concurrently.

A small head bootstrap prepares animated targets before the first paint, preventing a visible → hidden → animated flash. It only opts in when JavaScript and the required browser APIs are available and reduced motion is off. If hydration does not take over within 1.8 seconds, it fails open to visible content and skips late entrances. Client navigation prepares in a layout effect before paint.

Only intersecting elements join the sequence. Scrolling past, focusing, or touching an item completes its entrance immediately. Reduced-motion mode and pages without JavaScript remain static and visible. Doodle strokes pause with scrolling and reverse on upward scroll. Above-fold marks start undrawn; footer marks finish by the page bottom. Their progress and cleanup live in `lib/doodle-scroll.ts`.

Shared selectors and pre-paint setup live in `lib/scrapbook-motion-config.ts`; entrance timing lives in `components/scrapbook-motion.tsx`. `data-motion-phase` sets local ordering.

Tests cover stage ordering, card staggering, fast scrolling, interaction cancellation, updated notes, and reduced-motion cleanup. Run production builds in a separate checkout/copy if a development server is already using `.next`.

Normal Mode includes a persistent light/dark theme, a header that condenses into a floating pill, scroll-reactive section entrances, animated project drawers, draggable hobby cards with shared-layout modals, and an in-flow contact finale. Project and hobby overlays close through their close button, backdrop, or the Escape key, and respect reduced-motion preferences.

## Mobile routing

`middleware.ts` uses Next's user-agent parser to redirect known phones and tablets before rendering the landing screen. The mode-switch component also checks a 767px media query as a fallback for unusual user agents. This avoids a flash for normal mobile traffic while still handling narrow desktop-class browsers.
