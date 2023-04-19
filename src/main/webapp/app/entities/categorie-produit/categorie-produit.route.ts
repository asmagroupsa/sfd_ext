import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
  CanActivate
} from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategorieProduitComponent } from './categorie-produit.component';
import { CategorieProduitDetailComponent } from './categorie-produit-detail.component';
import { CategorieProduitPopupComponent } from './categorie-produit-dialog.component';
import { CategorieProduitDeletePopupComponent } from './categorie-produit-delete-dialog.component';

@Injectable()
export class CategorieProduitResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
    const sort = route.queryParams['sort']
      ? route.queryParams['sort']
      : 'id,asc';
    return {
      page: this.paginationUtil.parsePage(page),
      predicate: this.paginationUtil.parsePredicate(sort),
      ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const categorieProduitRoute: Routes = [
  {
    path: '',
    component: CategorieProduitComponent,
    resolve: {
      pagingParams: CategorieProduitResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.categorieProduit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CategorieProduitDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.categorieProduit.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categorieProduitPopupRoute: Routes = [
  {
    path: 'categorie-produit-new',
    component: CategorieProduitPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.categorieProduit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'categorie-produit/:id/edit',
    component: CategorieProduitPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.categorieProduit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'categorie-produit/:id/delete',
    component: CategorieProduitDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.categorieProduit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
