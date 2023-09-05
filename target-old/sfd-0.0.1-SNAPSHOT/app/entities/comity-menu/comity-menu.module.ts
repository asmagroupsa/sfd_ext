import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  ComityMberService,
  ComityMberPopupService,
  ComityMberComponent,
  ComityMberDetailComponent,
  ComityMberDialogComponent,
  ComityMberPopupComponent,
  ComityMberDeletePopupComponent,
  ComityMberDeleteDialogComponent,
  comityMberRoute,
  comityMberPopupRoute,
  ComityMberResolvePagingParams
} from '.';
import { TypeMembreService } from '../type-membre/type-membre.service';
import { ServiceUserService } from '../service-user/service-user.service';
import { CreditRequestService } from '../credit-request/credit-request.service';
import { ClientService } from '../client/client.service';
import { ProduitService } from '../produit/produit.service';
import { StatusPipe } from '../credit-request/pipe';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import { ValidationService } from '../validation/validation.service';

const ENTITY_STATES = [...comityMberRoute, ...comityMberPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ComityMberComponent,
    ComityMberDetailComponent,
    ComityMberDialogComponent,
    ComityMberDeleteDialogComponent,
    ComityMberPopupComponent,
    ComityMberDeletePopupComponent
  ],
  entryComponents: [
    ComityMberComponent,
    ComityMberDialogComponent,
    ComityMberPopupComponent,
    ComityMberDeleteDialogComponent,
    ComityMberDeletePopupComponent
  ],
  providers: [
    ValidationService,
    CreditComityService,
    CreditRequestService,
    ClientService,
    ProduitService,
    ServiceUserService,
    TypeMembreService,
    ComityMberService,
    ComityMberPopupService,
    ComityMberResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdComityMenuModule {}
