import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SfdSharedModule} from "../../shared";
import {CommissionComponent} from "./commission.component";
import {DatePipe} from "@angular/common";
import { UtilService } from "../../shared/util.service";

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: CommissionComponent
            },
        ])
    ],
    declarations: [CommissionComponent],
    providers: [
        DatePipe,
        UtilService
    ]
})
export class SfdAppCommissionModule {}
