import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ContactComponent } from './components/contact/contact.component';
import { Page404Component } from './components/page-404/page-404.component';
import { byAuthUser, byOwnerOrAdmin, byAdmin } from './auth.guard';

export const routes: Routes = [
  {
    path: 'order',
    loadComponent: () =>
      import('./lazy-components/order/order.component').then(
        (m) => m.OrderComponent
      ),
    canActivate: [byAuthUser],
  },
  {
    path: 'order/thanks',
    loadComponent: () =>
      import('./lazy-components/order/thanks/thanks.component').then(
        (m) => m.ThanksComponent
      ),
  },
  {
    path: 'management',
    loadComponent: () =>
      import('./lazy-components/management/management.component').then(
        (m) => m.ManagementComponent
      ),
    canActivate: [byOwnerOrAdmin],
  },
  {
    path: 'management/add-new-product',
    loadComponent: () =>
      import(
        './lazy-components/management/components/add-new-product/add-new-product.component'
      ).then((m) => m.AddNewProductComponent),
    canActivate: [byAdmin],
  },
  {
    path: 'management/edit-delete-product',
    loadComponent: () =>
      import(
        './lazy-components/management/components/edit-delete-product/edit-delete-product.component'
      ).then((m) => m.EditDeleteProductComponent),
    canActivate: [byOwnerOrAdmin],
  },
  { path: '', component: HomeComponent },
  {
    path: 'products/:productId',
    component: ProductDetailsComponent,
  },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: Page404Component },
];
