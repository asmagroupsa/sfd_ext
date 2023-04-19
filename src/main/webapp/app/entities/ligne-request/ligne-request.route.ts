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

import { LigneRequestComponent } from './ligne-request.component';
import { LigneRequestDetailComponent } from './ligne-request-detail.component';
import { LigneRequestPopupComponent } from './ligne-request-dialog.component';
import { LigneRequestDeletePopupComponent } from './ligne-request-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class LigneRequestResolvePagingParams implements Resolve<any> {
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

export const ligneRequestRoute: Routes = [
  {
    path: '',
    component: LigneRequestComponent,
    resolve: {
      pagingParams: LigneRequestResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/ligne-requests/getAllLigneRequests'],
      pageTitle: 'sfdApp.ligneRequest.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: LigneRequestDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ligneRequest.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const ligneRequestPopupRoute: Routes = [
  {
    path: 'ligne-request-new',
    component: LigneRequestPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/ligne-requests/createLigneRequest'],
      pageTitle: 'sfdApp.ligneRequest.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'ligne-request/:id/edit',
    component: LigneRequestPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/ligne-requests/updateLigneRequest'],
      pageTitle: 'sfdApp.ligneRequest.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'ligne-request/:id/delete',
    component: LigneRequestDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/ligne-requests/deleteLigneRequest'],
      pageTitle: 'sfdApp.ligneRequest.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
