import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  OperationService,
  OperationPopupService,
  OperationComponent,
  OperationDetailComponent,
  OperationDialogComponent,
  OperationPopupComponent,
  OperationDeletePopupComponent,
  OperationDeleteDialogComponent,
  operationRoute,
  operationPopupRoute,
  OperationResolvePagingParams
} from '.';
import { RetraitTpePrintSheetComponent } from './retrait-tpe-print-sheet.component'
import { ListeOperationComponent } from './liste-operation.component';
import { OperationComptableService } from '../operation-comptable/operation-comptable.service';
import { RetraitTPEDialogComponent } from './retrait-tpe-dialog.component';
import { DepotRetraitLocalDialogComponent } from './depot-retrait-local-dialog.component';
import { AlimentationGuichetSFDDialogComponent } from './alimentation-guichet-sfd-dialog.component';
import { CompteService } from '../compte';
import { RetraitLocalPrintSheetComponent } from './retrait-local-print-sheet.component';
import { ListeOperationGuichetierComponent } from './list-depot-retrait-local.component';
import { ListeCommissionsGuichetierComponent } from './commission.component';
import { ConsulterSoldeComponent } from './consulter-solde';
const ENTITY_STATES = [...operationRoute, ...operationPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ListeCommissionsGuichetierComponent,
    ConsulterSoldeComponent,
    OperationComponent,
    OperationDetailComponent,
    OperationDialogComponent,
    OperationDeleteDialogComponent,
    OperationPopupComponent,
    OperationDeletePopupComponent,
    ListeOperationComponent,
    RetraitTPEDialogComponent,
    DepotRetraitLocalDialogComponent,
    AlimentationGuichetSFDDialogComponent,
    RetraitTpePrintSheetComponent,
    ListeOperationGuichetierComponent,
    RetraitLocalPrintSheetComponent
  ],
  entryComponents: [
    ListeCommissionsGuichetierComponent,
    ConsulterSoldeComponent,
    OperationComponent,
    ListeOperationComponent,
    OperationDialogComponent,
    OperationPopupComponent,
    OperationDeleteDialogComponent,
    OperationDeletePopupComponent,
    RetraitTPEDialogComponent,
    AlimentationGuichetSFDDialogComponent,
    DepotRetraitLocalDialogComponent
  ],
  providers: [
    OperationComptableService,
    OperationService,
    OperationPopupService,
    CompteService,
    OperationResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdOperationsModule { }
