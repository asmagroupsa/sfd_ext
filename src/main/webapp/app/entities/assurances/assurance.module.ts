import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SfdSharedModule } from "../../shared";
import { AssuranceComponent } from "./assurance.component";
import { AssuranceDetailComponent } from "./assurance-detail.component";
import { AssuranceDialogComponent, AssurancePopupComponent } from "./assurance-dialog.component";
import { AssuranceDeleteDialogComponent, AssuranceDeletePopupComponent } from "./assurance-delete-dialog.component";
import { assuranceRoute, AssurancePopupRoute, AssuranceResolvePagingParams } from "./assurance.route";
import { AssuranceService } from "./assurance.service";
import { AssurancePopupService } from "./assurance-popup.service";
import { AssuranceReleveComponent } from "./asurance-ayant-droit.component";
import { DatePipe } from "@angular/common";
const ENTITY_STATES = [...assuranceRoute, ...AssurancePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    AssuranceComponent,
    AssuranceDetailComponent,
    AssuranceDialogComponent,
    AssuranceDeleteDialogComponent,
    AssurancePopupComponent,
    AssuranceDeletePopupComponent,
    AssuranceReleveComponent,

  ],
  entryComponents: [
    AssuranceComponent,
    AssuranceDialogComponent,
    AssurancePopupComponent,
    AssuranceDeleteDialogComponent,
    AssuranceDeletePopupComponent,
  ],
  providers: [
    AssuranceService,
    AssurancePopupService,
    AssuranceResolvePagingParams,
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdAssuranceModule {}
