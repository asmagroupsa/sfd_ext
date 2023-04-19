import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import { CreditRequestService } from '../credit-request/credit-request.service';
import {
  DossierService,
  DossierPopupService,
  DossierComponent,
  DossierDetailComponent,
  DossierDialogComponent,
  DossierPopupComponent,
  DossierDeletePopupComponent,
  DossierDeleteDialogComponent,
  dossierRoute,
  dossierPopupRoute,
  DossierResolvePagingParams
} from '.';
import {LigneRequestService} from '../ligne-request/ligne-request.service';

const ENTITY_STATES = [...dossierRoute, ...dossierPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    DossierComponent,
    DossierDetailComponent,
    DossierDialogComponent,
    DossierDeleteDialogComponent,
    DossierPopupComponent,
    DossierDeletePopupComponent
  ],
  entryComponents: [
    DossierComponent,
    DossierDialogComponent,
    DossierPopupComponent,
    DossierDeleteDialogComponent,
    DossierDeletePopupComponent
  ],
  providers: [
    CreditComityService,
    CreditRequestService,
    DossierService,
    DossierPopupService,
    LigneRequestService,
    DossierResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdDossierModule {}
