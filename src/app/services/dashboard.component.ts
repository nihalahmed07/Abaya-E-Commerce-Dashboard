import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DashboardSettingsService {
  private titleKey = 'admin_site_title';
  private logoKey = 'admin_site_logo';
  private faviconKey = 'admin_site_favicon';

  // Site Title
  setTitle(title: string): void {
    localStorage.setItem(this.titleKey, title);
  }

  getTitle(): string {
    return localStorage.getItem(this.titleKey) || 'Default Site Title';
  }

  // Logo (store base64 or file URL)
  setLogo(logoUrl: string): void {
    localStorage.setItem(this.logoKey, logoUrl);
  }

  getLogo(): string {
    return localStorage.getItem(this.logoKey) || 'assets/images/default-logo.png';
  }

  // Favicon (base64 or file URL)
  setFavicon(faviconUrl: string): void {
    localStorage.setItem(this.faviconKey, faviconUrl);
    const link: any = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  getFavicon(): string {
    return localStorage.getItem(this.faviconKey) || 'assets/images/favicon.ico';
  }
}
