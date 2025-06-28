import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full/full-layout.component";
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";

import { Full_ROUTES } from "./shared/routes/full-layout.routes";
import { CONTENT_ROUTES } from "./shared/routes/content-layout.routes";


// Import your SignUp and SignIn components here
import { SignupWithHeaderFooterComponent } from './auth/signup-with-header-footer/signup-with-header-footer.component';
import { SigninWithHeaderFooterComponent } from './auth/signin-with-header-footer/signin-with-header-footer.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/sales',
    pathMatch: 'full',
  },
  { path: '', component: FullLayoutComponent, data: { title: 'full Views' }, children: Full_ROUTES },
  { path: '', component: ContentLayoutComponent, data: { title: 'content Views' }, children: CONTENT_ROUTES },
  // Sign Up and Sign In Routes
  { path: 'signup-with-header-footer', component: SignupWithHeaderFooterComponent },
  { path: 'signin-with-header-footer', component: SigninWithHeaderFooterComponent },

  { path: '**', redirectTo: 'auth/signup-with-header-footer' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
