import 'rxjs/add/operator/map';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../shared/util.service';
import { UserData } from '../shared';

declare const select_init: any;
declare let pdfMake: any;

@Component({
    selector: 'jhi-rapatriement-ligne-credit',
    templateUrl: './sfd-rapatriement.component.html'
})
export class SfdRapatriementComponent {
    loading = false;
    @ViewChild('iframe') private _iframe;
    date1: any;
    date2: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private _datePipe: DatePipe,
        private _utilService: UtilService,
        private _activatedRoute: ActivatedRoute,
    ) {
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
            'me/lignes-retranches-to-file',
            {
                sfd_reference: UserData.getInstance().getSFD().code,
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
