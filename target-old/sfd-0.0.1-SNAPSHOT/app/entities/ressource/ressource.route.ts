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

import { RessourceComponent } from './ressource.component';
import { RessourceDetailComponent } from './ressource-detail.component';
import { RessourcePopupComponent } from './ressource-dialog.component';
import { RessourceDeletePopupComponent } from './ressource-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class RessourceResolvePagingParams implements Resolve<any> {
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

export const ressourceRoute: Routes = [
  {
    path: '',
    component: RessourceComponent,
    resolve: {
      pagingParams: RessourceResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ressource.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: RessourceDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ressource.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const ressourcePopupRoute: Routes = [
  {
    path: 'ressource-new',
    component: RessourcePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ressource.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'authority-new',
    component: RessourcePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ressource.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'ressource/:id/edit',
    component: RessourcePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ressource.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'ressource/:id/delete',
    component: RessourceDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.ressource.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
