import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';
import { RequestPartnerComponent } from './request-patner.component';
import { RequestPartnerDetailComponent } from './request-patner-detail.component';
import { RequestPartnerPopupComponent } from './request-patner-dialog.component';
import { RequestPartnerDeletePopupComponent } from './request-patner-delete-dialog.component';
import { RequestPatnerConfirmPopupComponent } from './request-patner-confirm-dialog.component';


@Injectable()
export class RequestPartnerResolvePagingParams implements Resolve<any> {
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

export const RequestPartnerRoute: Routes = [
  {
    path: '',
    component: RequestPartnerComponent,
    resolve: {
      pagingParams: RequestPartnerResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/produits/getAllProduits'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },  
  {
    path: ':id',
    component: RequestPartnerDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const requestPartnerPopupRoute: Routes = [
  {
    path: 'request-partner-new',
    component: RequestPartnerPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/produits/createProduit'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'request-partner/:id/edit',
    component: RequestPartnerPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/produits/updateProduit'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'request-partner/:id/delete',
    component: RequestPartnerDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/deleteProduit'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'request-partner/:id/confirm',
    component: RequestPatnerConfirmPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/deleteProduit'],
      pageTitle: 'sfdApp.produit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
