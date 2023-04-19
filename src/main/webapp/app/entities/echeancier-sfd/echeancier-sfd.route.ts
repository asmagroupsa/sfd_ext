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

import { EcheancierSFDComponent } from './echeancier-sfd.component';
import { EcheancierSFDDetailComponent } from './echeancier-sfd-detail.component';
import { EcheancierSFDPopupComponent } from './echeancier-sfd-dialog.component';
import { EcheancierSFDDeletePopupComponent } from './echeancier-sfd-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class EcheancierSFDResolvePagingParams implements Resolve<any> {
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

export const echeancierSFDRoute: Routes = [
  {
    path: '',
    component: EcheancierSFDComponent,
    resolve: {
      pagingParams: EcheancierSFDResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: EcheancierSFDDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const echeancierSFDPopupRoute: Routes = [
  {
    path: 'echeancier-sfd-new',
    component: EcheancierSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'echeancier-sfd/:id/edit',
    component: EcheancierSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'echeancier-sfd/:id/delete',
    component: EcheancierSFDDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
