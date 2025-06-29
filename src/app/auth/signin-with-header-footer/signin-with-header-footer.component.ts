import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdminSettingsService } from '../../services/admin-settings.service';



@Component({
  selector: 'app-signin-with-header-footer',
  templateUrl: './signin-with-header-footer.component.html',
  styleUrls: ['./signin-with-header-footer.component.scss']
})
export class SigninWithHeaderFooterComponent implements OnInit {

  email: string = '';
  password: string = '';
  adminLogo: string = '';
  adminTitle: string = 'Admin Panel'; // Default fallback

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private adminSettings: AdminSettingsService) { }

  // 🔐 Submit handler
  onSubmitSignIn() {
    const credentials = btoa(`${this.email}:${this.password}`);
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + credentials
    });

    this.http.get('https://cybercloudapp.com/wp-json/wp/v2/users/me', { headers })
      .subscribe({
        next: (res: any) => {
          // success – store auth flag and redirect
          localStorage.setItem('auth_token', credentials); // Optional: store or just flag
          this.router.navigate(['/dashboard/sales']); // ✅ update this to your actual dashboard route
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid email or password.');
        }
      });
  }

  // On Forgotpassword link click
  onForgotpassword() {
    this.router.navigate(['forgot-password'], { relativeTo: this.route.parent });
  }

  // On Signup link click
  onSignup() {
    this.router.navigate(['signup-with-header-footer'], { relativeTo: this.route.parent });
  }

  // On SignIn link click
  onSignIn() {
    this.router.navigate(['signin-with-header-footer'], { relativeTo: this.route.parent });
  }


  ngOnInit() {
    this.adminSettings.loadSettingsFromServer().subscribe({
            next: (settings) => {
                this.adminLogo = settings.adminLogo || '';
                this.adminTitle = settings.adminTitle || 'Admin Panel';
                this.adminSettings.applyToHead(settings);
            },
            error: (err) => console.error('❌ Failed to load admin settings:', err)
        });
  }

}
