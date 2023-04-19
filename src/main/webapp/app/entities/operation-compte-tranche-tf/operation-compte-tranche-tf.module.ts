import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  OperationCompteTrancheTFService,
  OperationCompteTrancheTFPopupService,
  OperationCompteTrancheTFComponent,
  OperationCompteTrancheTFDetailComponent,
  OperationCompteTrancheTFDialogComponent,
  OperationCompteTrancheTFPopupComponent,
  OperationCompteTrancheTFDeletePopupComponent,
  OperationCompteTrancheTFDeleteDialogComponent,
  operationCompteTrancheTFRoute,
  operationCompteTrancheTFPopupRoute,
  OperationCompteTrancheTFResolvePagingParams
} from '.';

const ENTITY_STATES = [
  ...operationCompteTrancheTFRoute,
  ...operationCompteTrancheTFPopupRoute
];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OperationCompteTrancheTFComponent,
    OperationCompteTrancheTFDetailComponent,
    OperationCompteTrancheTFDialogComponent,
    OperationCompteTrancheTFDeleteDialogComponent,
    OperationCompteTrancheTFPopupComponent,
    OperationCompteTrancheTFDeletePopupComponent
  ],
  entryComponents: [
    OperationCompteTrancheTFComponent,
    OperationCompteTrancheTFDialogComponent,
    OperationCompteTrancheTFPopupComponent,
    OperationCompteTrancheTFDeleteDialogComponent,
    OperationCompteTrancheTFDeletePopupComponent
  ],
  providers: [
    OperationCompteTrancheTFService,
    OperationCompteTrancheTFPopupService,
    OperationCompteTrancheTFResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdOperationCompteTrancheTFModule {}
