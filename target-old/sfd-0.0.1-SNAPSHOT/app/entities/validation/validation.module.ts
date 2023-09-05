import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  ValidationService,
  ValidationPopupService,
  ValidationComponent,
  ValidationDetailComponent,
  ValidationDialogComponent,
  ValidationPopupComponent,
  ValidationDeletePopupComponent,
  ValidationDeleteDialogComponent,
  validationRoute,
  validationPopupRoute,
  ValidationResolvePagingParams,
} from '.';
import {ValidationObservationDialogComponent, ValidationObservationPopupComponent} from './validation-observation-dialog';
import { ComityMberService } from '../comity-mber/comity-mber.service';
import { DossierService } from '../dossier/dossier.service';
import { CreditRequestService } from '../credit-request/credit-request.service';
import { ClientService } from '../client/client.service';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import {FicheDossiersComponent} from './fiche-dossiers.component';
import {FicheDossiersComityMemberComponent} from './fiche-dossiers-comity-member.component'
import { FichePvComponent } from './fiche-proces-verbal-comite.component';

const ENTITY_STATES = [...validationRoute, ...validationPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ValidationComponent,
    ValidationDetailComponent,
    ValidationDialogComponent,
    ValidationDeleteDialogComponent,
    ValidationPopupComponent,
    ValidationDeletePopupComponent,
    FicheDossiersComponent,
    FicheDossiersComityMemberComponent,
    FichePvComponent,
    ValidationObservationDialogComponent,
    ValidationObservationPopupComponent,
  ],
  entryComponents: [
    ValidationComponent,
    ValidationDialogComponent,
    ValidationPopupComponent,
    ValidationDeleteDialogComponent,
    ValidationDeletePopupComponent,
    ValidationObservationDialogComponent
  ],
  providers: [
    ClientService,
    CreditRequestService,
    ComityMberService,
    CreditComityService,
    DossierService,
    ValidationService,
    ValidationPopupService,
    ValidationResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdValidationModule {}
