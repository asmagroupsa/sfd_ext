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

const ENTITY_STATES = [...operationRoute, ...operationPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OperationComponent,
    OperationDetailComponent,
    OperationDialogComponent,
    OperationDeleteDialogComponent,
    OperationPopupComponent,
    OperationDeletePopupComponent
  ],
  entryComponents: [
    OperationComponent,
    OperationDialogComponent,
    OperationPopupComponent,
    OperationDeleteDialogComponent,
    OperationDeletePopupComponent
  ],
  providers: [
    OperationService,
    OperationPopupService,
    OperationResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdOperationModule {}
