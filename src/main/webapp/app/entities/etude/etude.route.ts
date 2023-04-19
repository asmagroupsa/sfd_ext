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

import { EtudeComponent } from './etude.component';
import { EtudeDetailComponent } from './etude-detail.component';
import { EtudePopupComponent } from './etude-dialog.component';
import { EtudeDeletePopupComponent } from './etude-delete-dialog.component';

import { Principal } from '../../shared';
import { EtudePrintComponent } from './etude-print.component';
import { EtudeRouteComponent } from './route.component';

@Injectable()
export class EtudeResolvePagingParams implements Resolve<any> {
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

export const etudeRoute: Routes = [
  {
    path: '',
    component: EtudeComponent,
    resolve: {
      pagingParams: EtudeResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      ressources: ['carmesfnmservice/api/etudes/getAllEtudes'],
      pageTitle: 'sfdApp.etude.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: EtudeDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.etude.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/route',
    component: EtudeRouteComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.etude.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':creditRequestId/print',
    component: EtudePrintComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.etude.home.title'
    },
    canActivate: [UserRouteAccessService],
  }
  // {
  //     path: ':creditRequestId/print',
  //     component: EtudePrintComponent,
  //     data: {
  //         authorities: ['ROLE_USER'],
  //         pageTitle: 'sfdApp.etude.home.title'
  //     },
  //     canActivate: [UserRouteAccessService]
  // }
];

export const etudePopupRoute: Routes = [
  {
    path: 'etude-new',
    component: EtudePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources: ['carmesfnmservice/api/etudes/createEtude'],
      pageTitle: 'sfdApp.etude.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'etude/:id/edit',
    component: EtudePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.etude.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'etude/:id/delete',
    component: EtudeDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.etude.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
