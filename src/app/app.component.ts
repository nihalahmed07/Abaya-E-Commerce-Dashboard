import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AdminSettingsService } from './services/admin-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  constructor(private settingsService: AdminSettingsService) {}

  ngOnInit() {
    this.settingsService.loadSettingsFromServer().subscribe({
      next: (settings) => this.settingsService.applyToHead(settings),
      error: (err) => console.error('❌ Failed to load admin settings globally:', err)
    });
  }
}
