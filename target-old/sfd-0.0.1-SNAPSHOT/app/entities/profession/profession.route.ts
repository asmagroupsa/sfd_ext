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

import { ProfessionComponent } from './profession.component';
import { ProfessionDetailComponent } from './profession-detail.component';
import { ProfessionPopupComponent } from './profession-dialog.component';
import { ProfessionDeletePopupComponent } from './profession-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class ProfessionResolvePagingParams implements Resolve<any> {
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

export const professionRoute: Routes = [
  {
    path: '',
    component: ProfessionComponent,
    resolve: {
      pagingParams: ProfessionResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.profession.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: ProfessionDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.profession.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const professionPopupRoute: Routes = [
  {
    path: 'profession-new',
    component: ProfessionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.profession.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'profession/:id/edit',
    component: ProfessionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.profession.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'profession/:id/delete',
    component: ProfessionDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.profession.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
