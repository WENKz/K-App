import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'acl',
    data: { permissions: { only: ['role:read', 'specialaccount:read'] } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: () => import('./acl/acl.module').then(m => m.AclModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'barmen',
    data: { permissions: { only: 'barman:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: () => import('./barmen/barmen.module').then(m => m.BarmenModule),
  },
  {
    path: 'contact',
    loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
  },
  {
    path: 'inventory-management',
    loadChildren: () => import('./inventory-management/inventory-management.module')
      .then(m => m.InventoryManagementModule),
  },
  {
    path: 'kommissions',
    data: { permissions: { only: 'kommission:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: () => import('./kommissions/kommissions.module').then(m => m.KommissionsModule),
  },
  {
    path: 'members',
    data: { permissions: { only: 'member:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: () => import('./members/members.module').then(m => m.MembersModule),
  },
  {
    path: 'services',
    data: { permissions: { only: 'service:read' } },
    canLoad: [NgxPermissionsGuard],
    loadChildren: () => import('./services/services.module').then(m => m.ServicesModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
