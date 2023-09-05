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

import { FormationComponent } from './formation.component';
import { FormationDetailComponent } from './formation-detail.component';
import { FormationPopupComponent } from './formation-dialog.component';
import { FormationDeletePopupComponent } from './formation-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class FormationResolvePagingParams implements Resolve<any> {
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

export const formationRoute: Routes = [
  {
    path: '',
    component: FormationComponent,
    resolve: {
      pagingParams: FormationResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.formation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: FormationDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.formation.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const formationPopupRoute: Routes = [
  {
    path: 'formation-new',
    component: FormationPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.formation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'formation/:id/edit',
    component: FormationPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.formation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'formation/:id/delete',
    component: FormationDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.formation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
