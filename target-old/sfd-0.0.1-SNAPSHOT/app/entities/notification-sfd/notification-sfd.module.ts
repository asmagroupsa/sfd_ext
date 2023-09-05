import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { LigneCreditService } from '../ligne-credit/ligne-credit.service';
import { LigneRequestService } from '../ligne-request/ligne-request.service';
import {
  NotificationSFDService,
  NotificationSFDPopupService,
  NotificationSFDComponent,
  NotificationSFDDetailComponent,
  NotificationSFDDialogComponent,
  NotificationSFDPopupComponent,
  NotificationSFDDeletePopupComponent,
  NotificationSFDDeleteDialogComponent,
  notificationSFDRoute,
  notificationSFDPopupRoute,
  NotificationSFDResolvePagingParams
} from '.';

const ENTITY_STATES = [...notificationSFDRoute, ...notificationSFDPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    NotificationSFDComponent,
    NotificationSFDDetailComponent,
    NotificationSFDDialogComponent,
    NotificationSFDDeleteDialogComponent,
    NotificationSFDPopupComponent,
    NotificationSFDDeletePopupComponent
  ],
  entryComponents: [
    NotificationSFDComponent,
    NotificationSFDDialogComponent,
    NotificationSFDPopupComponent,
    NotificationSFDDeleteDialogComponent,
    NotificationSFDDeletePopupComponent
  ],
  providers: [
    LigneRequestService,
    LigneCreditService,
    NotificationSFDService,
    NotificationSFDPopupService,
    NotificationSFDResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdNotificationSFDModule {}
