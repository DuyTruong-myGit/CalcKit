# CalcKit

Free, accurate client-side material calculators for US homeowners and DIYers.

🌐 **Live site**: [https://calckit.site](https://calckit.site)

## Features

- **20 Free Calculators**: Covering landscaping, concrete & masonry, painting & flooring, outdoor structures & roofing, and area/volume utilities.
- **Pure Client-Side**: 100% runs in your browser. No accounts, no database, no tracking cookies.
- **Mobile-First**: Designed for quick estimates while standing in a yard or at a job site with a tape measure (360px+ support, 44px+ tap targets).
- **Fast Performance**: Static Astro site with lightweight vanilla TypeScript engine (client JS ≤ 30KB gzipped).
- **Dual Units**: US customary units (ft, in, yd, lbs) and metric conversion toggle (m, cm, kg).

## Project Structure

```text
├── docs/            # Project specifications, formulas, and task logs
├── public/          # Static assets (favicons, logos, robots.txt)
├── src/
│   ├── components/  # Astro & UI components (Calculator, FAQ, RelatedLinks)
│   ├── data/        # Calculator definitions (JSON schema)
│   ├── layouts/     # Master layout (Base.astro)
│   ├── lib/         # Pure calculation engine & formulas
│   ├── pages/       # Astro pages & dynamic [slug] routes
│   └── styles/      # Design tokens & global CSS
└── tests/           # Unit and data-driven formula test suite
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npm run test

# Type-check and lint
npm run check

# Build production static bundle
npm run build
```

## Deployment

Deployable to [Cloudflare Pages](https://pages.cloudflare.com/) with static build:
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Environment**: `NODE_VERSION=20`

## License

All rights reserved © 2026 CalcKit.
