import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  OperationComptableService,
  OperationComptablePopupService,
  OperationComptableComponent,
  OperationComptableDetailComponent,
  OperationComptableDialogComponent,
  OperationComptablePopupComponent,
  OperationComptableDeletePopupComponent,
  OperationComptableDeleteDialogComponent,
  operationComptableRoute,
  operationComptablePopupRoute,
  OperationComptableResolvePagingParams
} from '.';

const ENTITY_STATES = [
  ...operationComptableRoute,
  ...operationComptablePopupRoute
];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OperationComptableComponent,
    OperationComptableDetailComponent,
    OperationComptableDialogComponent,
    OperationComptableDeleteDialogComponent,
    OperationComptablePopupComponent,
    OperationComptableDeletePopupComponent
  ],
  entryComponents: [
    OperationComptableComponent,
    OperationComptableDialogComponent,
    OperationComptablePopupComponent,
    OperationComptableDeleteDialogComponent,
    OperationComptableDeletePopupComponent
  ],
  providers: [
    OperationComptableService,
    OperationComptablePopupService,
    OperationComptableResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdOperationComptableModule { }
