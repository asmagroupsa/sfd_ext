import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  DistrictService,
  DistrictPopupService,
  DistrictComponent,
  DistrictDetailComponent,
  DistrictDialogComponent,
  DistrictPopupComponent,
  DistrictDeletePopupComponent,
  DistrictDeleteDialogComponent,
  districtRoute,
  districtPopupRoute,
  DistrictResolvePagingParams
} from '.';
import { TownShipService } from '../town-ship';
import { CityService } from '../city/city.service';
import { DepartementService } from '../departement';

const ENTITY_STATES = [...districtRoute, ...districtPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DistrictComponent,
    DistrictDetailComponent,
    DistrictDialogComponent,
    DistrictDeleteDialogComponent,
    DistrictPopupComponent,
    DistrictDeletePopupComponent
  ],
  entryComponents: [
    DistrictComponent,
    DistrictDialogComponent,
    DistrictPopupComponent,
    DistrictDeleteDialogComponent,
    DistrictDeletePopupComponent
  ],
  providers: [
    DistrictService,
    DistrictPopupService,
    DistrictResolvePagingParams,
    TownShipService,
    DepartementService,
    CityService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdDistrictModule {}
