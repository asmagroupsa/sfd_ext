import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { SfdAdminModule } from '../../admin/admin.module';
import {
    CustomUserService,
    CustomUserPopupService,
    CustomUserComponent,
    CustomUserDetailComponent,
    CustomUserDialogComponent,
    CustomUserPopupComponent,
    CustomUserDeletePopupComponent,
    CustomUserDeleteDialogComponent,
    customUserRoute,
    customUserPopupRoute,
    CustomUserResolvePagingParams,
} from '.';

const ENTITY_STATES = [
    ...customUserRoute,
    ...customUserPopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        SfdAdminModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        CustomUserComponent,
        CustomUserDetailComponent,
        CustomUserDialogComponent,
        CustomUserDeleteDialogComponent,
        CustomUserPopupComponent,
        CustomUserDeletePopupComponent,
    ],
    entryComponents: [
        CustomUserComponent,
        CustomUserDialogComponent,
        CustomUserPopupComponent,
        CustomUserDeleteDialogComponent,
        CustomUserDeletePopupComponent,
    ],
    providers: [
        CustomUserService,
        CustomUserPopupService,
        CustomUserResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCustomUserModule {}
