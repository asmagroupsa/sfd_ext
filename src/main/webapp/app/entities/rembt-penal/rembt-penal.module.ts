import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { EcheancesClientService } from '../echeancier-client/echeances-client/echeances-client.service';

import {
  RembtPenalService,
  RembtPenalPopupService,
  RembtPenalComponent,
  RembtPenalDetailComponent,
  RembtPenalDialogComponent,
  RembtPenalPopupComponent,
  RembtPenalDeletePopupComponent,
  RembtPenalDeleteDialogComponent,
  rembtPenalRoute,
  rembtPenalPopupRoute,
  RembtPenalResolvePagingParams
} from '.';

const ENTITY_STATES = [...rembtPenalRoute, ...rembtPenalPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RembtPenalComponent,
    RembtPenalDetailComponent,
    RembtPenalDialogComponent,
    RembtPenalDeleteDialogComponent,
    RembtPenalPopupComponent,
    RembtPenalDeletePopupComponent
  ],
  entryComponents: [
    RembtPenalComponent,
    RembtPenalDialogComponent,
    RembtPenalPopupComponent,
    RembtPenalDeleteDialogComponent,
    RembtPenalDeletePopupComponent
  ],
  providers: [
    EcheancesClientService,
    RembtPenalService,
    RembtPenalPopupService,
    RembtPenalResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdRembtPenalModule {}
