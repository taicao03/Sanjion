export interface SystemBrandingConfig {
  appName: string;
  appBadge: string;
  tagline: string;
  logoUrl?: string;
  primaryColor: string;
  supportEmail: string;
  maintenanceMode: boolean;
}

export const DEFAULT_BRANDING: SystemBrandingConfig = {
  appName: 'Sanjion',
  appBadge: 'PRO',
  tagline: 'Hệ Thống Luyện Tập & Phỏng Vấn Frontend Senior A-Z',
  logoUrl: '',
  primaryColor: '#C9962C',
  supportEmail: 'support@sanjion.dev',
  maintenanceMode: false,
};

export const brandingService = {
  getConfig(): SystemBrandingConfig {
    try {
      const saved = localStorage.getItem('fe_sanjion_branding_config');
      if (saved) {
        return { ...DEFAULT_BRANDING, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load branding config:', e);
    }
    return DEFAULT_BRANDING;
  },

  saveConfig(config: SystemBrandingConfig): void {
    localStorage.setItem('fe_sanjion_branding_config', JSON.stringify(config));
  }
};
