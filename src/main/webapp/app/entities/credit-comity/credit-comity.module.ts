import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {  DatePipe, CurrencyPipe } from '@angular/common';
import { SfdSharedModule } from '../../shared';
import { AgenceService } from '../agence/agence.service';
import { DossierService } from '../dossier';
import {
  CreditComityService,
  CreditComityPopupService,
  CreditComityComponent,
  CreditComityDetailComponent,
  CreditComityDialogComponent,
  CreditComityPopupComponent,
  CreditComityDeletePopupComponent,
  CreditComityDeleteDialogComponent,
  creditComityRoute,
  creditComityPopupRoute,
  CreditComityResolvePagingParams,
  CreditComityDossierDeleteDialogComponent,
  CreditComityDossierDeletePopupComponent,
  CreditComityClotureDialogComponent,
  CreditComityCloturePopupComponent
} from '.';
import { ClosedPipe } from './pipe';
import { DelegationComityService } from '../delegation-comity/delegation-comity.service';
import {
  CreditComityMemberPopupComponent,
  CreditComityMemberDialogComponent
} from './credit-comity-member-dialog.component';
import { CreditCommityDossiersComponent } from './credit-commity-dossiers.component';
import { CreditCommityFicheDossiersComponent } from './credit-comity-fiche-dossiers.component'
import { CreditCommityFicheDossiersComityMemberComponent } from './credit-comity-fiche-dossiers-comity-member.component'
import { FicheDossiersComityComponent } from './fiche-dossiers-comity-print.component';
import {SPClientService} from '../../shared/sp-client.service';
import {SPSFDService} from '../../shared/sp-sfd.service';
import {LigneRequestService} from '../ligne-request/ligne-request.service';
import {NotificationSFDService} from '../notification-sfd/notification-sfd.service';
import {SPFNMService} from "../../shared/sp-fnm.service";
import {AssocierLigneCreditComiteComponent} from "./associer-ligne-credit-comite.component";
import {PVPreComiteComponent} from "./pv-pre-comite.component";

const ENTITY_STATES = [...creditComityRoute, ...creditComityPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CreditComityComponent,
    CreditComityDetailComponent,
    CreditComityDialogComponent,
    CreditComityDeleteDialogComponent,
    CreditComityPopupComponent,
    CreditComityDossierDeleteDialogComponent,
    CreditComityDeletePopupComponent,
    CreditComityDossierDeletePopupComponent,
    ClosedPipe,
    CreditComityMemberDialogComponent,
    CreditComityMemberPopupComponent,
    CreditComityClotureDialogComponent,
  CreditComityCloturePopupComponent,
    CreditCommityDossiersComponent,
    CreditCommityFicheDossiersComponent,
    CreditCommityFicheDossiersComityMemberComponent,
    FicheDossiersComityComponent,
    AssocierLigneCreditComiteComponent,
    PVPreComiteComponent,
  ],
  entryComponents: [
    CreditComityComponent,
    CreditComityDialogComponent,
    CreditComityPopupComponent,
    CreditComityDeleteDialogComponent,
    CreditComityDossierDeleteDialogComponent,
    CreditComityDeletePopupComponent,
    CreditComityDossierDeletePopupComponent,
    CreditComityClotureDialogComponent,
  CreditComityCloturePopupComponent,
    CreditComityMemberDialogComponent,
    CreditComityMemberPopupComponent,
    CreditCommityDossiersComponent,
    AssocierLigneCreditComiteComponent,
  ],
  providers: [
    DelegationComityService,
    DossierService,
    AgenceService,
    CreditComityService,
    CreditComityPopupService,
    CreditComityResolvePagingParams,
    SPClientService,
    SPSFDService,
    NotificationSFDService,
    LigneRequestService,
    DatePipe,
    SPFNMService,
    CurrencyPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SfdCreditComityModule { }
