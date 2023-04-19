import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreditService } from '../credit/credit.service';
import { SfdSharedModule } from '../../shared';
import {
  EcheancesClientDeletePopupComponent,
  EcheancesClientDeleteDialogComponent
} from './echeances-client/echeances-client-delete-dialog.component';
import { EcheancesClientComponent } from './echeances-client/echeances-client.component';
import {
  EcheancesClientDialogComponent,
  EcheancesClientPopupComponent
} from './echeances-client/echeances-client-dialog.component';
// import { EcheancesPipe } from './echeances-client/pipe';
import { EcheancesClientDetailComponent } from './echeances-client/echeances-client-detail.component';
import { RembtPenalService } from '../rembt-penal/rembt-penal.service';
import { CompteService } from '../compte/compte.service';
import { EcheancesClientService } from './echeances-client/echeances-client.service';
import { EcheancesClientPopupService } from './echeances-client/echeances-client-popup.service';
import { EcheancesClientResolvePagingParams } from './echeances-client/echeances-client.route';
import {
  EcheancierClientService,
  EcheancierClientPopupService,
  EcheancierClientComponent,
  EcheancierClientDetailComponent,
  EcheancierClientDialogComponent,
  EcheancierClientPopupComponent,
  EcheancierClientDeletePopupComponent,
  EcheancierClientDeleteDialogComponent,
  echeancierClientRoute,
  echeancierClientPopupRoute,
  EcheancierClientResolvePagingParams
} from '.';

const ENTITY_STATES = [...echeancierClientRoute, ...echeancierClientPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EcheancierClientComponent,
    EcheancierClientDetailComponent,
    EcheancierClientDialogComponent,
    EcheancierClientDeleteDialogComponent,
    EcheancierClientPopupComponent,
    EcheancierClientDeletePopupComponent,
    EcheancesClientComponent,
    EcheancesClientDetailComponent,
    EcheancesClientDialogComponent,
    EcheancesClientDeleteDialogComponent,
    EcheancesClientPopupComponent,
    EcheancesClientDeletePopupComponent,
    // EcheancesPipe
  ],
  entryComponents: [
    EcheancierClientComponent,
    EcheancierClientDialogComponent,
    EcheancierClientPopupComponent,
    EcheancierClientDeleteDialogComponent,
    EcheancierClientDeletePopupComponent,
    EcheancesClientComponent,
    EcheancesClientDialogComponent,
    EcheancesClientPopupComponent,
    EcheancesClientDeleteDialogComponent,
    EcheancesClientDeletePopupComponent
  ],
  providers: [
    CreditService,
    EcheancierClientService,
    EcheancierClientPopupService,
    EcheancierClientResolvePagingParams,
    RembtPenalService,
    CompteService,
    EcheancierClientService,
    EcheancesClientService,
    EcheancesClientPopupService,
    EcheancesClientResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdEcheancierClientModule {}
