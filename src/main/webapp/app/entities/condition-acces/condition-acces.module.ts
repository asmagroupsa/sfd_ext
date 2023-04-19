import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SfdSharedModule } from "../../shared";
import {
  ConditionAccesService,
  ConditionAccesPopupService,
  ConditionAccesComponent,
  ConditionAccesDetailComponent,
  ConditionAccesDialogComponent,
  ConditionAccesPopupComponent,
  ConditionAccesDeletePopupComponent,
  ConditionAccesDeleteDialogComponent,
  conditionAccesRoute,
  conditionAccesPopupRoute,
  ConditionAccesResolvePagingParams
} from ".";
import { ProduitService } from "../produit/produit.service";
import { CategorieConditionService } from "../categorie-condition/categorie-condition.service";

const ENTITY_STATES = [...conditionAccesRoute, ...conditionAccesPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ConditionAccesComponent,
    ConditionAccesDetailComponent,
    ConditionAccesDialogComponent,
    ConditionAccesDeleteDialogComponent,
    ConditionAccesPopupComponent,
    ConditionAccesDeletePopupComponent
  ],
  entryComponents: [
    ConditionAccesComponent,
    ConditionAccesDialogComponent,
    ConditionAccesPopupComponent,
    ConditionAccesDeleteDialogComponent,
    ConditionAccesDeletePopupComponent
  ],
  providers: [
    CategorieConditionService,
    ProduitService,
    ConditionAccesService,
    ConditionAccesPopupService,
    ConditionAccesResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdConditionAccesModule {}
