import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SiteSettingsService {
  private siteTitle = 'My CMS';
  private logoUrl = '';
  private faviconUrl = '';

  setTitle(title: string) {
    this.siteTitle = title;
    document.title = title;
  }

  setLogo(url: string) {
    this.logoUrl = url;
  }

  setFavicon(url: string) {
    this.faviconUrl = url;
    const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('href', url);
    document.head.appendChild(favicon);
  }

  getSettings() {
    return {
      title: this.siteTitle,
      logo: this.logoUrl,
      favicon: this.faviconUrl,
    };
  }
}
