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
  siteName: 'CalcKit',
  domain: 'https://calckit.site',
  contactEmail: 'contact@calckit.site',
  adsEnabled: false,
  analytics: 'none',
  dateFormat: 'YYYY-MM-DD',
};
