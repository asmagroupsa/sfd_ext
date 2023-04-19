import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserData,ResponseWrapper } from '../../shared';
import { READFILEURL } from '../../shared/model/request-util';
import { StateService } from '../../shared/state/statistiques';
import { DatePipe } from '@angular/common';
import {CompensationService} from './compensation.service';
import { UtilService } from '../../shared/util.service';
declare let qrGenerator: any;

@Component({
    selector: 'jhi-compensation-ordre-sheet',
    templateUrl: './compensation-ordre-sheet.component.html'
})
export class CompensationOrdreSheetComponent implements OnInit, OnDestroy {
    routeSub: any;
    infoName: any;
    typeCompensation: any;
    infoAdd: any;
    _ficheLoadEnd: any;
    fiche:any;
    private increment: number = 0;
    date1: any;
    date2: any;
    @ViewChild('printZone') printZone: ElementRef;
    @ViewChild('qrimage') qrimage: ElementRef;
    private _DePage: any;
    private imageUrl = READFILEURL;

    constructor(private route: ActivatedRoute,
        /* private _changeDetectorRef: ChangeDetectorRef,
        private _stateService: StateService,
       private compensationService: CompensationService, */
       private _spFNMService: UtilService,
    private _datePipe: DatePipe
    ) {

        this._ficheLoadEnd = false;
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this._DePage = UserData.getInstance().sfd_;
            //this._ficheLoadEnd = true;
            this.getOrdrePDF();
        })
    }
getOrdrePDF() {
      const formatDate = (date)=>{
          if(!date) return null;
          return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'dd-MM-y');
      }


        this._spFNMService.toFileRequest( 'report/ordre-virements-to-file',{
            date1:formatDate(this.date1),
            date2:formatDate(this.date2),
            acteur_reference: UserData.getInstance().currentSfdReference
        }).then((data) => {
            this._ficheLoadEnd = true;
            this.printZone.nativeElement.src = data;
        })
        .catch(() => {
            this._ficheLoadEnd = true;
        });
        
        
        
        /* .subscribe(
            (res: any) => {
                this.fiche = res._body;
                this._ficheLoadEnd = true;
                var reader = new FileReader();
                reader.addEventListener('load', () => {
                    this.printZone.nativeElement.src = reader.result;
                });
                reader.readAsDataURL(this.fiche);
            },
            (res: ResponseWrapper) => {
                //this.onError(res.json);
            }
        ); */
    }
   onPeriodChange() {
        //console.log(this.date1, this.date2);
        this.getOrdrePDF();
    }
    get hideLoader(): boolean {
        return this._ficheLoadEnd;
    }
    ngOnDestroy() {
        UserData.getInstance().compensationData[0] = "";
        this.routeSub.unsubscribe();
    }
}
