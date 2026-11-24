import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('Required Pages and Routes Exist', () => {
  const pages = [
    'src/pages/index.astro',
    'src/pages/about.astro',
    'src/pages/contact.astro',
    'src/pages/privacy-policy.astro',
    'src/pages/terms.astro',
    'src/pages/404.astro',
    'src/pages/categories.astro',
    'src/pages/[slug].astro',
    'public/robots.txt',
  ];

  for (const page of pages) {
    it(`file exists: ${page}`, () => {
      expect(existsSync(join(process.cwd(), page))).toBe(true);
    });
  }
});

describe('Sitemap and Robots Configuration', () => {
  it('robots.txt includes sitemap directive and disallows nothing', () => {
    const robots = readFileSync(join(process.cwd(), 'public', 'robots.txt'), 'utf-8');
    expect(robots).toContain('User-agent: *');
    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Sitemap:');
  });

  it('sitemap excludes draft calculators after build', () => {
    const sitemapPath = join(process.cwd(), 'dist', 'sitemap-0.xml');
    if (existsSync(sitemapPath)) {
      const sitemap = readFileSync(sitemapPath, 'utf-8');
      // Draft calculators must be excluded
      expect(sitemap).not.toContain('/mulch-calculator');
      expect(sitemap).not.toContain('/gravel-calculator');
      expect(sitemap).not.toContain('/concrete-slab-calculator');
      expect(sitemap).not.toContain('/topsoil-calculator');
      expect(sitemap).not.toContain('/sand-calculator');
      expect(sitemap).not.toContain('/raised-bed-soil-calculator');
      expect(sitemap).not.toContain('/paver-calculator');
      expect(sitemap).not.toContain('/retaining-wall-block-calculator');

      // Static non-draft pages must be included
      expect(sitemap).toContain('/about');
      expect(sitemap).toContain('/contact');
      expect(sitemap).toContain('/privacy-policy');
      expect(sitemap).toContain('/terms');
      expect(sitemap).toContain('/categories');
    }
  });
});
