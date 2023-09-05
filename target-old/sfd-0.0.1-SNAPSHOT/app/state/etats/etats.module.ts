import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {EtatsComponent} from "./etats.component";
import {DatePipe} from "@angular/common";
import {SfdSharedModule} from "../../shared/shared.module";
import {UtilService} from "../../shared/util.service";

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: EtatsComponent
            },            
            {
                path: 'state',
                component: EtatsComponent
            },            
            
        ])
    ],
    declarations: [EtatsComponent],
    providers: [
        UtilService,
        DatePipe,
    ]
})
export class SfdAppEtatsModule {}
