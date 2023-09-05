import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SfdSharedModule} from '../../shared';
import {TypeCaisseService} from '../type-caisse/type-caisse.service';
import {
    CaisseService,
    CaissePopupService,
    CaisseComponent,
    CaisseDetailComponent,
    CaisseDialogComponent,
    CaissePopupComponent,
    CaisseDeletePopupComponent,
    CaisseDeleteDialogComponent,
    caisseRoute,
    caissePopupRoute,
    CaisseResolvePagingParams
} from '.';
import {CompteComptableService} from '../compte-comptable/compte-comptable.service';
import {TransfertBankCoffreDialogComponent} from './transfert-bank-coffre-dialog.component';
import {SPStdAloneService} from '../../shared/sp-stdalone.service';
import {BankAccountClientService} from '../bank-account-client/bank-account-client.service';
import {SPUtilService} from '../../shared/sp-util.service';
import {TransfertCaisseDialogComponent} from './transfert-caisse-dialog.component';

const ENTITY_STATES = [...caisseRoute, ...caissePopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CaisseComponent,
        CaisseDetailComponent,
        CaisseDialogComponent,
        CaisseDeleteDialogComponent,
        CaissePopupComponent,
        CaisseDeletePopupComponent,
        TransfertBankCoffreDialogComponent,
        TransfertCaisseDialogComponent,
    ],
    entryComponents: [
        CaisseComponent,
        CaisseDialogComponent,
        CaissePopupComponent,
        CaisseDeleteDialogComponent,
        CaisseDeletePopupComponent,
        TransfertBankCoffreDialogComponent,
        TransfertCaisseDialogComponent,
    ],
    providers: [
        TypeCaisseService,
        CaisseService,
        CaissePopupService,
        CaisseResolvePagingParams,
        CompteComptableService,
        SPStdAloneService,
        SPUtilService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCaisseModule {}
