import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import {SfdSharedModule} from '../../shared/shared.module';

import { SouscriptionBailleurDeleteDialogComponent, SouscriptionBailleurDeletePopupComponent, SouscriptionBailleurDetailComponent } from '.';
import { ClientService } from '../client';
import { PeriodicityService } from '../periodicity';
import { CountryService } from '../country';
import { SOUSCRIPTIONBAILLEURResolvePagingParams, souscriptionBailleurPopupRoute, souscriptionBailleurRoute } from './souscription-bailleur.route';
import { SOUSCRIPTIONBAILLEURComponent } from './souscription-bailleur.component';
import { SouscriptionBailleurDialogComponent, SouscriptionBailleurPopupComponent } from './souscription-bailleur-dialog.component';
import { SouscriptionBailleurService } from './souscription-bailleur.service';
import { SouscriptionBailleurPopupService } from './souscription-bailleur-popup.service';

const ENTITY_STATES = [...souscriptionBailleurRoute, ...souscriptionBailleurPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SOUSCRIPTIONBAILLEURComponent,
    SouscriptionBailleurDetailComponent,
    SouscriptionBailleurDialogComponent,
    SouscriptionBailleurDeleteDialogComponent,
    SouscriptionBailleurPopupComponent,
    SouscriptionBailleurDeletePopupComponent
  ],
  entryComponents: [
    SOUSCRIPTIONBAILLEURComponent,
    SouscriptionBailleurDialogComponent,
    SouscriptionBailleurPopupComponent,
    SouscriptionBailleurDeleteDialogComponent,
    SouscriptionBailleurDeletePopupComponent
  ],
  providers: [
    ClientService,
    SouscriptionBailleurService,
    SouscriptionBailleurPopupService,
    PeriodicityService,
    CountryService,
    SOUSCRIPTIONBAILLEURResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BailleurSouscriptionModule {}
