import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { EcheancierSFDService } from '../echeancier-sfd/echeancier-sfd.service';
import { NotificationSFDService } from '../notification-sfd/notification-sfd.service';
import {
  LigneCreditService,
  LigneCreditPopupService,
  LigneCreditComponent,
  LigneCreditDetailComponent,
  LigneCreditDialogComponent,
  LigneCreditPopupComponent,
  LigneCreditDeletePopupComponent,
  LigneCreditDeleteDialogComponent,
  ligneCreditRoute,
  ligneCreditPopupRoute,
  LigneCreditResolvePagingParams,
  EcheanceOfLigneSheetComponent

} from '.';
import { LigneCreditComplementPopupComponent,LigneCreditComplementDialogComponent } from './ligne-credit-complement-dialog.component';

import { TauxSFDService } from '../taux-sfd/taux-sfd.service';
import { PeriodicityService } from '../periodicity/periodicity.service';
import { PartnerService } from '../partner/partner.service';
import { EcheancesSFDService } from '../echeancier-sfd/echeances-sfd';

import { PartnerPipe, EcheancePipe,ByLignePipe } from './pipe';
import { ProduitService } from '../produit';
import { CreditComityService } from '../credit-comity';
import { LigneRequestService } from '../ligne-request';
import {SPUtilService} from '../../shared/sp-util.service';
import {SoldeLigneCreditDialogDialogComponent} from './solde-ligne-credit-dialog.component';
import { LigneCreditListeComponent } from './ligne-credit-complement.component';
import { ComplementsComponent } from './complements.component';
import { RapatriementLigneCreditComponent } from './rapatriement-ligne-credit.component';
import { DecimalPipe, DatePipe } from '@angular/common';
import { UtilService } from '../../shared/util.service';
const ENTITY_STATES = [...ligneCreditRoute, ...ligneCreditPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    LigneCreditListeComponent,
    LigneCreditComponent,
    LigneCreditDetailComponent,
    LigneCreditDialogComponent,
    LigneCreditDeleteDialogComponent,
    LigneCreditPopupComponent,
    LigneCreditDeletePopupComponent,
    LigneCreditComplementPopupComponent,LigneCreditComplementDialogComponent,
    PartnerPipe,
    EcheanceOfLigneSheetComponent,
    EcheancePipe,
    ByLignePipe,
    SoldeLigneCreditDialogDialogComponent,
    ComplementsComponent,
    RapatriementLigneCreditComponent
  ],
  entryComponents: [
    LigneCreditListeComponent,
    LigneCreditComponent,
    LigneCreditDialogComponent,
    LigneCreditPopupComponent,
    LigneCreditDeleteDialogComponent,
    LigneCreditDeletePopupComponent,
    LigneCreditComplementPopupComponent,LigneCreditComplementDialogComponent,
    SoldeLigneCreditDialogDialogComponent,
    ComplementsComponent,
    RapatriementLigneCreditComponent
  ],
  providers: [
    NotificationSFDService,
    EcheancierSFDService,
    PeriodicityService,
    PartnerService,
    TauxSFDService,
    LigneCreditService,
    LigneCreditPopupService,
    LigneCreditResolvePagingParams,
    EcheancesSFDService,
    ProduitService,
    LigneRequestService,
    CreditComityService,
    SPUtilService,
    DecimalPipe,
    UtilService,
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdLigneCreditModule { }
