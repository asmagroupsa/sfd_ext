import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiProfileService } from '../../admin/profile/profile.service';
import { SfdSharedModule } from '../../shared';
import {
  SouscriptionService,
  SouscriptionPopupService,
  SouscriptionComponent,
  SouscriptionDetailComponent,
  SouscriptionDialogComponent,
  SouscriptionPopupComponent,
  SouscriptionDeletePopupComponent,
  SouscriptionDeleteDialogComponent,
  souscriptionRoute,
  souscriptionPopupRoute,
  SouscriptionResolvePagingParams
} from '.';
import { NecessaryPipe, AlreadysouscriptionPipe } from './pipe';
import {AddSouscriptionSfdDialogComponent} from './add-souscription-sfd-dialog.component';
import { AddSouscriptionBailleurDialogComponent } from './add-souscription-bailleur-dialog.component';
import { PeriodicityService } from '../periodicity';

const ENTITY_STATES = [...souscriptionRoute, ...souscriptionPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SouscriptionComponent,
    SouscriptionDetailComponent,
    SouscriptionDialogComponent,
    SouscriptionDeleteDialogComponent,
    SouscriptionPopupComponent,
    SouscriptionDeletePopupComponent,
    NecessaryPipe,
    AddSouscriptionSfdDialogComponent,
    AddSouscriptionBailleurDialogComponent,
    AlreadysouscriptionPipe
  ],
  entryComponents: [
    SouscriptionComponent,
    SouscriptionDialogComponent,
    SouscriptionPopupComponent,
    SouscriptionDeleteDialogComponent,
    AddSouscriptionSfdDialogComponent,
    AddSouscriptionBailleurDialogComponent,
    SouscriptionDeletePopupComponent
  ],
  providers: [
    SouscriptionService,
    SouscriptionPopupService,
    JhiProfileService,
    SouscriptionResolvePagingParams,
    PeriodicityService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSouscriptionModule { }
