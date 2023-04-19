import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { EcheancesSFDService } from '../echeancier-sfd/echeances-sfd/echeances-sfd.service';
import {
  RemboursementSFDService,
  RemboursementSFDPopupService,
  RemboursementSFDComponent,
  RemboursementSFDDetailComponent,
  RemboursementSFDDialogComponent,
  RemboursementSFDPopupComponent,
  RemboursementSFDDeletePopupComponent,
  RemboursementSFDDeleteDialogComponent,
  remboursementSFDRoute,
  remboursementSFDPopupRoute,
  RemboursementSFDResolvePagingParams
} from '.';

const ENTITY_STATES = [...remboursementSFDRoute, ...remboursementSFDPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RemboursementSFDComponent,
    RemboursementSFDDetailComponent,
    RemboursementSFDDialogComponent,
    RemboursementSFDDeleteDialogComponent,
    RemboursementSFDPopupComponent,
    RemboursementSFDDeletePopupComponent
  ],
  entryComponents: [
    RemboursementSFDComponent,
    RemboursementSFDDialogComponent,
    RemboursementSFDPopupComponent,
    RemboursementSFDDeleteDialogComponent,
    RemboursementSFDDeletePopupComponent
  ],
  providers: [
    EcheancesSFDService,
    RemboursementSFDService,
    RemboursementSFDPopupService,
    RemboursementSFDResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdRemboursementSFDModule {}
