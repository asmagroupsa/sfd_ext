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

import { TypeRembtComponent } from './type-rembt.component';
import { TypeRembtDetailComponent } from './type-rembt-detail.component';
import { TypeRembtPopupComponent } from './type-rembt-dialog.component';
import { TypeRembtDeletePopupComponent } from './type-rembt-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TypeRembtResolvePagingParams implements Resolve<any> {
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

export const typeRembtRoute: Routes = [
  {
    path: '',
    component: TypeRembtComponent,
    resolve: {
      pagingParams: TypeRembtResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeRembt.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TypeRembtDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeRembt.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const typeRembtPopupRoute: Routes = [
  {
    path: 'type-rembt-new',
    component: TypeRembtPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeRembt.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-rembt/:id/edit',
    component: TypeRembtPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeRembt.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-rembt/:id/delete',
    component: TypeRembtDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeRembt.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
