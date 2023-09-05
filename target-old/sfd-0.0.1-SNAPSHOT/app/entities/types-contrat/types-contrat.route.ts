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

import { TypesContratComponent } from './types-contrat.component';
import { TypesContratDetailComponent } from './types-contrat-detail.component';
import { TypesContratPopupComponent } from './types-contrat-dialog.component';
import { TypesContratDeletePopupComponent } from './types-contrat-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TypesContratResolvePagingParams implements Resolve<any> {
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

export const TypesContratRoute: Routes = [
  {
    path: '',
    component: TypesContratComponent,
    resolve: {
      pagingParams: TypesContratResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.types-contrat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TypesContratDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.types-contrat.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const TypesContratPopupRoute: Routes = [
  {
    path: 'types-contrat-new',
    component: TypesContratPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.types-contrat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'types-contrat/:id/edit',
    component: TypesContratPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.types-contrat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'types-contrat/:id/delete',
    component: TypesContratDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.types-contrat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
