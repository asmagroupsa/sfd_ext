import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import {SfdSharedModule} from '../../shared/shared.module';

import { SouscriptionSfdDeleteDialogComponent, SouscriptionSfdDeletePopupComponent, SouscriptionSfdDetailComponent } from '.';
import { ClientService } from '../client';
import { PeriodicityService } from '../periodicity';
import { CountryService } from '../country';
import { SOUSCRIPTIONSfdResolvePagingParams, souscriptionSfdPopupRoute, souscriptionSfdRoute } from './souscription-sfd.route';
import { SOUSCRIPTIONSfdComponent } from './souscription-sfd.component';
import { SouscriptionSfdDialogComponent, SouscriptionSfdPopupComponent } from './souscription-sfd-dialog.component';
import { SouscriptionSfdService } from './souscription-sfd.service';
import { SouscriptionSfdPopupService } from './souscription-sfd-popup.service';

const ENTITY_STATES = [...souscriptionSfdRoute, ...souscriptionSfdPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SOUSCRIPTIONSfdComponent,
    SouscriptionSfdDetailComponent,
    SouscriptionSfdDialogComponent,
    SouscriptionSfdDeleteDialogComponent,
    SouscriptionSfdPopupComponent,
    SouscriptionSfdDeletePopupComponent
  ],
  entryComponents: [
    SOUSCRIPTIONSfdComponent,
    SouscriptionSfdDialogComponent,
    SouscriptionSfdPopupComponent,
    SouscriptionSfdDeleteDialogComponent,
    SouscriptionSfdDeletePopupComponent
  ],
  providers: [
    ClientService,
    SouscriptionSfdService,
    SouscriptionSfdPopupService,
    PeriodicityService,
    CountryService,
    SOUSCRIPTIONSfdResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSouscriptionModule {}
