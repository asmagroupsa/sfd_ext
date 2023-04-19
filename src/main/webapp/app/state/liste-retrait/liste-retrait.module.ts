import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SPFNMService} from "../../shared/sp-fnm.service";
import {ListeRetraitComponent} from "./liste-retrait.component";
import {DatePipe} from "@angular/common";
import {SfdSharedModule} from "../../shared/shared.module";
import {UtilService} from "../../shared/util.service";

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild([
            {
                path: '',
                component: ListeRetraitComponent
            },
        ])
    ],
    declarations: [ListeRetraitComponent],
    providers: [
        UtilService,
        DatePipe,
    ]
})
export class SfdAppListeRetraitModule {}
