import {DatePipe, DecimalPipe, CurrencyPipe} from '@angular/common';
import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Http} from '@angular/http';
import {ActivatedRoute} from '@angular/router';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';
import {Subscription} from 'rxjs';

import {Principal, ResponseWrapper, UserData, numberWithSpaces} from '../../shared';
import {createRequestOption, READFILEURL, READBITFILEURL} from '../../shared/model/request-util';
import {StateService} from '../../shared/state/statistiques';
import {ClientService} from '../client';
import {CreditService} from '../credit';
import {PeriodicityService} from '../periodicity/periodicity.service';
import {CreditMenu} from './credit-menu.model';
import {CreditMenuService} from './credit-menu.service';
import { credit } from '../entity.module';
import { LigneCreditService, LigneCredit } from '../ligne-credit';


declare let select_init: any;
declare let pdfMake: any;

@Component({
    selector: 'jhi-credit-menu',
    templateUrl: './credit-menu.component.html',
    styleUrls: ['../../shared/state/state.css'],

})
export class CreditMenuComponent implements OnInit, OnDestroy {
    periodicities: any;
    results: any[] = [];
    simulation: any = {
        periodicity: '',
        mode: '',
        montant: '',
        interet: '',
        epargne: '',
        differe: '',
        duree: '',
        ferie: false,
        grace: '',
        cumul: false
    };
    echeances: any[];
    fiche: any;
    debloquer: string;
    unities: CreditMenu[];
    deblocages: any[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    tab: string;
    modes: any[] = [
        {id: 'LINEAIRE', title: 'Linéaire'},
        {id: 'NOMINAL_CONSTANT', title: 'Nominal Constant'},
        {id: 'DEGRESSIF', title: 'Dégressif'},
        {id: 'NOMINAL_LIBRE', title: 'Nominal libre'}
    ];
    isSaving: boolean = false;
    isFicheLigne: boolean = false;
    groups: any[] = [];
    members: any[] = [];
    ficheCreditMember: any;
    echeancesCreditMember: any[] = [];
    credit_id: number = 0;
    private imageUrl = READFILEURL;
    private sfdName: any;
    private _ficheLoadEnd: boolean;
    private _ficheClientLoadEnd: boolean;
    private ficheLoadecheancesCreditMemberEnd: boolean;
    private ficheLoadCreditMemberEnd: boolean;
    private increment: number = 0;
    private _DePage: any;
    @ViewChild('printZone') printZone: ElementRef;
    @ViewChild('planFrame') planFrame: ElementRef;
    simulationAontant: string;
    @ViewChild('printZone2') printZone2: ElementRef;
    // modeEcheance: string;
    fichePrintLoader: boolean;
    header: string;
    ficheReference: string;
    modeCalcul: any;
    ligneCredits: LigneCredit[];

    constructor(
        private ligneCreditService: LigneCreditService,
        private unityService: CreditMenuService,
        private periodicityService: PeriodicityService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        public principal: Principal,
        private statistique: StateService,
        private clientService: ClientService,
        private http: Http,
        private creditMenuService: CreditMenuService,
        private creditService: CreditService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _datePipe: DatePipe,
        private numberPipe: DecimalPipe,
        private _currencyPipe: CurrencyPipe,
    ) {
        this._ficheLoadEnd = false;
        this.fichePrintLoader = false;
        this._DePage = '';
        this.echeances = [];
        this.echeancesCreditMember = [];
        this._ficheClientLoadEnd = false;
        this.ficheLoadecheancesCreditMemberEnd = false;
        this.ficheLoadCreditMemberEnd = false;
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
        /*  this.activatedRoute.params.subscribe(params => {
             this.tab = params['id'];
             this._selectInit();
             this.hideLoader();
         }); */
    }

    ngAfterViewInit() {
        this._selectInit();
    }

    getDeblocages() {
        this.creditService.queryCredits(true).subscribe((res) => {
            this.deblocages = res.json;
            this._selectInit();
        });
        // this.unityService.getDebloquer().subscribe((res: ResponseWrapper) => {
        //   this.deblocages = res.json;
        // });
    }
    loadAll() {
        if (this.currentSearch) {
            return;
        }
        this.periodicityService
            .query({size: 1000})
            .subscribe(
                (res: ResponseWrapper) => (this.periodicities = res.json),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    loadLigne() {
        const req: any = {
            sort: "id,desc",
        };
        
        req['sfdReference.equals'] = UserData.getInstance().getSFDReference();

        this.ligneCreditService
        .query(req)
        .subscribe(
            (res: ResponseWrapper) => {
                this.ligneCredits = res.json;
                select_init();
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe(params => {
            this.tab = params['id'];
            this._selectInit();
            this.ficheCreditMember = [];
            this.fiche = [];
            this.debloquer = '';
            this.echeances = [];
            this.echeancesCreditMember = [];
            //this.hideLoader();
            /*  if (this.debloquer || this.members){
                 this.hideLoader();
             } */
             
            this._DePage = UserData.getInstance().sfd_;
            if(this.tab === "fiche-ligne"){
                this.loadLigne();
                this.isFicheLigne = true;                
                const as = this.activatedRoute.snapshot;
                const ligneCreditId = as.params.id === 'fiche-ligne' ? as.queryParams.ligneCreditId : undefined;
                this.ficheReference = as.queryParams.ligneCreditReference;

                if (ligneCreditId) {
                    this.debloquer = ligneCreditId;
                    this.onCreditChange();
                }
            }
        });

        /* 
        const as = this.activatedRoute.snapshot;
        const ligneCreditId = as.params.id === 'fiche-client' ? as.queryParams.ligneCreditId : undefined;
        this.ficheReference = as.queryParams.ligneCreditReference; */

        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInUnities();
        if(!this.isFicheLigne){
            this.getDeblocages();
            this.loadClientsGroup(); 
        }
        
        this.sfdName = UserData.getInstance().sfdName;
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CreditMenu) {
        return item.id;
    }
    registerChangeInUnities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'unityListModification',
            response => this.loadAll()
        );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    onCreditChange() {
        // const credit = this.deblocages.find((c) => c.credit_id === this.deblocages);

        // if (credit) {
        //     this.modeEcheance = credit.mode_echeance;
        // }

        /* this.unityService
            .ficheClient(this.debloquer) */
        (this.isFicheLigne ? this.unityService.ficheLigne(this.debloquer) 
                            :  this.unityService.ficheClient(this.debloquer))
            .subscribe((res: ResponseWrapper) => {
                this.fiche = res.json.length ? res.json[0] : [];
                this._ficheClientLoadEnd = true;

                (this.isFicheLigne ? this.unityService.ficheEcheancesLigne(this.debloquer) 
                                   :  this.unityService.ficheEcheances(this.debloquer))
                    .subscribe((res: ResponseWrapper) => {
                        let arr = res.json;
                        let echeancesArr = [];
                        this.echeances = [];
                        if (arr) {
                            let tmp_arr = [];
                            arr.forEach((element, i) => {
                                tmp_arr.push(element)
                                if ((((arr.length - 1) - i) <= 10) && ((arr.length - 1) == i)) {
                                    echeancesArr.push(tmp_arr);
                                } else if (tmp_arr.length == 10) {
                                    echeancesArr.push(tmp_arr)
                                    tmp_arr = [];
                                }
                            });
                            this.echeances = echeancesArr;
                             console.log(this.echeances);
                        }
                        this._ficheLoadEnd = true;
                        this.buildPlan();
                        /* window.frames["print_frame"].document.querySelector('html body').innerHTML = "";
                        if (this._ficheClientLoadEnd && this._ficheLoadEnd) {
                            this.hideLoader();
                        } */
                    });
            });

    }

    get hideFrame() {
        return (this._ficheClientLoadEnd || this.ficheLoadecheancesCreditMemberEnd) && this._ficheLoadEnd;
    }
    trackEcheance(index, echeance, echeances) {
        for (index = 0; index < echeances.length; index++) {

            if (index % 12 === 0) {
                // return true;
            }
        }
        // return hero ? hero.id : undefined;
    }

    save() {
        this.statistique.save('.fiche-print', 'fiche-client');
    }

    simuler() {
        this.simulation.grace = this.simulation.grace ? this.simulation.grace : 0;
        this.simulation.differe = this.simulation.differe
            ? this.simulation.differe
            : 0;
        this.simulation.cumul = this.simulation.differe
            ? this.simulation.cumul
            : false;
        this.isSaving = true;
        this.unityService.planAmortis(this.simulation).subscribe(
            (res: ResponseWrapper) => {
                this.alertService.success('success');
                this.results = res.json;
                this.isSaving = false;
            },
            res => {
                this.alertService.error('error');
                this.results = [];
                this.isSaving = false;
            }
        );
    }
    public printAsPdf(print) {
        window.frames["print_frame"].print();
    }

    loadClientsGroup() {
        this.clientService.listeClientCredit('MUTUEL', true).subscribe((res) => {
            this.groups = res.json;
            this._selectInit();
        });
    }

    onGroupChange(groupId: any) {
        this.getCreditId(this.groups, parseInt(groupId));
        this.clientService.find(parseInt(groupId, 10)).subscribe((group) => {
            this.members = [];
            this.members = group.groups;
            this._selectInit();
        });
    }

    getCreditId(creditClient: any[], clientId:number){       
        creditClient.forEach((credit, index) => {           
            if(credit.id ===  clientId){
                this.credit_id = parseInt(credit.credit_id);
                //console.log(credit.id + " match " + clientId + "cre"+  this.credit_id);
            }
        });        
    }

    modeCalculs(mode) {

        switch (mode) {
            case 'LINEAIRE': this.modeCalcul = 'LINEAIRE'; break;
            case 'NOMINAL_CONSTANT': this.modeCalcul = 'NOMINAL CONSTANT'; break;
            case 'DEGRESSIF': this.modeCalcul = 'DEGRESSIF'; break;
            case 'NOMINAL_LIBRE': this.modeCalcul = 'NOMINAL-LIBRE'; break;
            case 'ECHEANCIER_LIBRE': this.modeCalcul = 'ECHEANCIER LIBRE'; break;

            default: this.modeCalcul = '';
                break;
        }
    }

    onMemberChange(memberId: string) {
        this.ficheLoadecheancesCreditMemberEnd = false
        /*  this.ficheLoadCreditMemberEnd =false; */
        this.creditMenuService.ficheCreditMember(parseInt(memberId, 10), this.credit_id).subscribe((res) => {
            this.ficheCreditMember = res.json[0];
            this.ficheLoadCreditMemberEnd = true;

            this.creditMenuService.echeanceCreditMember(parseInt(memberId, 10), this.credit_id).subscribe((res) => {
                let arr = res.json;
                this.echeancesCreditMember = [];
                if (arr) {
                    let tmp_arr = [];
                    let echeancesArr = [];
                    arr.forEach((element, i) => {
                        tmp_arr.push(element)
                        if ((((arr.length - 1) - i) <= 10) && ((arr.length - 1) == i)) {
                            // echeancesArr.push(tmp_arr);
                            echeancesArr.push(arr);
                        } else if (tmp_arr.length == 10) {
                            // echeancesArr.push(tmp_arr)
                            echeancesArr.push(arr)
                            tmp_arr = [];
                        }
                    });
                    this.echeancesCreditMember = echeancesArr;
                    this.echeances = this.echeancesCreditMember;

                    this.ficheLoadecheancesCreditMemberEnd = true;
                    this._ficheLoadEnd = true;
                    this.buildPlan();
                }
            });
        });
    }


    public hideLoader() {
        this.fichePrintLoader = false;
        this._changeDetectorRef.detectChanges();
        if (this.tab == 'fiche-credit-member') {
            window.frames["print_frame"].document.querySelector('html body').innerHTML = "";
            let printArea = this.printZone2.nativeElement.innerHTML;
            let printCanvas = this.printZone2.nativeElement.querySelectorAll('canvas');

            if (printCanvas) {
                this.statistique.printAsPdf2(printArea, printCanvas, 'landscape');
                this.fichePrintLoader = true;
            } else {
                this.statistique.printAsPdf2(printArea, 'landscape');
                this.fichePrintLoader = true;
            }
        } else if (this.tab == 'fiche-client' || this.tab == 'fiche-ligne') {
            window.frames["print_frame"].document.querySelector('html body').innerHTML = "";
            let printArea = this.printZone.nativeElement.innerHTML;
            let printCanvas = this.printZone.nativeElement.querySelectorAll('canvas');

            if (printCanvas) {
                this.statistique.printAsPdf2(printArea, printCanvas, 'landscape');
                this.fichePrintLoader = true;
            } else {
                this.statistique.printAsPdf2(printArea, 'landscape');
                this.fichePrintLoader = true;
            }
        }
    }

    private _selectInit() {
        select_init((query, id) => {

        });
    }
    onLoadedPhoto(url: string) {
        let options = createRequestOption();
        options.headers.set('accept', 'image/*');
        return this.http
            .get(`${READBITFILEURL}${url}`, options)
            .map((response: any) => {
                return 'data:image/png;base64,' + response._body;
            }).toPromise();
    }
    async buildPlan() {
        let data = this._buildBody();
        if (UserData.getInstance().sfd_ && UserData.getInstance().sfd_.entete) {
            try {
                this.header = await this.onLoadedPhoto(UserData.getInstance().sfd_.entete);
            } catch (error) {
                console.log("erreur de chargement des images");
            }
        }
        let clientName = this.fiche.nomprenom || '';
        let widths = ['*', '*', '*', '*', '*'];
        let table;
        table = {
            style: 'noOperation',
            text: "Pas d'écheances"
        };
        if (this.echeances && this.echeances.length) {
            // widths = ['3%', '10%', '16%', '13%', '16%', '14%', '15%', '13%'];
            //widths = ['1', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '1'];
            widths = ['3%', '7%', '15%', '8%', '10%', '15%', '15%', '15%', '6%', '6%'];
            table = {
                style: 'tableStyle',
                table: {
                    headerRows: 1,
                    // widths: widths,
                    body: [
                        [
                            {
                                text: "N°",
                                style: "tableHeader",
                                alignment: 'center',
                                colSpan: 2,
                            },
                            {},
                            {
                                text: "Date",
                                style: "tableHeader",
                                alignment: 'center'
                            },
                            {
                                text: "Capital",
                                style: "tableHeader",
                                alignment: 'center'
                            },
                            {
                                text: "Interêt",
                                style: "tableHeader",
                                alignment: 'center'
                            },
                            {
                                text: "Frais fixe",
                                style: "tableHeader",
                                alignment: 'center'
                            },
                            {
                                text: "Mensualité",
                                style: "tableHeader",
                                alignment: 'center'
                            },
                            {
                                text: "Capital restant",
                                style: "tableHeader",
                                alignment: 'center'
                            },
                            {
                                text: "Capital payé",
                                style: "tableHeader",
                                alignment: 'center'
                            },
                            {
                                text: "Interêt payé",
                                style: "tableHeader",
                                alignment: 'center'
                            },
                            /* {
                                text: "Frais fixe",
                                style: "tableHeader",
                                alignment: 'center'
                            }, */
                            {
                                text: "Frais fixe payé",
                                style: "tableHeader",
                                alignment: 'center',
                                colSpan: 2,
                            },
                            {},
                        ],
                        ...data
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return 0;
                    },
                    vLineWidth: function (i, node) {
                        //if (i == 0) return 1;
                        return i == 0 || i == node.table.widths.length ? 0 : 1;
                    },
                    vLineColor: (i, node) => '#fff',
                    fillColor: function (i, node) {
                        if (i == 0) return 'blue';
                        return (i % 2 === 0) ? '#afced7' : null;
                    }
                }
            };
        }
        let content: any = [
            "\n",
            {
                table: {
                    widths: ['*'],
                    body: [
                        [{
                            text: this.tab == 'fiche-credit-member' ? "ECHEANCIER DU MEMBRE" : "ECHEANCIER",
                            alignment: 'center',
                            fontSize: 15,
                            bold: true,
                            margin: [0, 3, 0, 3]
                        }]
                    ]
                }
            },
            {
                //style: 'firstHeader',
                margin: [0, 10, 0, 18],
                table: {
                    widths: ['13%', '*', '15%', '*'],
                    body: this.ficheBody()
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return i == 0 ? 0.1 : 0.1;
                    },
                    vLineWidth: function (i, node) {
                        return i == 1 || i == 3 ? 0 : 0.1;
                        //return i == 0 || i == node.table.widths.length ? 0 : 1;
                    },
                    // vLineColor: (i, node) => '#fff',
                    fillColor: function (i, node) {
                        return null;
                        //return (i % 2 === 0) ? '#afced7' : null;
                    }
                }
            },
            table
        ];
        if (this.header) {
            content.unshift({
                width: 495,
                image: this.header,
                height: 120,
                style: 'image'
            });
        }
        let dd = {
            watermark: {text: this.tab == 'fiche-credit-member' ? "ECHEANCIER DU MEMBRE" : "ECHEANCIER", color: 'blue', opacity: 0.05, bold: true, italics: true},
            /* footer: function (currentPage, pageCount) {
                return {
                    margin: [100, -50, 20, 180],
                    columns: [
                        {
                            text: 'Signature du client',
                            alignment: 'left'
                        },

                        {
                            text: 'Signature du SFD',
                            alignment: 'center'
                        }
                    ]
                }
                
            }, */
            footer : {
                margin: [100, -15, 20, 180],
                columns : this._buildFooter()
            },
            content: content,
            styles: {
                bodyDate: {
                    fontSize: 8,
                    alignment: 'center'
                },
                body: {
                    fontSize: 7.5,
                    alignment: 'right',
                    margin: [0, 0, 0, 1],
                },
                image: {
                    margin: [0, 0, 45, 2]
                },
                bankImg: {
                    fontSize: 18,
                    bold: true,
                    width: 4,
                    height: 4
                },
                bankName: {
                    fontSize: 15,
                    bold: true,
                    alignment: 'left',
                    margin: [0, 0, 3, 0]
                },
                bankAdress: {
                    fontSize: 12,
                    alignment: 'left',
                    margin: [0, 0, 4, 0]
                },
                noOperation: {
                    alignment: 'center',
                    color: "gray",
                    fontSize: 14,
                    italics: true
                },
                firstHeader: {
                    margin: [0, 15, 40, 50]
                },
                checking: {
                    alignment: 'right'
                },
                countInfoDetails: {
                    fontSize: 8,
                    alignment: 'right'
                },
                countInfoTitle: {
                    //background: "blue",
                    margin: [0, 0, 4, 6],
                    //color: "white",
                    bold: true,
                    alignment: 'right'
                },
                tableStyle: {
                    margin: [0, 0, 0, 0],
                    fontSize: 11,
                    alignment: 'justify'
                },
                tableHeader: {
                    background: "blue",
                    color: "white",
                    bold: true,
                    border: [true, true, true, true],
                    fontSize: 9,
                },
                tableHeaderCredit: {
                    background: "blue",
                    color: "white",
                    bold: true,
                    margin: [3, 0, 3, 0],
                    border: [true, true, true, true]
                },
                tableHeaderDebit: {
                    background: "blue",
                    color: "white",
                    bold: true,
                    margin: [3, 0, 3, 0],
                    border: [true, true, true, true]
                },
                tabBodyEven: {
                    margin: [1, 2, 1, 2],
                },
                tabBodyOdd: {
                    margin: [1, 2, 1, 2],
                },
                total: {
                    bold: true,
                },
                debit: {
                    bold: true,
                    italics: true
                },
                credit: {
                    bold: true,
                    italics: true
                },
                client: {
                    alignment: 'left',
                    fontSize: 9,
                    bold: true,
                    margin: [0, 4, 0, 0]
                },
                clientEnd: {
                    alignment: 'left',
                    margin: [0, 4, 0, 8]
                },
                clientCode: {
                    alignment: 'left',
                    margin: [0, 4, 0, 0],
                    fontSize: 9
                }
            }
        };
        let pdf = pdfMake.createPdf(dd);
        //pdf.download(`releve-${name}.pdf`);
        pdf.getDataUrl((data) => {
            if (data) {
                this.planFrame.nativeElement.src = data;
            }
        });

    }

    _buildFooter(): any[]{

        return (this.isFicheLigne) ?
            [
                {
                    text: 'Signature du DG',
                    alignment: 'center'
                },

                {
                    text: 'Signature du SFD',
                    alignment: 'center'
                }
            ] :
              [
                {
                    text: 'Signature du client',
                    alignment: 'left'
                },

                {
                    text: 'Signature du SFD',
                    alignment: 'center'
                }
            ];
    }
    _buildLine(title, value): any[] {
        let t = (title != "") ? title + ': ' : '';
        return [
            {
                width: '15%',
                text: t,
                style: 'client'
            },
            {
                width: '*',
                text: value,
                style: 'clientCode'
            }
        ];
    }
    
    clientNameTitle(): string{
        let n = "";
        if(this.isFicheLigne){
            n = "Nom du SFD";
        }else if( this.tab == 'fiche-credit-member'){            
            n = "Nom prenoms";
        }else{
            n = "Nom du client";
        }
        return n;
    }
    
    clientName(): string{
        let n = "";
        if(this.isFicheLigne){
            n = `${this.fiche.nomprenom} (${this.fiche.reference})`;
        }else if( this.tab == 'fiche-credit-member'){            
            n = this.ficheCreditMember.nomprenom;
        }else{
            n = `${this.fiche.nomprenom} (${this.fiche.code_client})`;
        }
        return n;
    }

    c2Title(): string{
        let n = "";
        if(this.isFicheLigne){
            n = "Référence";
        }else if( this.tab == 'fiche-credit-member'){            
            n = "Nature credit";
        }else{
            n = "Nom du SFD";
        }
        return n;
    }

    c2Txt(): string{
        let n = "";
        if(this.isFicheLigne){
            n = this.fiche.reference;
        }else if( this.tab == 'fiche-credit-member'){            
            n = `${this.ficheCreditMember.nature_credit || ''}`;
        }else{
            n = this.sfdName;
        }
        return n;
    }
    c9Title(): string{
        let n = "";
        /* if(this.isFicheLigne){
            n = "Taux CARMES";
        }else */
        if( this.tab == 'fiche-credit-member'){            
            n = "Nombre d'échéance";
        }else{
            n = "";
        }
        return n;
    }

    c9Txt(): string{
        let n = "";
        /* if(this.isFicheLigne){
            n = `${this.fiche.taux_carmes || 0}%`;
        }else  */
        if( this.tab == 'fiche-credit-member'){            
            n = `${this.ficheCreditMember.nombre_echeance || 0}`;
        }else{
           // n = `${this.fiche.tauxepargne || 0}%`;
            //n = this._currencyPipe.transform((3000000000) || 0, 'XAF', true, '2.0');(3000000000).toLocaleString();
            n = "";
           // console.log(n);
        }
        return n;
    }

    ficheBody(): any {
        const duree = (this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).duree;
        let lines = [
            [
                ...this._buildLine(this.clientNameTitle(), this.clientName()),
                ...this._buildLine(this.c2Title(), this.c2Txt()),
            ],
            [
                ...this._buildLine(this.tab == 'fiche-credit-member' ? "Type credit" : "Nature de crédit", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.type_credit || ''}` : `${this.fiche.nature_credit || ''}`),
                ...this._buildLine(this.tab == 'fiche-credit-member' ? "Num. compte" : "Durée", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.numcompte || ''}` : `${this.fiche.duree || ''}`),
            ],
            [
                ...this._buildLine(this.tab == 'fiche-credit-member' ? "Montant" : "Type du crédit", this.tab == 'fiche-credit-member' ? `${numberWithSpaces(this.ficheCreditMember.montant)}` : `${this.fiche.type_credit || ''}`), 
                ...this._buildLine(this.tab == 'fiche-credit-member' ? "Echéances" : "Montant accordé", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.echeance || '0'}` : `${numberWithSpaces(this.fiche.montant)}`)
            ],
            [
                ...this._buildLine(this.tab == 'fiche-credit-member' ? 'Durée' : "Numéro de compte", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.duree || ''}` : `${this.fiche.numcompte || ''}`), 
                ...this._buildLine("Délai de grâce", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.delai_grace || '0'}` : `${this.fiche.delai_grace || '0'}`)
            ],
            [
                ...this._buildLine(this.c9Title(), this.c9Txt()), 
                ...this._buildLine("Différé", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.differe || '0'}` : `${this.fiche.differe || '0'}`)
            ],
            /* [
                ...this._buildLine(this.tab == 'fiche-credit-member' ? 'Nombre echéance' : "Chargé de crédit", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.nombre_echeance || 0}` : `${this.fiche.charge || '--'}`), ...this._buildLine("Différé", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.differe || '0'}` : `${this.fiche.differe || '0'}`)
            ], */
            [
                ...this._buildLine("Date d’ouverture", `${this._datePipe.transform((this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).date_ouverture, 'mediumDate')}`),
                ...this._buildLine("Date d’effet", `${this._datePipe.transform((this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).dateeffet, 'mediumDate')}`)
            ],
            [
                ...this._buildLine(this.tab == 'fiche-credit-member' ? 'Périodicité' : "Nombre d’échéance", this.tab == 'fiche-credit-member' ? `${this.ficheCreditMember.periodicite || ''}` : `${this.fiche.nombre_echeance}`), 
                ...this._buildLine(this.tab == 'fiche-credit-member' ? "" : "Echéance courant", this.tab == 'fiche-credit-member' ? `` : `${this.fiche.echeance}`)
            ],
            /* [
                ...this._buildLine("Taux d'intêret", `${(this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).tauxinteret || 0}%`),
                ...this._buildLine("Mode de calcul", `${(this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).mode_echeance || ''}`)
            ] */

            [
                ...this._buildLine("Mode de calcul", `${(this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).mode_echeance || ''}`),
                ...this._buildLine("Taux fixe", `${(this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).taux_fixe || 0}%`)
            ],
            [
                ...this._buildLine("Taux annuel variable", `${(this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).taux_variable_annuel || 0}%`),
                ...this._buildLine("Taux d'intêret annuel ", `${(this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).taux_interet_annuel || 0}%`)
            ],
            [
                ...this._buildLine(`Taux variable sur ${duree} mois` , `${(this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).taux_variable_par_duree || 0}%`),
                ...this._buildLine(`Taux d'intêret sur ${duree} mois`, `${(this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).taux_interet_par_duree || 0}%`)
            ],
        ];
        if (this.tab != 'fiche-credit-member') {
            lines.push([
                ...this._buildLine("Téléphone", `${this.fiche.phone || ''}`),
                ...this._buildLine("Périodicité", `${this.fiche.periodicite || ''}`)
            ]);
        }
        let rapatriement = (this.tab == 'fiche-credit-member' ? this.ficheCreditMember : this.fiche).montant_rapatrier;
        if(rapatriement != null && rapatriement != ''){
            lines.push([
                ...this._buildLine("Montant rapatrié",  `${numberWithSpaces(rapatriement)}`),
                ...this._buildLine("", '')
            ]);
        }

        return lines;
    }
    _buildBody(): any[] {
        if (!this.echeances || !this.echeances.length) return [];
        let echs = [];
        let codePeriodicity = (this.fiche || this.ficheCreditMember).code_periodicite;
        let diff = ((this.fiche || this.ficheCreditMember).delai_grace || 0) + ((this.fiche || this.ficheCreditMember).differe || 0);
        //console.log(diff);
        /* if (codePeriodicity && diff && this.echeances[0]) {
            for (let index = 1; index <= diff; index++) {
                let date;
                let echeance_date = new Date(this.echeances[0][0].echeance_date);
                if (codePeriodicity == '15J') {
                    echeance_date.setDate(echeance_date.getDate() - (15 * index));
                } else if (codePeriodicity == '2M') {
                    echeance_date.setMonth(echeance_date.getMonth() - (2 * index));
                } else if (codePeriodicity == '4M') {
                    echeance_date.setMonth(echeance_date.getMonth() - (4 * index));
                } else if (codePeriodicity == 'An') {
                    echeance_date.setMonth(echeance_date.getMonth() - (12 * index));
                } else if (codePeriodicity == 'M') {
                    echeance_date.setMonth(echeance_date.getMonth() - (1 * index));
                } else if (codePeriodicity == 'S') {
                    echeance_date.setDate(echeance_date.getDate() - (7 * index));
                } else if (codePeriodicity == 'Sem') {
                    echeance_date.setMonth(echeance_date.getMonth() - (4 * index));
                } else if (codePeriodicity == 'Trim') {
                    echeance_date.setMonth(echeance_date.getMonth() - (3 * index));
                } else if (codePeriodicity == '1J') {
                    echeance_date.setDate(echeance_date.getDate() - (1 * index));
                } else {
                    echeance_date = null;
                }
                if (echeance_date)
                    date = this._datePipe.transform(echeance_date, 'mediumDate');
                if (date) {
                    echs.push([
                        {
                            text: '-',
                            alignment: 'center',
                            style: "body"
                        },
                        {
                            text: date,
                            style: 'bodyDate'
                        },
                        {
                            text: '00',
                            style: 'body'
                        },
                        {
                            text: '00',
                            style: 'body'
                        },
                        {
                            text: '00',
                            style: 'body'
                        },
                        {
                            text: '00',
                            style: 'body'
                        },
                        {
                            text: '00',
                            style: 'body'
                        },
                        {
                            text: '00',
                            style: 'body'
                        }
                    ]);
                }
            }
        } */
        this.echeances[0].forEach((echeance, index) => {
            echs.push([
                index + 1 == this.echeances[0].length ? {
                    text: 'Total',
                    colSpan: 3,
                    alignment: 'center',
                    style: 'body',
                    bold: true
                } : 
                {
                        text: echeance.num_echeance,
                        style: 'body',
                        alignment: 'center',
                        colSpan: 2,
                }, {},
                {
                    text: index + 1 == this.echeances[0].length ? '' : this._datePipe.transform(echeance.echeance_date, 'mediumDate'),
                    style: 'bodyDate',
                },
                {
                    text: numberWithSpaces((echeance.capital || 0)),
                    bold: index + 1 == this.echeances[0].length,
                    style: 'body',
                },
                {
                    text: numberWithSpaces((echeance.interet || 0)),
                    style: 'body',
                    bold: index + 1 == this.echeances[0].length
                },
                {
                    text: numberWithSpaces((echeance.epargne || 0)),
                    style: 'body',
                    bold: index + 1 == this.echeances[0].length
                },
                {
                    text: numberWithSpaces((echeance.mensualite || 0)),
                    style: 'body',
                    bold: index + 1 == this.echeances[0].length
                }, {
                    text: numberWithSpaces((echeance.capitalRestant || 0)),
                    style: 'body',
                    bold: index + 1 == this.echeances[0].length
                }, {
                    text: numberWithSpaces((echeance.capitalPayer || 0)),
                    style: 'body',
                    bold: index + 1 == this.echeances[0].length
                },
                {
                    text: numberWithSpaces((echeance.interetPayer || 0)),
                    style: 'body',
                    bold: index + 1 == this.echeances[0].length
                },
                /* {
                    text: numberWithSpaces((echeance.epargne || 0), 'XAF', true, '2.0'),
                    style: 'body',
                    bold: index + 1 == this.echeances[0].length
                }, */
                {
                    text: numberWithSpaces((echeance.epargnePayer || 0)),
                    style: 'body',
                    bold: index + 1 == this.echeances[0].length,
                    colSpan: 2,
                },
                /* {}, */
            ]);
        });
        return echs;
    }
}
