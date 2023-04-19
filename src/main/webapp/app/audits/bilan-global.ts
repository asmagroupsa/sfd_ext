import { DatePipe,CurrencyPipe,DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { createRequestOption, READFILEURL, UserData } from '../shared';
import { getImgSrc, numberWithSpaces } from '../shared/model/functions';
import { HOST, READBITFILEURL } from '../shared/model/request-util';
import { StateService } from '../shared/state/statistiques';
import { Produit, ProduitService } from '../entities/produit';
import { StatsService } from './stats.service';
declare const jQuery: any;
declare const jsPDF: any;
declare let pdfMake: any;
declare const select_init: any;
@Component({
    selector: 'jhi-bilan-global-sheet',
    templateUrl: './bilan-global.html',
    styleUrls: ['../shared/state/state.css']
})
export class BilanGlobalSheetComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _subscription: Subscription;
    private _ficheLoadEnd: boolean;
    private _clientLoadEnd: boolean;
    private _agenceLoadEnd: boolean;
    public client: any;
    public fiche: any[];
    private increment: number = 0;
    private imageReady: boolean;
    _DePage: any;
    produits:any[] = [];
    produit:any;
    date1:any;
    date2:any;
    @ViewChild('printZone') printZone: ElementRef;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _stateService: StatsService,
        private _datePipe: DatePipe,
        private _currencyPipe: CurrencyPipe,
        private numberPipe:DecimalPipe,
        private http: Http,
        private produitService:ProduitService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.client = null;
        this.fiche = [];
        this._ficheLoadEnd = false;
        this._clientLoadEnd = false;
        this._agenceLoadEnd = false;

        let now = new Date();
        this.date1 = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        };
        this.date2 = Object.assign({}, this.date1);
    }
     onPeriodChange() {
        this._getBilanGlobalSheet();
    }
    onProduitChange(){
       this._getBilanGlobalSheet();
    }
    get hideLoader(): boolean {
        let tmp = this._ficheLoadEnd;
        return tmp;
    }
formatDate(date,format = 'dd-MM-y'){
 return   this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), format);
}
    private _getBilanGlobalSheet(): void {
        //
        this._stateService.bilanGlobal({NO_QUERY: true,date1: this.formatDate(this.date1,'dd/MM/y')})
            .subscribe(
                ((fiche: any) => {
                    this.fiche = fiche;
                    this._ficheLoadEnd = true;
                    this._buildFiche();
                })
            );
    }

   
ngAfterViewInit() {
        select_init();
    }
    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
       this._getBilanGlobalSheet();
        this.produitService.getFnmAndSfdProduits({ NO_QUERY: true }, ['CREDIT', 'LIGNE_PRODUIT', 'LIGNE_CREDIT']).then((produits) => {
            this.produits = produits;
        })
        .catch((err) => {
            this.produits = [];
        });
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public isSection(id: number): boolean {
        return [1, 13, 20, 29].indexOf(id) > -1;
    }
    async _buildFiche() {
        try {
            let dd = this._buildData(this.fiche);
            let pdf = pdfMake.createPdf(dd);
            pdf.getDataUrl((data) => {
                if (data) {
                    this.printZone.nativeElement.src = data;
                }
            });
        } catch (error) {

        }
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
    private  _buildData(fiche) {
        let picture;
        let body = this._buildBody(fiche);
        return {
            content: [
                {
                    margin:[0,2,0,20],
                    table: {
                        widths: ['*'],
                        body: [
                            [[{
                                width: '*',
                                text: "BILAN GLOBAL",
                                alignment: 'center',
                                style: 'title'
                            },
                            {
                                width: '*',
                                text: this.date1?`à la date du ${this.formatDate(this.date1)}`:'',
                                alignment: 'center',
                                style: 'title2'
                            }
                            ]]
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            return '#afced7';
                        }
                    }
                },
                ...body
                
            ],
            styles: {
                noteFinale:{
bold:true,
fontSize:19
                },
                noteMin:{
bold:true,
fontSize:19
                },
                title2:{
fontSize: 13
                },
                firstTitle:{
fontSize:21,
margin:[0,5,0,5]
                },
                finalResult:{
                    fontSize:23,
                    margin:[0,5,0,5],
                    decoration: 'underline'
                },
                name: {
                    bold: true
                },
                condition: {
                    fontSize:12
                },
                element: {
                    fontSize:12
                },
                noCondition:{
color: "#636c72",
margin:[0,20,0,2]
                },
                note: {
                    fontSize:12,
                    alignment:'right',
                    italics:true
                },
                image: {
                    padding: [5, 5, 5, 5],
                    alignment: 'center',
                    border: [true, true, true, true],
                    margin: [2, 3, 3, 3]
                },
                title: {
                    fontSize: 22,
                    bold: true,
                    //padding:[0,3,0,0],
                    margin: [4, 8, 4, 8],
                },
                reference: {
                    fontSize: 13,
                    italics: true
                },
                subTitle: {
                    fontSize: 18,
                    bold: true,
                },
                table: {
                    fontSize: 14,
                    alignment:'center'
                },
                label: {
                    fontSize: 11,
                    bold:true,
                    margin: [2, 5, 0, 5],
                    alignment:'center'
                },
                value: {
                    fontSize: 13,
                    margin: [0, 20, 0, 20],
                    alignment:'center'
                },
                subTable: {
                    //margin: [0, 12, 0, 0],
                    padding: [0, 5, 0, 5]
                }
            }
        }
    }
    private _buildBody(fiche) {
        let body = [], conds = [];
        for (let index = 0,len = 2; index < len; index++) {
        
            body.push(
                {
                    style: 'subTable',
                    table: {
                        widths: ['*'],
                        body: [
                            [{
                                text: `${index == 0?'Lignes de crédit MCM':'Crédits MCM aux bénéficiaires'}`,
                                style: 'subTitle',
                                width: '*',
                                alignment:'center'
                            }]
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return 0.4;
                        },
                        vLineWidth: function (i, node) {
                            return i == 0 || i == node.table.widths.length ? 0.4 : 0;
                        },
                        hLineColor: function (i, node) {
                            return 'gray';
                        },
                        vLineColor: function (i, node) {
                            return 'gray';
                        },
                        fillColor: function (i, node) {
                            return '#afced7';
                        }
                    }
                }
            );
            
                let conds = [];
                for (let i = 0; i < 1; i++) {
                   conds.push([
                    {
                        text: `${numberWithSpaces((index == 0?fiche.ligne_decaisse:fiche.credit_decaisse) || 0)}`,
                        width: '*',
                        style:['decaisse','value']
                    },
                     {
                        text: `${numberWithSpaces((index == 0?fiche.ligne_remb:fiche.credit_remb) || 0)}`,
                        width: '*',
                        style: ['rembourse','value']
                    },
                    {
                        text: `${numberWithSpaces((index == 0?fiche.ligne_encours:fiche.credit_encours) || 0)}`,
                        width: '*',
                        style: ['encours','value']
                    },
                    {
                        text: `${this.numberPipe.transform((index == 0?fiche.taux_ligne:fiche.taux_credit) || 0, '1.0-2')}%`,
                        width: 'auto',
                        style: ['realisation','value']
                    }
                ]);
                
                }
                 body.push({
                style: "table",
                alignment: 'justify',
                table: {
                    widths: ['*', '*', '*','*'],
                    body: [
                        [{
                            text: index == 0?"Ligne de crédits MCM décaisséss":"Crédits décaissés",
                            width: '*',
                            style: 'label'
                        },
                        {
                            text: index == 0?"Ligne de crédits MCM remboursées":"Crédits remboursés",
                            width: '*',
                            style: 'label'
                        },
                        {
                            text: index == 0?"Ligne de crédits MCM en cours":"Crédits en cours",
                            width: 'auto',
                            style: 'label'
                        },
                        {
                            text: "Taux de réalisation",
                            width: 'auto',
                            style: 'label'
                        }
                        ],
                        ...conds
                    ]
                },
                layout: {
                    fillColor: function (i, node) {
                        return (i % 2 === 0) ? '#f5f5f5' : null;
                    },
                    hLineWidth: function (i, node) {
                        return 0.5;
                    },
                    vLineWidth: function (i, node) {
                        return 0.5;
                    }
                }
            });
        }
        return body;
    }
}
