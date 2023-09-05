import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { PeriodicityService } from '../periodicity/periodicity.service';
import { TypeGarantieService } from '../type-garantie/type-garantie.service';
import { FraisService } from '../frais/frais.service';
import { TranchePenalService } from '../tranche-penal/tranche-penal.service';
import { CategoriePipe, ByCategoriePipe } from './pipe';
import { TauxEpargneService } from '../taux-epargne/taux-epargne.service';
import { ConditionAccesService } from '../condition-acces/condition-acces.service';
import {
    ProduitService,
    ProduitPopupService,
    ProduitComponent,
    ProduitDetailComponent,
    ProduitDialogComponent,
    ProduitPopupComponent,
    ProduitDeletePopupComponent,
    ProduitDeleteDialogComponent,
    produitRoute,
    produitPopupRoute,
    ProduitResolvePagingParams,
    ProductRequestSheetComponent
} from '.';
import { TypeClientService } from '../type-client';
import { TypesContratService } from '../types-contrat/types-contrat.service';
import { PenalityService } from '../penality';
import {ProduitTauxCommissionComponent} from './produit-taux-commission.component';
import {ProduitTauxCommissionDialogComponent,ProduitTauxCommissionPopupComponent} from './produit-taux-commission-dialog.component';
const ENTITY_STATES = [...produitRoute, ...produitPopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ProduitComponent,
        ProduitDetailComponent,
        ProduitDialogComponent,
        ProduitDeleteDialogComponent,
        ProduitPopupComponent,
        ProduitDeletePopupComponent,
        CategoriePipe,
        ByCategoriePipe,
        ProductRequestSheetComponent,
        ProduitTauxCommissionDialogComponent,ProduitTauxCommissionPopupComponent,
        ProduitTauxCommissionComponent
    ],
    entryComponents: [
        ProduitComponent,
        ProduitDialogComponent,
        ProduitPopupComponent,
        ProduitDeleteDialogComponent,
        ProduitDeletePopupComponent,
        ProduitTauxCommissionDialogComponent,ProduitTauxCommissionPopupComponent,
        ProduitTauxCommissionComponent
    ],
    providers: [
        TypeGarantieService,
        ConditionAccesService,
        FraisService,
        TypesContratService,
        TranchePenalService,
        TauxEpargneService,
        PeriodicityService,
        ProduitService,
        ProduitPopupService,
        ProduitResolvePagingParams,
        TypeClientService,
        PenalityService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdProduitModule {}
