import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProduitService } from '../produit/produit.service';
import { SfdSharedModule } from '../../shared';
import {
  TypesContratService,
  TypesContratPopupService,
  TypesContratComponent,
  TypesContratDetailComponent,
  TypesContratDialogComponent,
  TypesContratPopupComponent,
  TypesContratDeletePopupComponent,
  TypesContratDeleteDialogComponent,
  TypesContratRoute,
  TypesContratPopupRoute,
  TypesContratResolvePagingParams
} from '.';

const ENTITY_STATES = [...TypesContratRoute, ...TypesContratPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TypesContratComponent,
    TypesContratDetailComponent,
    TypesContratDialogComponent,
    TypesContratDeleteDialogComponent,
    TypesContratPopupComponent,
    TypesContratDeletePopupComponent
  ],
  entryComponents: [
    TypesContratComponent,
    TypesContratDialogComponent,
    TypesContratPopupComponent,
    TypesContratDeleteDialogComponent,
    TypesContratDeletePopupComponent
  ],
  providers: [ProduitService, TypesContratService, TypesContratPopupService, TypesContratResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTypesContratModule { }
