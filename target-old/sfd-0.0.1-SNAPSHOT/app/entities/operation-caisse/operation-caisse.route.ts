import {
  Routes} from '@angular/router';

import { UserRouteAccessService } from '../../shared';

import { OperationCaisseComponent } from './operation-caisse.component';
import { OperationCaisseDetailComponent } from './operation-caisse-detail.component';
import { OperationCaissePopupComponent } from './operation-caisse-dialog.component';
import { OperationCaisseDeletePopupComponent } from './operation-caisse-delete-dialog.component';
import { OperationCaisseRequestPrintComponent } from './quittance/operation-caisse-request-print.component';


export const OperationCaisseRoute: Routes = [
  {
    path: '',
    component: OperationCaisseComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: OperationCaisseDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'print/:id',
    //path: 'print',
    component: OperationCaisseRequestPrintComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const OperationCaissePopupRoute: Routes = [
  {
    path: 'operation-caisse-new',
    component: OperationCaissePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-caisse/:id/edit',
    component: OperationCaissePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-caisse/:id/delete',
    component: OperationCaisseDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
