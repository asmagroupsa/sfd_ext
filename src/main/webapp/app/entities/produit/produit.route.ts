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

import { ProduitComponent } from './produit.component';
import { ProduitDetailComponent } from './produit-detail.component';
import { ProduitPopupComponent } from './produit-dialog.component';
import { ProduitDeletePopupComponent } from './produit-delete-dialog.component';
import {ProductRequestSheetComponent } from './product-request-sheet';
import { Principal } from '../../shared';
import {ProduitTauxCommissionComponent} from './produit-taux-commission.component';

@Injectable()
export class ProduitResolvePagingParams implements Resolve<any> {
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

export const produitRoute: Routes = [
  {
    path: '',
    component: ProduitComponent,
    resolve: {
      pagingParams: ProduitResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/produits/getAllProduits'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
   {
    path: 'taux-commission',
    component: ProduitTauxCommissionComponent,
    resolve: {
      pagingParams: ProduitResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      //ressources:['carmesfnmservice/api/produits/getAllProduits'],
      pageTitle: 'Les taux commissions des produits'
    },
    canActivate: [UserRouteAccessService]
  },
  
  {
    path: ':id',
    component: ProduitDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/product-request-sheet',
    component: ProductRequestSheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.client.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const produitPopupRoute: Routes = [
  {
    path: 'produit-new',
    component: ProduitPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/produits/createProduit'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'produit/:id/edit',
    component: ProduitPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/produits/updateProduit'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'produit/:id/delete',
    component: ProduitDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/deleteProduit'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
