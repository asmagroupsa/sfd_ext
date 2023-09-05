import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
    ZoneDepartementService,
    ZoneDepartementPopupService,
    ZoneDepartementComponent,
    ZoneDepartementDetailComponent,
    ZoneDepartementDialogComponent,
    ZoneDepartementPopupComponent,
    ZoneDepartementDeletePopupComponent,
    ZoneDepartementDeleteDialogComponent,
    zoneDepartementRoute,
    zoneDepartementPopupRoute,
    ZoneDepartementResolvePagingParams,
} from '.';

const ENTITY_STATES = [
    ...zoneDepartementRoute,
    ...zoneDepartementPopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        ZoneDepartementComponent,
        ZoneDepartementDetailComponent,
        ZoneDepartementDialogComponent,
        ZoneDepartementDeleteDialogComponent,
        ZoneDepartementPopupComponent,
        ZoneDepartementDeletePopupComponent,
    ],
    entryComponents: [
        ZoneDepartementComponent,
        ZoneDepartementDialogComponent,
        ZoneDepartementPopupComponent,
        ZoneDepartementDeleteDialogComponent,
        ZoneDepartementDeletePopupComponent,
    ],
    providers: [
        ZoneDepartementService,
        ZoneDepartementPopupService,
        ZoneDepartementResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdZoneDepartementModule {}
