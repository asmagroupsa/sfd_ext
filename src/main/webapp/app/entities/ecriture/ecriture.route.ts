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

import { EcritureComponent } from './ecriture.component';
import { EcritureDetailComponent } from './ecriture-detail.component';
import { EcriturePopupComponent } from './ecriture-dialog.component';
import { EcritureDeletePopupComponent } from './ecriture-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class EcritureResolvePagingParams implements Resolve<any> {
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

export const ecritureRoute: Routes = [
  {
    path: '',
    component: EcritureComponent,
    resolve: {
      pagingParams: EcritureResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ecriture.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: EcritureDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ecriture.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const ecriturePopupRoute: Routes = [
  {
    path: 'ecriture-new',
    component: EcriturePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ecriture.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'ecriture/:id/edit',
    component: EcriturePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ecriture.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'ecriture/:id/delete',
    component: EcritureDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ecriture.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
