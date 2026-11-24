import { describe, it, expect } from 'vitest';
import { SITE_CONFIG } from '../src/config';

describe('Site Config', () => {
  it('has ads disabled by default', () => {
    expect(SITE_CONFIG.adsEnabled).toBe(false);
  });

  it('has placeholder domain and site name defined', () => {
    expect(SITE_CONFIG.siteName).toBeDefined();
    expect(SITE_CONFIG.domain).toBeDefined();
    expect(SITE_CONFIG.contactEmail).toBeDefined();
  });
});
