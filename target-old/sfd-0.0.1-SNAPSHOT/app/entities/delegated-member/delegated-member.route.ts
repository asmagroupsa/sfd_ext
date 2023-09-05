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

import { DelegatedMemberComponent } from './delegated-member.component';
import { DelegatedMemberDetailComponent } from './delegated-member-detail.component';
import { DelegatedMemberPopupComponent } from './delegated-member-dialog.component';
import { DelegatedMemberDeletePopupComponent } from './delegated-member-delete-dialog.component';

@Injectable()
export class DelegatedMemberResolvePagingParams implements Resolve<any> {
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

export const delegatedMemberRoute: Routes = [
  {
    path: '',
    component: DelegatedMemberComponent,
    resolve: {
      pagingParams: DelegatedMemberResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegatedMember.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: DelegatedMemberDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegatedMember.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const delegatedMemberPopupRoute: Routes = [
  {
    path: 'delegated-member-new',
    component: DelegatedMemberPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegatedMember.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'delegated-member/:id/edit',
    component: DelegatedMemberPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegatedMember.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'delegated-member/:id/delete',
    component: DelegatedMemberDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegatedMember.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
