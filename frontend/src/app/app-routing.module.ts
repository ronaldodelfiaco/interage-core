import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosComponent } from './eventos/eventos.component';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { PagesLayoutComponent } from './layout/pages-layout/pages-layout.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SemPermissaoComponent } from './sem-permissao/sem-permissao.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: EventosComponent
      },
      {
        path: 'semPermissao', component: SemPermissaoComponent
      },
    ]
  },
  {
    path: '',
    component: PagesLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
