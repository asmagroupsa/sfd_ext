import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes
} from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ZoneAgenceComponent } from './zone-agence.component';
import { ZoneAgenceDetailComponent } from './zone-agence-detail.component';
import { ZoneAgencePopupComponent } from './zone-agence-dialog.component';
import { ZoneAgenceDeletePopupComponent } from './zone-agence-delete-dialog.component';

@Injectable()
export class ZoneAgenceResolvePagingParams implements Resolve<any> {
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

export const zoneAgenceRoute: Routes = [
  {
    path: '',
    component: ZoneAgenceComponent,
    resolve: {
      pagingParams: ZoneAgenceResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.zoneAgence.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: ZoneAgenceDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.zoneAgence.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const zoneAgencePopupRoute: Routes = [
  {
    path: 'zone-agence-new',
    component: ZoneAgencePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.zoneAgence.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'zone-agence/:id/edit',
    component: ZoneAgencePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.zoneAgence.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'zone-agence/:id/delete',
    component: ZoneAgenceDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.zoneAgence.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
