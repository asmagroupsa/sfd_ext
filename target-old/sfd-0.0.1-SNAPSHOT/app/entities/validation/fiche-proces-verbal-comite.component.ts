import { Component, OnInit, OnDestroy, ViewChildren, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditComityService } from '../credit-comity';
import { LanguesService } from "../../shared/myTranslation/langues";
import { StateService } from "../../shared/state/statistiques"
import { ImageService, UserData, EventBus } from '../../shared'
declare let toWords: any;

import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from "ng-jhipster";
import { idCardType } from '../entity.module';
declare let select_init: any;



@Component({
    selector: 'jhi-fiche-pv-comity',
    templateUrl: './fiche-proces-verbal-comite.component.html',
    styleUrls: ['../../shared/state/state.scss']
})
export class FichePvComponent implements OnInit {
    routeSub: any;
    private _currentCreditComityDossiers: any[];
    private _currentCreditComityFicheDossiers: any[];
    private resp : any;
    private increment: number = 0;
    private imageReady: boolean;
    private _ficheLoadEnd: boolean;
    @ViewChild('printZone') printZone: ElementRef;
    private _DePage: any;
    private credit_commiy: any;
    _comitiesLoadEnd: boolean;
    montant_accorder: any;
    montant_en_lettre: any;
    nb_dossiers: number;
    synthese: any[];
    syntheseLoadEnd:boolean;

    constructor(
        private route: ActivatedRoute,
        public langue: LanguesService,
        private creditcomityService: CreditComityService,
        public _stateService: StateService,
        // private _imageService: ImageService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this._currentCreditComityFicheDossiers = [];
        this._ficheLoadEnd = false;
        this._comitiesLoadEnd = false;
        this.credit_commiy = [];
        this.synthese = [];
        this.syntheseLoadEnd = false;
    }


    
        get hideLoader(): boolean {
            let tmp = this._ficheLoadEnd && this._comitiesLoadEnd && this.syntheseLoadEnd;
            if (tmp) {
                if (this.increment === 0) {
                    this.increment = this.increment + 1
                    this._changeDetectorRef.detectChanges()
    
                    let printArea = this.printZone.nativeElement.innerHTML;
                    let printCanvas = this.printZone.nativeElement.querySelectorAll('canvas');
    
                    if (printCanvas) {
                        this._stateService.printAsPdf2(printArea, printCanvas, 'landscape');
                    } else {
                        this._stateService.printAsPdf2(printArea, 'landscape');
                    }
                }
            }
            return tmp;
        }
    

    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe((params: any[]) => {
            let commity_id: number = parseInt(params['id']);
            this.showCreditComities(commity_id)
            this.showFicheDossiers(commity_id);
            this.showSynthese(commity_id);
        });
    }

    showCreditComities(commity_id) {
        this.creditcomityService
            .find(commity_id)
            .subscribe(res=>{
                this._DePage = UserData.getInstance().sfd_;
                this.resp = res
                let members = this.resp.delegationComity.delegatedMembers;

                let tmp_array = ['PRESIDENT', 'VICE_PRESIDENT', 'SECRETAIRE', 'AUTRES'];

                for (let i = 0; i < tmp_array.length; i++) {
                    for (let j = 0; j < members.length; j++) {
                        if (members[j].roleDelegatedMember.code == tmp_array[i]) {
                            this.credit_commiy.push(members[j])
                        }
                    }
                }
                console.log(this.credit_commiy);
                this._comitiesLoadEnd = true;
            })
    }
    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    showSynthese(id) {
        this.creditcomityService.showSynthese(id)
            .subscribe((res) => {
                this.synthese = res;
                console.log(res);
                if (this.synthese[0].montant_total_comity != null){
                    this.montant_en_lettre = toWords(this.synthese[0].montant_total_comity);
                }
                this.syntheseLoadEnd=true;
            })
    }

    public showFicheDossiers(creditComityDossierId: number): void {
        this.creditcomityService.showDossierComityPV(creditComityDossierId)
            .subscribe((data) => {
                
                if (data[0].reference != null){
                    this.nb_dossiers = data.length;
                    let tmp_arr = [];
                    
                    data.forEach((element,i) => {
                        tmp_arr.push(element)
                        
                        /* if (i==(data.length-1) && data.length + (i - 1) < 8) {
                            this._currentCreditComityFicheDossiers.push(tmp_arr);                           
                        } */


                        if ((((data.length - 1) - i) <= 8) && ((data.length - 1) == i)) {
                            this._currentCreditComityFicheDossiers.push(tmp_arr);
                            console.log(tmp_arr);
                            
                        }else
                        
                        if (tmp_arr.length == 8) {
                            this._currentCreditComityFicheDossiers.push(tmp_arr)                            
                            tmp_arr = [];
                        } 
                    });
                    
                }
                console.log(this._currentCreditComityFicheDossiers);
                
                this._ficheLoadEnd = true;
            });
    }

    public printAsPdf(print) {
        window.frames["print_frame"].print();
    }


}
