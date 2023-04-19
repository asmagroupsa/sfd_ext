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

import { PartnerComponent } from './partner.component';
import { PartnerDetailComponent } from './partner-detail.component';
import { PartnerPopupComponent } from './partner-dialog.component';
import { PartnerDeletePopupComponent } from './partner-delete-dialog.component';
import { PartnerSheetComponent } from './partner-sheet.component';

import { Principal } from '../../shared';

@Injectable()
export class PartnerResolvePagingParams implements Resolve<any> {
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

export const partnerRoute: Routes = [
  {
    path: '',
    component: PartnerComponent,
    resolve: {
      pagingParams: PartnerResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.partner.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: PartnerDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.partner.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/partner-sheet',
    component: PartnerSheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.partner.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const partnerPopupRoute: Routes = [
  {
    path: 'partner-new',
    component: PartnerPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.partner.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'partner/:id/edit',
    component: PartnerPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.partner.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'partner/:id/delete',
    component: PartnerDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.partner.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
