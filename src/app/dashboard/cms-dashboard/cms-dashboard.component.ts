import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { th } from 'date-fns/locale';

@Component({
  selector: 'app-cms-dashboard',
  templateUrl: './cms-dashboard.component.html',
  styleUrls: ['./cms-dashboard.component.scss']
})
export class CmsDashboardComponent implements OnInit {

  productCount = 0;
  pageCount = 0;
  userCount = 0;
  categoryCount = 0;
  newSiteTitle = ''; // or pre-fill with existing title
  siteTitle = '';
  commentCount = 0;

  


  private baseUrl = 'https://cybercloudapp.com/wp-json';
  private wcKey = 'ck_dd111222ce2c0914e75dc284afff6a080243a2b4';
  private wcSecret = 'cs_31cfcfe1e7ac08abafcf197a0d651e32a0758987';
  private username = 'Admin'; // replace with your WP username
  private appPassword = 'ovNL rJL8 5J84 rF8g vV43 Fi60'; // replace with your WP app password

  constructor(private http: HttpClient) {}

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

  fetchPageCount() {
    const url = `${this.baseUrl}/wp/v2/pages`;
    this.http.get<any[]>(url, { observe: 'response' }).subscribe(res => {
      this.pageCount = Number(res.headers.get('X-WP-Total')) || res.body?.length || 0;
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


updateSiteTitle() {
  const url = 'https://cybercloudapp.com/wp-json/wp/v2/settings';
  const username = this.username; // e.g., 'admin';
  const appPassword = this.appPassword; // e.g., 'abc xyz 123...';
  const auth = btoa(`${username}:${appPassword}`);

  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json'
  };

  const body = { title: this.siteTitle };

  this.http.post(url, body, { headers }).subscribe({
    next: res => alert('✅ Site title updated successfully!'),
    error: err => console.error('❌ Error updating title:', err)
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

fetchCommentCount() {
  const url = `${this.baseUrl}/wp/v2/comments`;

  this.http.get<any[]>(url, { observe: 'response' }).subscribe(res => {
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
