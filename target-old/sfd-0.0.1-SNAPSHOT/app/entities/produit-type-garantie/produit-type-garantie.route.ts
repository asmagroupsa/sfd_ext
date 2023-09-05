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

import { ProduitTypeGarantieComponent } from './produit-type-garantie.component';
// import { TranchePenalDetailComponent } from './tranche-penal-detail.component';
import { ProduitTypeGarantiePopupComponent } from './produit-type-garantie-dialog.component';
// import { TranchePenalDeletePopupComponent } from './tranche-penal-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class ProduitTypeGarantieResolvePagingParams implements Resolve<any> {
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

export const produitTypeGarantieRoute: Routes = [
  {
    path: '',
    component: ProduitTypeGarantieComponent,
    resolve: {
      pagingParams: ProduitTypeGarantieResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenal.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  // {
  //   path: ':id',
  //   component: TranchePenalDetailComponent,
  //   data: {
  //     authorities: ['ROLE_USER'],
  //     pageTitle: 'sfdApp.tranchePenal.home.title'
  //   },
  //   canActivate: [UserRouteAccessService]
  // }
];

export const produitTypeGarantiePopupRoute: Routes = [
  {
    path: 'produit-type-garantie-new',
    component: ProduitTypeGarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenal.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'produit-type-garantie/:id/edit',
    component: ProduitTypeGarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenal.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  // {
  //   path: 'produit-type-garantie/:id/delete',
  //   component: TranchePenalDeletePopupComponent,
  //   data: {
  //     authorities: ['ROLE_USER'],
  //     pageTitle: 'sfdApp.tranchePenal.home.title'
  //   },
  //   canActivate: [UserRouteAccessService],
  //   outlet: 'popup'
  // }
];
