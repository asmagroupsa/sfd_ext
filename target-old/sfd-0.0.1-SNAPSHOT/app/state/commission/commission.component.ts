import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import { UtilService } from '../../shared/util.service';

@Component({
    selector: 'jhi-commission',
    templateUrl: './commission.component.html',
})
export class CommissionComponent implements AfterViewInit, OnInit {
    date1: any;
    date2: any;
    loading = false;
    @ViewChild('iframe') private _iframe;
    queryParams: any = {};
    carmes;

    constructor(
        private _datePipe: DatePipe,
        private _activatedRoute: ActivatedRoute,
        private _fileService: UtilService
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
        this.queryParams = this._activatedRoute.snapshot.queryParams;
    }

    ngAfterViewInit() {
        if (this.queryParams.carmes) {
            this.getData();
        }
    }

    getData() {
        this.carmes = this.carmes || this.queryParams.carmes;

        if (!this.carmes) {
            return;
        }

        const formatDate = (date) => this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'MM/dd/y');

        this.loading = true;

        this._fileService.toFileRequest('report/commissions-acteur-to-file',{
            date1: formatDate(this.date1),
            date2: formatDate(this.date2),
            compte_carmes: this.carmes,
            qrcode: JSON.stringify({type: 'FNM'}),
        })
        .then((data) => {
            this.loading = false;
            this._iframe.nativeElement.src = data;
        })
        .catch(() => {
            this.loading = false;
        });
    }
}
