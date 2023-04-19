import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
  CanActivate
} from '@angular/router';
import { CompensationOrdreSheetComponent } from './compensation-ordre-sheet.component';
import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CompensationComponent } from './compensation.component';
import { CompensationDetailComponent } from './compensation-detail.component';
import { CompensationPopupComponent } from './compensation-dialog.component';
import { CompensationDeletePopupComponent } from './compensation-delete-dialog.component';
import { CompensationPrintSheetComponent} from './compensation-print-sheet.component'
import { Principal } from '../../shared';
import { OrdreVirementPrintSheetComponent } from './transfert-order-print-sheet.component';
import {TransferOrderPrintComponent} from './transfer-order-print.component';

@Injectable()
export class CompensationResolvePagingParams implements Resolve<any> {
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

export const compensationRoute: Routes = [
  {
    path: '',
    component: CompensationComponent,
    resolve: {
      pagingParams: CompensationResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/compensations/getAllCompensations'],
      pageTitle: 'sfdApp.compensation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
 {
    path: 'ordre-virement-print',
    component: CompensationOrdreSheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'print',
    component: CompensationPrintSheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/print-ordre-virement',
    // component: TransferOrderPrintComponent,
    component: OrdreVirementPrintSheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/:type',
    component: CompensationDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
];

export const compensationPopupRoute: Routes = [
  {
    path: 'compensation-new',
    component: CompensationPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/compensations/createCompensation'],
      pageTitle: 'sfdApp.compensation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'compensation/:id/edit',
    component: CompensationPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'compensation/:id/delete',
    component: CompensationDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
