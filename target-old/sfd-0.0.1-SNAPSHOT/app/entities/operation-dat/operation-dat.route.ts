import {
  Routes} from '@angular/router';

import { UserRouteAccessService } from '../../shared';

import { OperationDatComponent } from './operation-dat.component';
import { OperationDatDetailComponent } from './operation-dat-detail.component';
import { OperationDatPopupComponent } from './operation-dat-dialog.component';
import { OperationDatDeletePopupComponent } from './operation-dat-delete-dialog.component';
import { ContratUnDatRequestPrintComponent } from './contrat-dat/contrat-un-dat-request-print.component';
import { ContratDeuxDatRequestPrintComponent } from './contrat-dat/contrat-deux-dat-request-print.component';


export const OperationDatRoute: Routes = [
  {
    path: '',
    component: OperationDatComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationDat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: OperationDatDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationDat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'print-un/:id',
    component: ContratUnDatRequestPrintComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationDat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'print-deux/:id',
    component: ContratDeuxDatRequestPrintComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationDat.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const OperationDatPopupRoute: Routes = [
  {
    path: 'operation-dat-new',
    component: OperationDatPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationDat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-dat/:id/edit',
    component: OperationDatPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationDat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-dat/:id/delete',
    component: OperationDatDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationDat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
