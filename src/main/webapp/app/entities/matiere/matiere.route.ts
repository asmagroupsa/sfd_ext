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

import { MatiereComponent } from './matiere.component';
import { MatiereDetailComponent } from './matiere-detail.component';
import { MatierePopupComponent } from './matiere-dialog.component';
import { MatiereDeletePopupComponent } from './matiere-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class MatiereResolvePagingParams implements Resolve<any> {
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

export const matiereRoute: Routes = [
  {
    path: '',
    component: MatiereComponent,
    resolve: {
      pagingParams: MatiereResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.matiere.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: MatiereDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.matiere.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const matierePopupRoute: Routes = [
  {
    path: 'matiere-new',
    component: MatierePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.matiere.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'matiere/:id/edit',
    component: MatierePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.matiere.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'matiere/:id/delete',
    component: MatiereDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.matiere.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
