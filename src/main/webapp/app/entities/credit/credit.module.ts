import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {  DatePipe } from '@angular/common';
import { SfdSharedModule, ImageService } from '../../shared';
import { NotificationClientService } from '../notification-client/notification-client.service';
import { EcheancierClientService } from '../echeancier-client/echeancier-client.service';
import { CompteService } from '../compte/compte.service';
import { LigneCreditService } from '../ligne-credit/ligne-credit.service';
import { DossierService } from '../dossier/dossier.service';
import { ClientService } from '../client/client.service';
import { CreditApprobationSheetComponent } from './credit-approbation-sheet.component';
import { AgenceService } from '../agence/agence.service';
import { CreditFicheOrdreComponent } from './credit-fiche-ordre.component';
import { CreditContratTpeComponent } from './credit-fiche-contratTPE.component';
import { PenalitePrintSheetComponent } from './penalite-print-sheet.component';
import {CreditContratUsagerComponent} from './credit-fiche-contrat-usager.component';
/* import { CreditNumeriqueContratComponent } from './credit-numerique-fiche-contrat.component';*/
import {CreditContratSolidaireComponent} from "./credit-fiche-contrat-solidaire.component"
import { CreditContratImmobilierComponent} from './credit-fiche-contrat-immobilier.component';
import { CreditContratEquipementComponent} from './credit-fiche-contrat-equipement.component'
import { CreditContratNumeriqueComponent } from './credit-fiche-contrat-numerique.component';
import { CreditContratMarchandComponent } from './credit-fiche-contrat-marchand.component'

import {
  CreditService,
  CreditPopupService,
  CreditComponent,
  CreditDetailComponent,
  CreditDialogComponent,
  CreditPopupComponent,
  CreditDeletePopupComponent,
  CreditDeleteDialogComponent,
  creditRoute,
  creditPopupRoute,
  CreditResolvePagingParams,

} from '.';
import { DeblocagePipe, MontantPipe } from './pipe';
import { CreditLoanAgreementComponent } from './credit-loan-agreement.component';
import { OperationService } from '../operations/operation.service';
import { CreditEnCoursDialogComponent, CreditEnCoursPopupComponent } from './credit-en-cours-dialog.component';
import { CreditEnCoursComponent } from './credit-en-cours.component';
import {SPSFDService} from '../../shared/sp-sfd.service';
import {ListeCreditsImpayesComponent} from './liste-credits-impayes.component';
import {SPReportService} from '../../shared/sp-report.service';
import { CreditRetrancheComponent } from './credit-retranche.component';
import { CARMESService } from '../../shared/carmes.service';
import { ContratSousTraitantComponent } from './contrat-sous-traitant.component';
import { ContratMCMComponent } from './contrat-mcm.component';
import { CompteActiveComponent } from './compteActive/compteActive.component';
import { CreditPerteComponent } from './type-credit-sfd/credit-perte.component';
import { CreditSouffranceComponent } from './type-credit-sfd/credit-souffrance.component';

const ENTITY_STATES = [...creditRoute, ...creditPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CreditComponent,
    CreditDetailComponent,
    CreditDialogComponent,
    CreditDeleteDialogComponent,
    CreditPopupComponent,
    CreditEnCoursPopupComponent,
    CreditDeletePopupComponent,
    DeblocagePipe,
    MontantPipe,
    CreditApprobationSheetComponent,
    CreditLoanAgreementComponent,
    CreditFicheOrdreComponent,
    CreditContratTpeComponent,
    CreditEnCoursDialogComponent,
    CreditEnCoursComponent,
    PenalitePrintSheetComponent,
    CreditContratUsagerComponent,
    CreditContratSolidaireComponent,
    CreditContratImmobilierComponent,
    CreditContratEquipementComponent,
    CreditContratNumeriqueComponent,
    CreditContratMarchandComponent,
    ListeCreditsImpayesComponent,
    CreditRetrancheComponent,
    ContratSousTraitantComponent,
    ContratMCMComponent,
    CompteActiveComponent,
    CreditPerteComponent,
    CreditSouffranceComponent
  ],
  entryComponents: [
    // CreditComponent,
    CreditDialogComponent,
    CreditPopupComponent,
    CreditEnCoursPopupComponent,
    CreditDeleteDialogComponent,
    CreditDeletePopupComponent,
    CreditEnCoursDialogComponent,
    CreditRetrancheComponent,
    CompteActiveComponent
  ],
  providers: [
    DossierService,
    DatePipe,
    CreditService,
    NotificationClientService,
    EcheancierClientService,
    CompteService,
    ClientService,
    LigneCreditService,
    CreditService,
    OperationService,
    CreditPopupService,
    CreditResolvePagingParams,
    AgenceService,
    ImageService,
    SPSFDService,
    SPReportService,
    CARMESService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCreditModule { }
