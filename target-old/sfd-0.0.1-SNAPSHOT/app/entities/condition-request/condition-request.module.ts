import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SfdSharedModule } from "../../shared";
import { ProduitService } from "../produit/produit.service";
import {
  ConditionRequestService,
  ConditionsPopupService,
  ConditionsComponent,
  ConditionsDetailComponent,
  ConditionsDialogComponent,
  ConditionsPopupComponent,
  ConditionsDeletePopupComponent,
  ConditionsDeleteDialogComponent,
  conditionsRoute,
  conditionsPopupRoute,
  ConditionsResolvePagingParams
} from ".";
import { ClientService } from "../client/client.service";
import { ConditionPipe, ElementPipe } from "./pipe";
import { ClientConditionValueService } from "../client-condition-value/client-condition-value.service";
import { ClientConditionNoteService } from "../client-condition-note/client-condition-note.service";

const ENTITY_STATES = [...conditionsRoute, ...conditionsPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ConditionsComponent,
    ConditionsDetailComponent,
    ConditionsDialogComponent,
    ConditionsDeleteDialogComponent,
    ConditionsPopupComponent,
    ConditionsDeletePopupComponent,
    ConditionPipe,
    ElementPipe
  ],
  entryComponents: [
    ConditionsComponent,
    ConditionsDialogComponent,
    ConditionsPopupComponent,
    ConditionsDeleteDialogComponent,
    ConditionsDeletePopupComponent
  ],
  providers: [
    ClientConditionValueService,
    ClientConditionNoteService,
    ClientService,
    ProduitService,
    ConditionRequestService,
    ConditionsPopupService,
    ConditionsResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdConditionRequestModule {}
