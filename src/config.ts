export interface SiteConfig {
  siteName: string;
  domain: string;
  contactEmail: string;
  adsEnabled: boolean;
  analytics: 'none' | 'cloudflare' | 'ga4';
  analyticsId?: string;
  dateFormat: string;
}

export const SITE_CONFIG: SiteConfig = {
  // Set placeholder defaults - update when domain and branding are finalized
  siteName: 'CalcKit',
  domain: 'https://example.com',
  contactEmail: 'contact@example.com',
  adsEnabled: false,
  analytics: 'none',
  dateFormat: 'YYYY-MM-DD',
};
