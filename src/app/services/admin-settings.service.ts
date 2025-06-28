import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminSettingsService {
  private siteTitle = 'Default Admin';
  private logoUrl: string | null = null;
  private faviconUrl: string | null = null;

  setSiteTitle(title: string) {
    this.siteTitle = title;
    document.title = title;
  }

  setLogoUrl(url: string) {
    this.logoUrl = url;
  }

  setFaviconUrl(url: string) {
    this.faviconUrl = url;
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.setAttribute('type', 'image/x-icon');
    link.setAttribute('rel', 'shortcut icon');
    link.setAttribute('href', url);
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  getSettings() {
    return {
      siteTitle: this.siteTitle,
      logoUrl: this.logoUrl,
      faviconUrl: this.faviconUrl
    };
  }
}
