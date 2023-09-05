import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  FormationService,
  FormationPopupService,
  FormationComponent,
  FormationDetailComponent,
  FormationDialogComponent,
  FormationPopupComponent,
  FormationDeletePopupComponent,
  FormationDeleteDialogComponent,
  formationRoute,
  formationPopupRoute,
  FormationResolvePagingParams
} from '.';
import { MatiereService } from '../matiere/matiere.service';
import { NotificationClientService } from '../notification-client/notification-client.service';

const ENTITY_STATES = [...formationRoute, ...formationPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    FormationComponent,
    FormationDetailComponent,
    FormationDialogComponent,
    FormationDeleteDialogComponent,
    FormationPopupComponent,
    FormationDeletePopupComponent
  ],
  entryComponents: [
    FormationComponent,
    FormationDialogComponent,
    FormationPopupComponent,
    FormationDeleteDialogComponent,
    FormationDeletePopupComponent
  ],
  providers: [
    NotificationClientService,
    MatiereService,
    FormationService,
    FormationPopupService,
    FormationResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdFormationModule {}
