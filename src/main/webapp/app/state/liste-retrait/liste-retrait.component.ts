import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {SPFNMService} from '../../shared/sp-fnm.service';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {UtilService} from "../../shared/util.service";
import {UserData} from "../../shared/index";

@Component({
    selector: 'jhi-liste-retrait',
    templateUrl: './liste-retrait.component.html',
})
export class ListeRetraitComponent implements AfterViewInit, OnInit {
    date1: any;
    date2: any;
    loading = true;
    @ViewChild('iframe') private _iframe;

    constructor(
        private _spFNMService: UtilService,
        private _datePipe: DatePipe,
        private _activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit() {
        const now = new Date();
        const now30 = new Date(+now - (1000*60*60*24*30));
        this.date1 = {
            year: now30.getFullYear(),
            month: now30.getMonth() + 1,
            day: now30.getDate()
        };
        this.date2 = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
        // this.date2 = {...this.date1};
    }

    ngAfterViewInit() {
        this.getData();
    }

    getData() {
        const formatDate = (date) => this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'MM/dd/y');

        this.loading = true;
        const q = this._activatedRoute.snapshot.queryParams;

        this._spFNMService.toFileRequest('fnm/liste-retrait-to-file', {
            date1: formatDate(this.date1),
            date2: formatDate(this.date2),
            // sfd_reference: UserData.getInstance().getSFD(),
            ligne_credit_id: q.ligneCreditId,
            sfd_name: UserData.getInstance().getSFD().name,
        }, true)
        .then((data) => {
            this.loading = false;
            this._iframe.nativeElement.src = data;
        })
        .catch(() => {
            this.loading = false;
        });
    }
}
