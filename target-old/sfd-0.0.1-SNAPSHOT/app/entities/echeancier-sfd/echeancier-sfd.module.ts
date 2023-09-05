import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LigneCreditService } from '../ligne-credit/ligne-credit.service';
import { SfdSharedModule } from '../../shared';
import {
  EcheancierSFDService,
  EcheancierSFDPopupService,
  EcheancierSFDComponent,
  EcheancierSFDDetailComponent,
  EcheancierSFDDialogComponent,
  EcheancierSFDPopupComponent,
  EcheancierSFDDeletePopupComponent,
  EcheancierSFDDeleteDialogComponent,
  echeancierSFDRoute,
  echeancierSFDPopupRoute,
  EcheancierSFDResolvePagingParams
} from '.';
import { EcheancesSFDResolvePagingParams } from './echeances-sfd/echeances-sfd.route';
import { EcheancesSFDPopupService } from './echeances-sfd/echeances-sfd-popup.service';
import { EcheancesSFDService } from './echeances-sfd/echeances-sfd.service';
import {
  EcheancesSFDDeletePopupComponent,
  EcheancesSFDDeleteDialogComponent
} from './echeances-sfd/echeances-sfd-delete-dialog.component';
import { EcheancesSFDComponent } from './echeances-sfd/echeances-sfd.component';
// import { EcheancesPipe } from '../echeancier-client/echeances-client/pipe';
import {
  EcheancesSFDPopupComponent,
  EcheancesSFDDialogComponent
} from './echeances-sfd/echeances-sfd-dialog.component';
import { EcheancesSFDDetailComponent } from './echeances-sfd/echeances-sfd-detail.component';
import { echeancesSFDRoute, echeancesSFDPopupRoute } from './echeances-sfd';

// const ENTITY_STATES = [...echeancierSFDRoute, ...echeancierSFDPopupRoute];
const ENTITY_STATES = [...echeancesSFDRoute, ...echeancesSFDPopupRoute, ...echeancierSFDRoute, ...echeancierSFDPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EcheancierSFDComponent,
    EcheancierSFDDetailComponent,
    EcheancierSFDDialogComponent,
    EcheancierSFDDeleteDialogComponent,
    EcheancierSFDPopupComponent,
    EcheancierSFDDeletePopupComponent,
    EcheancesSFDComponent,
    EcheancesSFDDetailComponent,
    EcheancesSFDDialogComponent,
    EcheancesSFDDeleteDialogComponent,
    EcheancesSFDPopupComponent,
    EcheancesSFDDeletePopupComponent,
    // EcheancesPipe
  ],
  entryComponents: [
    EcheancierSFDComponent,
    EcheancierSFDDialogComponent,
    EcheancierSFDPopupComponent,
    EcheancierSFDDeleteDialogComponent,
    EcheancierSFDDeletePopupComponent,
    EcheancesSFDComponent,
    EcheancesSFDDialogComponent,
    EcheancesSFDPopupComponent,
    EcheancesSFDDeleteDialogComponent,
    EcheancesSFDDeletePopupComponent
  ],
  providers: [
    LigneCreditService,
    EcheancierSFDService,
    EcheancierSFDPopupService,
    EcheancierSFDResolvePagingParams,
    EcheancierSFDService,
    EcheancesSFDService,
    EcheancesSFDPopupService,
    EcheancesSFDResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdEcheancierSFDModule {}
