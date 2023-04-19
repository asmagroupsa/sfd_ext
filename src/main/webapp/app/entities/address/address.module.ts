import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SfdSharedModule } from "../../shared";
import { ClientService } from "../client/client.service";
import { DistrictService } from "../district/district.service";
import {
  AddressService,
  AddressPopupService,
  AddressComponent,
  AddressDetailComponent,
  AddressDialogComponent,
  AddressPopupComponent,
  AddressDeletePopupComponent,
  AddressDeleteDialogComponent,
  addressRoute,
  addressPopupRoute,
  AddressResolvePagingParams
} from ".";
import { DepartementService } from "../departement/departement.service";
import { CityService } from "../city/city.service";
import { TownShipService } from "../town-ship/town-ship.service";
import { ArrondissementPipe, CommunePipe, DepartementPipe } from "./pipe";
const ENTITY_STATES = [...addressRoute, ...addressPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    AddressComponent,
    AddressDetailComponent,
    AddressDialogComponent,
    AddressDeleteDialogComponent,
    AddressPopupComponent,
    AddressDeletePopupComponent,
    ArrondissementPipe,
    CommunePipe,
    DepartementPipe
  ],
  entryComponents: [
    AddressComponent,
    AddressDialogComponent,
    AddressPopupComponent,
    AddressDeleteDialogComponent,
    AddressDeletePopupComponent
  ],
  providers: [
    DistrictService,
    DepartementService,
    CityService,
    TownShipService,
    ClientService,
    AddressService,
    AddressPopupService,
    AddressResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdAddressModule {}
