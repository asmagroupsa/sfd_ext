import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ProduitService } from '../produit/produit.service';
import { SFDService } from '../s-fd/sfd.service';
import {
  ContratService,
  ContratPopupService,
  ContratComponent,
  ContratDetailComponent,
  ContratDialogComponent,
  ContratPopupComponent,
  ContratDeletePopupComponent,
  ContratDeleteDialogComponent,
  contratRoute,
  contratPopupRoute,
  ContratResolvePagingParams
} from '.';

const ENTITY_STATES = [...contratRoute, ...contratPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ContratComponent,
    ContratDetailComponent,
    ContratDialogComponent,
    ContratDeleteDialogComponent,
    ContratPopupComponent,
    ContratDeletePopupComponent
  ],
  entryComponents: [
    ContratComponent,
    ContratDialogComponent,
    ContratPopupComponent,
    ContratDeleteDialogComponent,
    ContratDeletePopupComponent
  ],
  providers: [
    SFDService,
    ProduitService,
    ContratService,
    ContratPopupService,
    ContratResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdContratModule {}
