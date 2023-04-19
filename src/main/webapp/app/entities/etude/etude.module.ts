import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ServiceUserService } from '../service-user/service-user.service';
import { CreditRequestService } from '../credit-request/credit-request.service';
import {
  EtudeService,
  EtudePopupService,
  EtudeComponent,
  EtudeDetailComponent,
  EtudeDialogComponent,
  EtudePopupComponent,
  EtudeDeletePopupComponent,
  EtudeDeleteDialogComponent,
  etudeRoute,
  etudePopupRoute,
  EtudeResolvePagingParams
} from '.';
import { TypeEtudePipe } from './pipe';
import { EtudePrintComponent } from './etude-print.component';
import { ClientService } from '../client/client.service';
import { ImageService } from '../../shared'
import { CreditRequestStatusService } from '../credit-request-status/credit-request-status.service';
import {EtudeRouteComponent} from './route.component';
const ENTITY_STATES = [...etudeRoute, ...etudePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EtudeComponent,
    EtudeDetailComponent,
    EtudeDialogComponent,
    EtudeDeleteDialogComponent,
    EtudePopupComponent,
    EtudeDeletePopupComponent,
    TypeEtudePipe,
    EtudePrintComponent,
    EtudeRouteComponent
  ],
  entryComponents: [
    EtudeComponent,
    EtudeDialogComponent,
    EtudePopupComponent,
    EtudeDeleteDialogComponent,
    EtudeDeletePopupComponent,
    EtudePrintComponent
  ],
  providers: [
    CreditRequestStatusService,
    ServiceUserService,
    CreditRequestService,
    EtudeService,
    EtudePopupService,
    EtudeResolvePagingParams,
    ClientService,
    ImageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdEtudeModule { }
