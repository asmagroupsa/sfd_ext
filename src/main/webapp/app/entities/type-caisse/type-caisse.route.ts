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

import { TypeCaisseComponent } from './type-caisse.component';
import { TypeCaisseDetailComponent } from './type-caisse-detail.component';
import { TypeCaissePopupComponent } from './type-caisse-dialog.component';
import { TypeCaisseDeletePopupComponent } from './type-caisse-delete-dialog.component';

@Injectable()
export class TypeCaisseResolvePagingParams implements Resolve<any> {
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

export const typeCaisseRoute: Routes = [
  {
    path: '',
    component: TypeCaisseComponent,
    resolve: {
      pagingParams: TypeCaisseResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCaisse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TypeCaisseDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCaisse.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const typeCaissePopupRoute: Routes = [
  {
    path: 'type-caisse-new',
    component: TypeCaissePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-caisse/:id/edit',
    component: TypeCaissePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-caisse/:id/delete',
    component: TypeCaisseDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
