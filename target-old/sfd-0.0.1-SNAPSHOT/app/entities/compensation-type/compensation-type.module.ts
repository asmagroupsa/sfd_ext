import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  CompensationTypeService,
  CompensationTypePopupService,
  CompensationTypeComponent,
  CompensationTypeDetailComponent,
  CompensationTypeDialogComponent,
  CompensationTypePopupComponent,
  CompensationTypeDeletePopupComponent,
  CompensationTypeDeleteDialogComponent,
  compensationTypeRoute,
  compensationTypePopupRoute,
  CompensationTypeResolvePagingParams
} from '.';

const ENTITY_STATES = [...compensationTypeRoute, ...compensationTypePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CompensationTypeComponent,
    CompensationTypeDetailComponent,
    CompensationTypeDialogComponent,
    CompensationTypeDeleteDialogComponent,
    CompensationTypePopupComponent,
    CompensationTypeDeletePopupComponent
  ],
  entryComponents: [
    CompensationTypeComponent,
    CompensationTypeDialogComponent,
    CompensationTypePopupComponent,
    CompensationTypeDeleteDialogComponent,
    CompensationTypeDeletePopupComponent
  ],
  providers: [
    CompensationTypeService,
    CompensationTypePopupService,
    CompensationTypeResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCompensationTypeModule {}
