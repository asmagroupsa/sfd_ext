import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SfdSharedModule } from "../../shared";
import {
  EligibleService,
  EligiblePopupService,
  EligibleComponent,
  EligibleDetailComponent,
  EligibleDialogComponent,
  EligiblePopupComponent,
  EligibleDeletePopupComponent,
  EligibleDeleteDialogComponent,
  eligibleRoute,
  eligiblePopupRoute,
  EligibleResolvePagingParams
} from ".";

const ENTITY_STATES = [...eligibleRoute, ...eligiblePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    EligibleComponent,
    EligibleDetailComponent,
    EligibleDialogComponent,
    EligibleDeleteDialogComponent,
    EligiblePopupComponent,
    EligibleDeletePopupComponent
  ],
  entryComponents: [
    EligibleComponent,
    EligibleDialogComponent,
    EligiblePopupComponent,
    EligibleDeleteDialogComponent,
    EligibleDeletePopupComponent
  ],
  providers: [
    EligibleService,
    EligiblePopupService,
    EligibleResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdEligibleModule {}
