import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { TypeGarantieService } from '../type-garantie/type-garantie.service';
import {
  ConditionGarantieService,
  ConditionGarantiePopupService,
  ConditionGarantieComponent,
  ConditionGarantieDetailComponent,
  ConditionGarantieDialogComponent,
  ConditionGarantiePopupComponent,
  ConditionGarantieDeletePopupComponent,
  ConditionGarantieDeleteDialogComponent,
  conditionGarantieRoute,
  conditionGarantiePopupRoute,
  ConditionGarantieResolvePagingParams
} from '.';

const ENTITY_STATES = [
  ...conditionGarantieRoute,
  ...conditionGarantiePopupRoute
];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ConditionGarantieComponent,
    ConditionGarantieDetailComponent,
    ConditionGarantieDialogComponent,
    ConditionGarantieDeleteDialogComponent,
    ConditionGarantiePopupComponent,
    ConditionGarantieDeletePopupComponent
  ],
  entryComponents: [
    ConditionGarantieComponent,
    ConditionGarantieDialogComponent,
    ConditionGarantiePopupComponent,
    ConditionGarantieDeleteDialogComponent,
    ConditionGarantieDeletePopupComponent
  ],
  providers: [
    TypeGarantieService,
    ConditionGarantieService,
    ConditionGarantiePopupService,
    ConditionGarantieResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdConditionGarantieModule {}
