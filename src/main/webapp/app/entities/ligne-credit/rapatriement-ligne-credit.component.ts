import 'rxjs/add/operator/map';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { READFILEURL,  ResponseWrapper, UserData, createRequestOption, Principal } from '../../shared';
import { UtilService } from '../../shared/util.service';

declare const select_init: any;
declare let pdfMake: any;

@Component({
    selector: 'jhi-rapatriement-ligne-credit',
    templateUrl: './rapatriement-ligne-credit.component.html'
})
export class RapatriementLigneCreditComponent {
    loading = false;
    @ViewChild('iframe') private _iframe;
    params: any;
    date1: any;
    date2: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private _datePipe: DatePipe,
        private _decimalPipe: DecimalPipe,
        private _principal: Principal,
        private _utilService: UtilService,
        private _activatedRoute: ActivatedRoute,
    ) {
        this.params = +this._activatedRoute.snapshot.params.id;
        let now = new Date();
        this.date1 = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
        this.date2 = Object.assign({}, this.date1);
    }

    ngOnInit() {
        this.getData();
        // console.log(this.params);
    }
    ngAfterViewInit() {
        // this.getData();
    }

    onPeriodChange() {
        //console.log(this.date1, this.date2);
        this.getData();
    }

    getData() {
        const formatDate = (date)=>{
            if(!date) return null;
            return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'dd-MM-y');
        }
        this.loading = true;
        this._utilService.toFileRequest(
            'me/credits-retranches-to-file',
            {
                id_ligne_credit: this.params,
                date1: formatDate(this.date1),
                date2: formatDate(this.date2),
            }
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
