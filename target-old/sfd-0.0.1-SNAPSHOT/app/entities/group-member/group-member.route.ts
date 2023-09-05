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

import { GroupMemberComponent } from './group-member.component';
import { GroupMemberDetailComponent } from './group-member-detail.component';
import { GroupMemberPopupComponent } from './group-member-dialog.component';
import { GroupMemberDeletePopupComponent } from './group-member-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class GroupMemberResolvePagingParams implements Resolve<any> {
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

export const groupMemberRoute: Routes = [
  {
    path: '',
    component: GroupMemberComponent,
    resolve: {
      pagingParams: GroupMemberResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.groupMember.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: GroupMemberDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.groupMember.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const groupMemberPopupRoute: Routes = [
  {
    path: 'group-member-new',
    component: GroupMemberPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.groupMember.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'group-member/:id/edit',
    component: GroupMemberPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.groupMember.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'group-member/:id/delete',
    component: GroupMemberDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.groupMember.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
