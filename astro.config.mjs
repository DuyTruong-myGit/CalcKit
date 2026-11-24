// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

process.env.ASTRO_TELEMETRY_DISABLED = '1';

// Read draft slugs from data directory to exclude them from sitemap
function getDraftSlugs() {
  const dataDir = join(process.cwd(), 'src', 'data', 'calculators');
  try {
    const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'));
    const drafts = new Set();
    for (const file of files) {
      const def = JSON.parse(readFileSync(join(dataDir, file), 'utf-8'));
      if (def.status === 'draft') {
        drafts.add(def.slug);
      }
    }
    return drafts;
  } catch {
    return new Set();
  }
}

const draftSlugs = getDraftSlugs();

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => {
        // Exclude draft calculator pages from the sitemap
        for (const slug of draftSlugs) {
          if (page.includes(`/${slug}/`)) {
            return false;
          }
        }
        return true;
      },
    }),
  ],
});
