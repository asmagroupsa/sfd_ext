import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { EcheancesSFDService } from '../echeancier-sfd/echeances-sfd/echeances-sfd.service';
import {
  RembtPenalSFDService,
  RembtPenalSFDPopupService,
  RembtPenalSFDComponent,
  RembtPenalSFDDetailComponent,
  RembtPenalSFDDialogComponent,
  RembtPenalSFDPopupComponent,
  RembtPenalSFDDeletePopupComponent,
  RembtPenalSFDDeleteDialogComponent,
  rembtPenalSFDRoute,
  rembtPenalSFDPopupRoute,
  RembtPenalSFDResolvePagingParams
} from '.';

const ENTITY_STATES = [...rembtPenalSFDRoute, ...rembtPenalSFDPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RembtPenalSFDComponent,
    RembtPenalSFDDetailComponent,
    RembtPenalSFDDialogComponent,
    RembtPenalSFDDeleteDialogComponent,
    RembtPenalSFDPopupComponent,
    RembtPenalSFDDeletePopupComponent
  ],
  entryComponents: [
    RembtPenalSFDComponent,
    RembtPenalSFDDialogComponent,
    RembtPenalSFDPopupComponent,
    RembtPenalSFDDeleteDialogComponent,
    RembtPenalSFDDeletePopupComponent
  ],
  providers: [
    EcheancesSFDService,
    RembtPenalSFDService,
    RembtPenalSFDPopupService,
    RembtPenalSFDResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdRembtPenalSFDModule {}
