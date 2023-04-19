import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from "../../shared/util.service";
import {UserData} from "../../shared/index";
import { PlatformLocation } from '@angular/common';

@Component({
    selector: 'jhi-liste-agent-pdf',
    templateUrl: './liste-agent-pdf.component.html',
})
export class ListeAgentPDFComponent implements AfterViewInit {
    loading = false;
    @ViewChild('iframe') private _iframe;

    constructor(
        private _utilService: UtilService,
        private _activatedRoute: ActivatedRoute,
        private location: PlatformLocation,
        private _router: Router,
    ) {
        this.location.onPopState(()=>{
            this._router.navigate(['/entity', 'client', 'liste-agent']);
        });
    }

    ngAfterViewInit() {
        this.loading = true;
        console.log(this._activatedRoute.snapshot.queryParams);
        
        this._utilService.toFileRequest(
            'fnm/liste-agents-to-file',
            {
                sfd_reference: UserData.getInstance().getSFD().code,
                ...this._activatedRoute.snapshot.queryParams,
            }, true
        )
        .then((data) => {
            this.loading = false;
            this._iframe.nativeElement.src = data;
        })
        .catch((e) => {
            console.error(e);
            this.loading = false;
        })
    }
}
