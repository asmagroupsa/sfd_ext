import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { CreditService } from '../credit/credit.service';
import { CreditRequestService } from '../credit-request/credit-request.service';
import { FormationService } from '../formation/formation.service';
import {
  NotificationClientService,
  NotificationClientPopupService,
  NotificationClientComponent,
  NotificationClientDetailComponent,
  NotificationClientDialogComponent,
  NotificationClientPopupComponent,
  NotificationClientDeletePopupComponent,
  NotificationClientDeleteDialogComponent,
  notificationClientRoute,
  notificationClientPopupRoute,
  NotificationClientResolvePagingParams
} from '.';
import {NotificationClientPrintComponent} from './notification-client-print.component';
import {DossierCommityMembrePrintComponent} from './dossier-commity-membre-print.component';
const ENTITY_STATES = [
  ...notificationClientRoute,
  ...notificationClientPopupRoute
];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    NotificationClientComponent,
    NotificationClientDetailComponent,
    NotificationClientDialogComponent,
    NotificationClientDeleteDialogComponent,
    NotificationClientPopupComponent,
    NotificationClientDeletePopupComponent,
    NotificationClientPrintComponent,
    DossierCommityMembrePrintComponent
  ],
  entryComponents: [
    NotificationClientComponent,
    NotificationClientDialogComponent,
    NotificationClientPopupComponent,
    NotificationClientDeleteDialogComponent,
    NotificationClientDeletePopupComponent
  ],
  providers: [
    CreditRequestService,
    CreditService,
    FormationService,
    NotificationClientService,
    NotificationClientPopupService,
    NotificationClientResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdNotificationClientModule {}
