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

import { DisponibiliteComponent } from './disponibilite.component';
import { DisponibiliteDetailComponent } from './disponibilite-detail.component';
import { DisponibilitePopupComponent } from './disponibilite-dialog.component';
import { DisponibiliteDeletePopupComponent } from './disponibilite-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class DisponibiliteResolvePagingParams implements Resolve<any> {
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

export const disponibiliteRoute: Routes = [
  {
    path: '',
    component: DisponibiliteComponent,
    resolve: {
      pagingParams: DisponibiliteResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.disponibilite.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: DisponibiliteDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.disponibilite.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const disponibilitePopupRoute: Routes = [
  {
    path: 'disponibilite-new',
    component: DisponibilitePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.disponibilite.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'disponibilite/:id/edit',
    component: DisponibilitePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.disponibilite.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'disponibilite/:id/delete',
    component: DisponibiliteDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.disponibilite.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
