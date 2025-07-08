import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminSettingsService {
  private renderer: Renderer2;
  baseUrl = 'https://cybercloudapp.com/wp-json';
  username = 'Admin';
  appPassword = 'rYM3 RRGW GUB7 O1xg Thua h3Am'; // Replace with your actual app password

  adminTitle = '';
  adminFavicon = '';
  adminLogo = '';

  constructor(private http: HttpClient, rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadSettingsFromServer() {
    const auth = btoa(`${this.username}:${this.appPassword}`);
    const headers = { 'Authorization': `Basic ${auth}` };

    return this.http.get<any>(`${this.baseUrl}/custom/v1/admin-settings`, { headers });
  }

  applyToHead(settings: any) {
    this.adminTitle = settings.adminTitle;
    this.adminFavicon = settings.adminFavicon;
    this.adminLogo = settings.adminLogo;

    document.title = this.adminTitle;

    let faviconEl = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!faviconEl) {
      faviconEl = this.renderer.createElement('link');
      faviconEl.rel = 'icon';
      this.renderer.appendChild(document.head, faviconEl);
    }
    faviconEl.href = this.adminFavicon;
  }
}
