import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {ProduitService} from '../produit/produit.service';
import { SfdSharedModule } from '../../shared';
import {
  AffectationService,
  AffectationPopupService,
  AffectationComponent,
  AffectationDetailComponent,
  AffectationDialogComponent,
  AffectationPopupComponent,
  AffectationDeletePopupComponent,
  AffectationDeleteDialogComponent,
  affectationRoute,
  affectationPopupRoute,
  AffectationResolvePagingParams
} from '.';
import {UniqueChargeDePret} from './pipe';

const ENTITY_STATES = [...affectationRoute, ...affectationPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    AffectationComponent,
    AffectationDetailComponent,
    AffectationDialogComponent,
    AffectationDeleteDialogComponent,
    AffectationPopupComponent,
    AffectationDeletePopupComponent,
    UniqueChargeDePret
  ],
  entryComponents: [
    AffectationComponent,
    AffectationDialogComponent,
    AffectationPopupComponent,
    AffectationDeleteDialogComponent,
    AffectationDeletePopupComponent
  ],
  providers: [ProduitService,AffectationService, AffectationPopupService, AffectationResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdAffectationModule {}
