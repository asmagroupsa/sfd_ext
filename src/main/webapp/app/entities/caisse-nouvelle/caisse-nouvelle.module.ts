import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  CaisseNouvelleService,
  CaisseNouvellePopupService,
  CaisseNouvelleComponent,
  CaisseNouvelleDetailComponent,
  CaisseOperationComponent,
  CaisseNouvelleDialogComponent,
  CaisseNouvellePopupComponent,
  CaisseNouvelleDeletePopupComponent,
  CaisseNouvelleDeleteDialogComponent,
  caisseNouvelleRoute,
  caisseNouvellePopupRoute
} from '.';
import { AlimentationCaissePopupService } from './alimentation-caisse-popup.service';
import { AlimentationCaissePopupComponent, AlimmentationCaisseDialogComponent } from './alimentation-caisse-dialog.component';
import { AlimentationCaisseSfdPopupComponent, AlimmentationCaisseSfdDialogComponent } from './alimentation-caisse-sfd-dialog.component';
import { AlimentationCaisseSfdPopupService } from './alimentation-caisse-sfd-popup.service';
import { CaisseNouvelleDetailSoldeComponent } from './caisse-nouvelle-detail-solde.component';
import { CaisseNouvelleStatutDialogComponent, CaisseNouvelleStatutPopupComponent } from './caisse-nouvelle-statut-dialog.component';
import { CaisseNouvelleStatutPopupService } from './caisse-nouvelle-statut-popup.service';
import { UtilisateurCaisseDialogComponent, UtilisateurCaissePopupComponent } from './utilisateur-caisse/utilisateur-caisse-dialog.component';
import { UtilisateurCaissePopupService } from './utilisateur-caisse/utilisateur-caisse-popup.service';
import { HistoriqueUtilisateurCaissePopupService } from './historique-caisse/historique-caisse-popup.service';
import { HistoriqueUtilisateurCaisseDialogComponent, HistoriqueUtilisateurCaissePopupComponent } from './historique-caisse/historique-caisse-dialog.component';
const ENTITY_STATES = [...caisseNouvelleRoute, ...caisseNouvellePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CaisseNouvelleComponent,
    CaisseNouvelleDetailComponent,
    CaisseNouvelleDetailSoldeComponent,
    CaisseNouvelleDialogComponent,
    CaisseNouvelleDeleteDialogComponent,
    CaisseNouvellePopupComponent,
    CaisseNouvelleDeletePopupComponent,
    AlimmentationCaisseDialogComponent,
    AlimentationCaissePopupComponent,
    AlimmentationCaisseSfdDialogComponent,
    AlimentationCaisseSfdPopupComponent,
    CaisseNouvelleStatutDialogComponent,
    CaisseNouvelleStatutPopupComponent,
    CaisseOperationComponent,
    UtilisateurCaissePopupComponent,
    UtilisateurCaisseDialogComponent,
    HistoriqueUtilisateurCaisseDialogComponent,
    HistoriqueUtilisateurCaissePopupComponent
  ],
  entryComponents: [
    CaisseNouvelleComponent,
    CaisseNouvelleDialogComponent,
    CaisseNouvellePopupComponent,
    CaisseNouvelleDeleteDialogComponent,
    CaisseNouvelleDeletePopupComponent,
    AlimmentationCaisseDialogComponent,
    AlimentationCaissePopupComponent,
    AlimmentationCaisseSfdDialogComponent,
    AlimentationCaisseSfdPopupComponent,
    CaisseNouvelleStatutDialogComponent,
    CaisseNouvelleStatutPopupComponent,
    UtilisateurCaissePopupComponent,
    UtilisateurCaisseDialogComponent,
    HistoriqueUtilisateurCaisseDialogComponent,
    HistoriqueUtilisateurCaissePopupComponent
  ],
  providers: [
    CaisseNouvelleService,
    CaisseNouvellePopupService,
    AlimentationCaissePopupService,
    AlimentationCaisseSfdPopupService,
    CaisseNouvelleStatutPopupService,
    //CurrencyPipe
    UtilisateurCaissePopupService,
    HistoriqueUtilisateurCaissePopupService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCaisseNouvelleModule { }
