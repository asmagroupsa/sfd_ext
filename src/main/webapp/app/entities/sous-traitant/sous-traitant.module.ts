import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SfdSharedModule} from '../../shared/shared.module';
import {
    // PhaseService,
    PhasePopupService,
    SousTraitantComponent,
    SousTraitantDialogComponent,
    PhasePopupComponent,
    posteRoute,
    postePopupRoute,
    PosteResolvePagingParams
} from '.';
import {MVNService} from "../../shared/mvn.service";
import {ClientService} from "../client/client.service";
import {CARMESService} from "../../shared/carmes.service";
import {CompensationRequestComponent} from "./compensation-request.component";
import {CompensationRequestDialogComponent} from "./compensation-request-dialog.component";
import {SPFNMService} from "../../shared/sp-fnm.service";
import {TypeClientService} from "../type-client/type-client.service";
import {CityService} from "../city/city.service";
import {TownShipService} from "../town-ship/town-ship.service";
import {DistrictService} from "../district/district.service";

const ENTITY_STATES = [...posteRoute, ...postePopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        SousTraitantComponent,
        SousTraitantDialogComponent,
        PhasePopupComponent,
        CompensationRequestComponent,
        CompensationRequestDialogComponent,
    ],
    entryComponents: [
        SousTraitantComponent,
        SousTraitantDialogComponent,
        PhasePopupComponent,
        CompensationRequestDialogComponent,
    ],
    providers: [
        ClientService,
        TypeClientService,
        PhasePopupService,
        PosteResolvePagingParams,
        MVNService,
        CARMESService,
        SPFNMService,
        CityService,
        TownShipService,
        DistrictService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSousTraitantModule {}
