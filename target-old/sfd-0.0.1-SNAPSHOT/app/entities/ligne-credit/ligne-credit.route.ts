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

import { LigneCreditComponent } from './ligne-credit.component';
import { LigneCreditDetailComponent } from './ligne-credit-detail.component';
import { LigneCreditPopupComponent } from './ligne-credit-dialog.component';
import { LigneCreditDeletePopupComponent } from './ligne-credit-delete-dialog.component';
import { LigneCreditComplementPopupComponent } from './ligne-credit-complement-dialog.component';
import { ComplementsComponent } from './complements.component';
import { EcheanceOfLigneSheetComponent } from './echeance-of-ligne-credit-sheet.component';
import { Principal } from '../../shared';
import { RapatriementLigneCreditComponent } from './rapatriement-ligne-credit.component';

@Injectable()
export class LigneCreditResolvePagingParams implements Resolve<any> {
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

export const ligneCreditRoute: Routes = [
  {
    path: '',
    component: LigneCreditComponent,
    resolve: {
      pagingParams: LigneCreditResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'complements',
    component: ComplementsComponent,
    resolve: {
      pagingParams: LigneCreditResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: LigneCreditDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/echeance-of-ligne-credit-sheet',
    component: EcheanceOfLigneSheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/rapatriements-ligne-credit',
    component: RapatriementLigneCreditComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
];

export const ligneCreditPopupRoute: Routes = [
  {
    path: 'ligne-credit-new',
    component: LigneCreditPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'complement-new',
    component: LigneCreditComplementPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'ligne-credit/:id/edit',
    component: LigneCreditPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'ligne-credit/:id/echeances',
    component: LigneCreditDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneCredit.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
