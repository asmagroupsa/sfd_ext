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

import { NotificationClientComponent } from './notification-client.component';
import { NotificationClientDetailComponent } from './notification-client-detail.component';
import { NotificationClientPopupComponent } from './notification-client-dialog.component';
import { NotificationClientDeletePopupComponent } from './notification-client-delete-dialog.component';
import {NotificationClientPrintComponent} from './notification-client-print.component';
import {DossierCommityMembrePrintComponent} from './dossier-commity-membre-print.component'
import { Principal } from '../../shared';

@Injectable()
export class NotificationClientResolvePagingParams implements Resolve<any> {
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

export const notificationClientRoute: Routes = [
  {
    path: '',
    component: NotificationClientComponent,
    resolve: {
      pagingParams: NotificationClientResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.notificationClient.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: NotificationClientDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.notificationClient.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
    // {
    //     path: ':id/print',
    //     component: NotificationClientPrintComponent,
    //     data: {
    //         authorities: ['ROLE_USER'],
    //         pageTitle: 'sfdApp.notificationClient.home.title'
    //     },
    //     canActivate: [UserRouteAccessService]
    // },
      {
          path: ':id/print-commity-membre-dossier',
          component: DossierCommityMembrePrintComponent,
          data: {
              authorities: ['ROLE_USER'],
              pageTitle: 'sfdApp.notificationClient.home.title'
          },
          canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/print',
    component: NotificationClientPrintComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.notificationClient.home.title'
    },
    canActivate: [UserRouteAccessService],
  }
];

export const notificationClientPopupRoute: Routes = [
  {
    path: 'notification-client-new',
    component: NotificationClientPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.notificationClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'notification-client/:id/edit',
    component: NotificationClientPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.notificationClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'notification-client/:id/delete',
    component: NotificationClientDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.notificationClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
