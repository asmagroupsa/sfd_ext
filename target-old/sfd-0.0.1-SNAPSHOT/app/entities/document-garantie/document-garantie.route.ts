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

import { DocumentGarantieComponent } from './document-garantie.component';
import { DocumentGarantieDetailComponent } from './document-garantie-detail.component';
import { DocumentGarantiePopupComponent } from './document-garantie-dialog.component';
import { DocumentGarantieDeletePopupComponent } from './document-garantie-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class DocumentGarantieResolvePagingParams implements Resolve<any> {
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

export const documentGarantieRoute: Routes = [
  {
    path: '',
    component: DocumentGarantieComponent,
    resolve: {
      pagingParams: DocumentGarantieResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.documentGarantie.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: DocumentGarantieDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.documentGarantie.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const documentGarantiePopupRoute: Routes = [
  {
    path: 'document-garantie-new',
    component: DocumentGarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.documentGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'document-garantie/:id/edit',
    component: DocumentGarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.documentGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'document-garantie/:id/delete',
    component: DocumentGarantieDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.documentGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
