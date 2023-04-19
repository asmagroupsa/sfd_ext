import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SfdSharedModule } from "../../shared";
import {
  SinistreDeletePopupComponent,
  SnistreDetailComponent,
  SinistreService,
  SinistreResolvePagingParams
} from ".";
import { SinistresComponent } from "./sinistres.component";
import { SinistrePopupService } from "./sinistre-popup.service";
import { sinistreRoute, sinistrePopupRoute } from "./sinistre.route";
import { SinistrePopupComponent, SinistreDialogComponent } from "./sinistre-dialog.component";
import { AssuranceService } from "../assurances";
import { DatePipe } from "@angular/common";
import { SinistreReglementComponent, ReglementSinistrePopupComponent } from "./sinistre-reglement-dialog.component";
import { CARMESService } from "../../shared/carmes.service";
const ENTITY_STATES = [...sinistreRoute, ...sinistrePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SinistresComponent,
    SinistreDialogComponent,
    SinistrePopupComponent,
    SinistreDeletePopupComponent,
    SnistreDetailComponent,
    SinistreReglementComponent,
    ReglementSinistrePopupComponent
  ],
  entryComponents: [
    SinistresComponent,
    SinistreDialogComponent,
    SinistrePopupComponent,
    SinistreDeletePopupComponent,
    ReglementSinistrePopupComponent,
    SinistreReglementComponent
  ],
  providers: [
    SinistreService,
    SinistreResolvePagingParams,
    SinistrePopupService,
    AssuranceService,
    DatePipe,
    CARMESService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSinistreModule {}
