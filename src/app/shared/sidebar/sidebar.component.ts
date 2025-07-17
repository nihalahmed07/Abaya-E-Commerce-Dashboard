import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { SidebarService } from "./sidebar.service";
import { AdminSettingsService } from '../../services/admin-settings.service';

import * as $ from 'jquery';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    
     public menuItems: any[];
  adminLogo: string = '';
  adminTitle: string = 'Admin Panel'; // Default fallback

  
    constructor( public sidebarservice: SidebarService,private router: Router, private adminSettings: AdminSettingsService) {

        router.events.subscribe( (event: Event) => {

            if (event instanceof NavigationStart) {
                // Show loading indicator
            }

            if (event instanceof NavigationEnd && $(window).width() < 1025 && ( document.readyState == 'complete' || false ) ) {

                // this.toggleSidebar();
                // Hide loading indicator
               
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
                console.log(event.error);
            }
        });

    }

        
    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
        
        if ($(".wrapper").hasClass("nav-collapsed")) {
            // unpin sidebar when hovered
            $(".wrapper").removeClass("nav-collapsed");
            $(".sidebar-wrapper").unbind( "hover");
        } else {
            $(".wrapper").addClass("nav-collapsed");
            $(".sidebar-wrapper").hover(
                function () {
                    $(".wrapper").addClass("sidebar-hovered");
                },
                function () {
                    $(".wrapper").removeClass("sidebar-hovered");
                }
            )
      
        }

    }

    getSideBarState() {
        return this.sidebarservice.getSidebarState();
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true);
    }
    

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        $.getScript('./assets/js/app-sidebar.js');
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
