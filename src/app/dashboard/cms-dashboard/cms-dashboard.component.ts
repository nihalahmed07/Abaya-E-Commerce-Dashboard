import { Component, OnInit, Renderer2 } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-cms-dashboard',
  templateUrl: './cms-dashboard.component.html',
  styleUrls: ['./cms-dashboard.component.scss']
})
export class CmsDashboardComponent implements OnInit {

  adminTitle = '';
  adminLogo = '';
  adminFavicon = '';
  productCount = 0;
  pageCount = 0;
  userCount = 0;
  categoryCount = 0;
  newSiteTitle = ''; // or pre-fill with existing title
  siteTitle = '';
  commentCount = 0;

  


  private baseUrl = 'https://cybercloudapp.com/wp-json';
  private wcKey = 'ck_a5d1866cd08f77c20b601dd09746f0f00c3b6878';
  private wcSecret = 'cs_729c552b1298055023ea6985f4120d5619ae1c0a';
  private username = 'Admin'; // replace with your WP username
  private appPassword = 'rYM3 RRGW GUB7 O1xg Thua h3Am'; // replace with your WP app password

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchProductCount();
    this.fetchPageCount();
    this.fetchUserCount();
    this.fetchCategoryCount();
    this.getSiteSettings();
    this.fetchBrandCount(); 
    this.fetchCommentCount();
     this.fetchPages();
     this.fetchMediaLibrary();
     this.loadAdminSettings();


  }

//   loadAdminSettings() {
//   const stored = localStorage.getItem('admin-settings');
//   if (stored) {
//     const settings = JSON.parse(stored);
//     this.adminTitle = settings.adminTitle;
//     this.adminLogo = settings.adminLogo;
//     this.adminFavicon = settings.adminFavicon;
//   } else {
//     this.http.get<any>('assets/admin-settings.json').subscribe(settings => {
//       this.adminTitle = settings.adminTitle;
//       this.adminLogo = settings.adminLogo;
//       this.adminFavicon = settings.adminFavicon;
//     });
//   }

//   this.applySettingsToHead();
// }

loadAdminSettings() {
  const url = `${this.baseUrl}/custom/v1/admin-settings`;
  const auth = btoa(`${this.username}:${this.appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`
  };

  this.http.get<any>(url, { headers }).subscribe(settings => {
    this.adminTitle = settings.adminTitle;
    this.adminLogo = settings.adminLogo;
    this.adminFavicon = settings.adminFavicon;
    this.applySettingsToHead();
  });
}




  
  // applySettingsToHead() {
  //   document.title = this.adminTitle;

  //   const link: HTMLLinkElement = this.renderer.createElement('link');
  //   link.rel = 'icon';
  //   link.href = this.adminFavicon;
  //   this.renderer.appendChild(document.head, link);
  // }

  applySettingsToHead() {
  document.title = this.adminTitle;

  let faviconEl = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  if (!faviconEl) {
    faviconEl = this.renderer.createElement('link');
    faviconEl.rel = 'icon';
    this.renderer.appendChild(document.head, faviconEl);
  }

  faviconEl.href = this.adminFavicon;
}



//   onAdminLogoChange(event: any) {
//   const file = event.target.files[0];
//   if (file) this.adminLogo = URL.createObjectURL(file);
//   this.adminLogo = URL.createObjectURL(file); // already done
//   localStorage.setItem('admin-logo', this.adminLogo);

  
// }

onAdminLogoChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.adminLogo = reader.result as string;

      const settings = {
        adminTitle: this.adminTitle,
        adminLogo: this.adminLogo,
        adminFavicon: this.adminFavicon
      };
      localStorage.setItem('admin-settings', JSON.stringify(settings));
    };
    reader.readAsDataURL(file); // ✅ creates base64 image string
  }
}



// onAdminFaviconChange(event: any) {
//   const file = event.target.files[0];
//   if (file) this.adminFavicon = URL.createObjectURL(file);
// }

onAdminFaviconChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.adminFavicon = reader.result as string;

      const settings = {
        adminTitle: this.adminTitle,
        adminLogo: this.adminLogo,
        adminFavicon: this.adminFavicon
      };
      localStorage.setItem('admin-settings', JSON.stringify(settings));
      this.applySettingsToHead();
    };
    reader.readAsDataURL(file); // ✅ base64 persistent favicon
  }
}


// saveAdminSettings() {
//   const settings = {
//     adminTitle: this.adminTitle,
//     adminLogo: this.adminLogo,
//     adminFavicon: this.adminFavicon
//   };
//   localStorage.setItem('admin-settings', JSON.stringify(settings));
//   alert('✅ Admin UI updated (local only)');
//   this.applySettingsToHead();
  
// }
saveAdminSettings() {
  const url = `${this.baseUrl}/custom/v1/admin-settings`;
  const auth = btoa(`${this.username}:${this.appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };

  const body = {
    adminTitle: this.adminTitle,
    adminLogo: this.adminLogo,
    adminFavicon: this.adminFavicon
  };

  this.http.post<any>(url, body, { headers }).subscribe({
    next: () => {
      this.applySettingsToHead();
      alert('✅ Admin UI saved to backend!');
    },
    error: err => {
      console.error('❌ Failed to save admin settings:', err);
      alert('❌ Error saving settings');
    }
  });
}




  getSiteSettings() {
  const url = 'https://cybercloudapp.com/wp-json/wp/v2/settings';
  const username = this.username; // e.g., 'admin'
  const appPassword = this.appPassword; // e.g., 'abc xyz 123...'
  const auth = btoa(`${username}:${appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`
  };

  this.http.get<any>(url, { headers }).subscribe({
    next: res => this.siteTitle = res.title,
    error: err => console.error('❌ Failed to fetch site settings:', err)
  });
}

  fetchProductCount() {
    const url = `${this.baseUrl}/wc/v3/products`;
    const params = new HttpParams()
      .set('consumer_key', this.wcKey)
      .set('consumer_secret', this.wcSecret)
      .set('per_page', '1');
    this.http.get<any[]>(url, { params, observe: 'response' }).subscribe(res => {
      this.productCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
    });
  }

  // fetchPageCount() {                           used this before error
  //   const url = `${this.baseUrl}/wp/v2/pages`;
  //   this.http.get<any[]>(url, { observe: 'response' }).subscribe(res => {
  //     this.pageCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
  //   });
  // }
  
  fetchPageCount() {
  const url = `${this.baseUrl}/wp/v2/pages`;
  const auth = btoa(`${this.username}:${this.appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`
  };

  const params = new HttpParams()
    .set('context', 'edit')    // Ensure it returns all pages, including drafts
    .set('per_page', '1');     // Just enough to get total count

  this.http.get<any[]>(url, { headers, params, observe: 'response' }).subscribe(res => {
    this.pageCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
  }, err => {
    console.error('❌ Failed to fetch page count:', err);
    this.pageCount = 0;
  });
}


  // fetchUserCount() {
  //   const url = `${this.baseUrl}/wp/v2/users`;
  //   const params = new HttpParams()
  //     .set('context', 'edit') // May require auth
  //     .set('per_page', '1');
  //   this.http.get<any[]>(url, { params, observe: 'response' }).subscribe(res => {
  //     this.userCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
  //   }, err => {
  //     this.userCount = 0;
  //   });
  // }

  fetchUserCount() {
  const url = `${this.baseUrl}/wp/v2/users`;
  const auth = btoa(`${this.username}:${this.appPassword}`);
  const headers = {
    'Authorization': `Basic ${auth}`
  };
  const params = new HttpParams()
    .set('context', 'edit')
    .set('per_page', '1');

  this.http.get<any[]>(url, { headers, params, observe: 'response' }).subscribe(res => {
    this.userCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
  }, err => {
    console.error('❌ Failed to fetch user count:', err);
    this.userCount = 0;
  });
}


fetchCategoryCount() {
  const url = `${this.baseUrl}/wc/v3/products/categories`;
  const params = new HttpParams()
    .set('consumer_key', this.wcKey)
    .set('consumer_secret', this.wcSecret)
    .set('per_page', '1');

  this.http.get<any[]>(url, { params, observe: 'response' }).subscribe(res => {
    this.categoryCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
  }, err => {
    console.error('❌ Failed to fetch product categories:', err);
    this.categoryCount = 0;
  });
}


// updateSiteTitle() {
//   const url = 'https://cybercloudapp.com/wp-json/wp/v2/settings';
//   const username = this.username; // e.g., 'admin';
//   const appPassword = this.appPassword; // e.g., 'abc xyz 123...';
//   const auth = btoa(`${username}:${appPassword}`);

//   const headers = {
//     'Authorization': `Basic ${auth}`,
//     'Content-Type': 'application/json'
//   };

//   const body = { title: this.siteTitle };

//   this.http.post(url, body, { headers }).subscribe({
//     next: res => alert('✅ Site title updated successfully!'),
//     error: err => console.error('❌ Error updating title:', err)
//   });
// }

updateSiteTitle() {
  const url = `${this.baseUrl}/wp/v2/settings`; // ✅ WP frontend site title
  const auth = btoa(`${this.username}:${this.appPassword}`);
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };

  const body = { title: this.siteTitle };

  this.http.post<any>(url, body, { headers }).subscribe({
    next: () => {
      alert('✅ WordPress site title updated successfully!');
    },
    error: err => {
      console.error('❌ Failed to update WP title:', err);
      alert('❌ Error updating WordPress site title');
    }
  });
}




setSiteLogo(mediaId: number) {
  const url = 'https://cybercloudapp.com/wp-json/custom/v1/set-logo';

  const username = this.username; // same one used to generate app password
  const appPassword = this.appPassword; // same app password used for authentication
  const auth = btoa(`${username}:${appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };

  const body = { media_id: mediaId };

  this.http.post(url, body, { headers }).subscribe({
    next: (res) => {
      alert('✅ Logo set successfully!');
      console.log('Set logo response:', res);
    },
    error: (err) => {
      console.error('❌ Failed to set logo:', err);
      alert('❌ Error setting logo. Check console.');
    }
  });
}



uploadLogo(file: File) {
  const url = 'https://cybercloudapp.com/wp-json/wp/v2/media';
  // const username = this.username; // replace with your WP username
  // const appPassword = this.appPassword; // replace with your WP app password
  // const auth = btoa(`${username}:${appPassword}`);
  const auth = btoa(`${this.username}:${this.appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`,
    // 'Content-Disposition': `attachment; filename="${file.name}"`,
    // 'Content-Type': file.type
  };

  const formData = new FormData();
  formData.append('file', file);

  this.http.post<any>(url, formData, { headers }).subscribe({
    next: (res) => {
      console.log('✅ Logo uploaded:', res);
      const mediaId = res.id;
      this.setSiteLogo(mediaId); // 🎯 Link logo to theme
    },
    error: (err) => {
      console.error('❌ Logo upload failed:', err);
      alert('❌ Failed to upload logo. Check console.');
    }
  });
}


brandCount = 0;

fetchBrandCount() {
  const url = `${this.baseUrl}/wp/v2/product_brand`;
  const auth = btoa(`${this.username}:${this.appPassword}`);
  const headers = {
    'Authorization': `Basic ${auth}`
  };

  this.http.get<any[]>(url, { headers, observe: 'response' }).subscribe(res => {
    this.brandCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
  }, err => {
    console.error('❌ Failed to fetch brands:', err);
    this.brandCount = 0;
  });
}

// fetchCommentCount() {
//   const url = `${this.baseUrl}/wp/v2/comments`;

//   this.http.get<any[]>(url, { observe: 'response' }).subscribe(res => {
//     this.commentCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
//   }, err => {
//     console.error('❌ Failed to fetch comments:', err);
//     this.commentCount = 0;
//   });
// }


fetchCommentCount() {
  const url = `${this.baseUrl}/wp/v2/comments`;
  const auth = btoa(`${this.username}:${this.appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`
  };

  const params = new HttpParams().set('per_page', '1');

  this.http.get<any[]>(url, { headers, params, observe: 'response' }).subscribe(res => {
    this.commentCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
  }, err => {
    console.error('❌ Failed to fetch comments:', err);
    this.commentCount = 0;
  });
}


pages: any[] = [];


fetchPages() {
  const url = `${this.baseUrl}/wp/v2/pages`;
  const auth = btoa(`${this.username}:${this.appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`
  };
  const params = new HttpParams()
    .set('context', 'edit')   // Requires authentication
    .set('per_page', '100');  // Optional: Get up to 100 pages

  this.http.get<any[]>(url, { headers, params }).subscribe({
    next: res => {
      console.log('✅ Pages fetched:', res);
      this.pages = res;
    },
    error: err => {
      console.error('❌ Failed to fetch pages:', err);
    }
  });
}

mediaItems: any[] = [];

fetchMediaLibrary() {
  const url = `${this.baseUrl}/wp/v2/media`;
  const auth = btoa(`${this.username}:${this.appPassword}`);
  const headers = {
    'Authorization': `Basic ${auth}`
  };

  const params = new HttpParams()
    .set('per_page', '12')
    .set('orderby', 'date')
    .set('order', 'desc');

  this.http.get<any[]>(url, { headers, params }).subscribe({
    next: res => {
      this.mediaItems = res;
      console.log('📸 Media items:', res);
    },
    error: err => console.error('❌ Failed to fetch media:', err)
  });
}

onDragOver(event: DragEvent) {
  event.preventDefault();
}

onFileDrop(event: DragEvent) {
  event.preventDefault();
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    this.uploadLogo(files[0]); // ✅ Reuse existing upload method
  }
}





}
