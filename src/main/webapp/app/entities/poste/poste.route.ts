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

import { PosteComponent } from './poste.component';
import { PosteDetailComponent } from './poste-detail.component';
import { PostePopupComponent } from './poste-dialog.component';
import { PosteDeletePopupComponent } from './poste-delete-dialog.component';

@Injectable()
export class PosteResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) { }

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

export const posteRoute: Routes = [
  {
    path: '',
    component: PosteComponent,
    resolve: {
      pagingParams: PosteResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: PosteDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const postePopupRoute: Routes = [
  {
    path: 'poste-new',
    component: PostePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'poste/:id/edit',
    component: PostePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'poste/:id/delete',
    component: PosteDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
