import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AdminSettingsService } from '../../services/admin-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-signup-with-header-footer',
  templateUrl: './signup-with-header-footer.component.html',
  styleUrls: ['./signup-with-header-footer.component.scss']
})
export class SignupWithHeaderFooterComponent implements OnInit {
  adminLogo: string = '';
  adminTitle: string = 'Admin Panel'; // Default fallback
  name: string = '';
  email: string = '';
  password: string = '';


  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,  private adminSettings: AdminSettingsService) { }


  onSubmitSignup() {
    const body = {
      username: this.name,  // or split into first/last if needed
      email: this.email,
      password: this.password
    };

    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa('Admin: ovNL rJL8 5J84 rF8g vV43 Fi60'),  // ✅ your WP admin credentials
      'Content-Type': 'application/json'
    });

    this.http.post('https://cybercloudapp.com/wp-json/custom/v1/register-admin', body, { headers })
      .subscribe({
        next: (res) => {
          alert('Admin registered!');
          this.router.navigate(['/auth/signin-with-header-footer']);
        },
        error: (err) => {
          console.error('❌ Error registering admin:', err);
          alert('Failed to register admin');
        }
      });
  }

  // On Signup link click
  onSignIn() {
    this.router.navigate(['signin-with-header-footer'], { relativeTo: this.route.parent });
  }
  // On Signup link click
  onSignup() {
    this.router.navigate(['signup-with-header-footer'], { relativeTo: this.route.parent });
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
