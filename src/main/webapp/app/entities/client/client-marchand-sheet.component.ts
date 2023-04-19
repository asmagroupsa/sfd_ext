import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client, ClientService } from '.';
import { createRequestOption, UserData,ResponseWrapper } from '../../shared';
import { ImageService } from '../../shared/image.service';
import { getImgSrc } from '../../shared/model/functions';
import { READFILEURL, READBITFILEURL } from '../../shared/model/request-util';
import { StateService } from '../../shared/state/statistiques';
import { Agence, AgenceService } from '../agence';
import {  ProduitService } from '../produit';
import { AffectationService } from '../affectation/affectation.service';

declare const jQuery: any;
declare const jsPDF: any;
declare let pdfMake: any;
declare const select_init: any;

@Component({
    selector: 'jhi-client-marchand-sheet',
    templateUrl: './client-marchand-sheet.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class ClientMarchandSheetComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _subscription: Subscription;
    private _ficheLoadEnd: boolean;
    private _clientLoadEnd: boolean;
    private _agenceLoadEnd: boolean;
    public client: Client;
    public agence: Agence;
    public fiche: any;
    private increment: number = 0;
    private imageReady: boolean;
    _DePage: any;
    produits:any[] = [];
    produit:any;

    @ViewChild('printZone') printZone: ElementRef;

    constructor(
        private _clientService: ClientService,
        private _activatedRoute: ActivatedRoute,
        private _stateService: StateService,
        private _agenceService: AgenceService,
        private _datePipe: DatePipe,
        private http: Http,
        private produitService:ProduitService,
        private _changeDetectorRef: ChangeDetectorRef,
        private imageService: ImageService,
        public affectationService: AffectationService
    ) {
        this.client = null;
        this.agence = null;
        this.fiche = [];
        this._ficheLoadEnd = false;
        this._clientLoadEnd = false;
        this._agenceLoadEnd = false;

        // this.hostElement.nativeElement.querySelector("#print");
    }
    get hideLoader(): boolean {
        let tmp = this._ficheLoadEnd;
        return tmp;
    }

    getImgSrc(url: string): string {
        return getImgSrc(url);
    }
    getClientsListe(type){
        this._clientService.getClientListePdf().subscribe(
            (res: ResponseWrapper) => {
                this.fiche = res.json._body;
                this._ficheLoadEnd = true;
                console.log(this.fiche);
                var reader = new FileReader();
                reader.addEventListener('load', () => {
                   this.printZone.nativeElement.src = reader.result;
                });
                reader.readAsDataURL(this.fiche);
                /* this.printZone.nativeElement.src = window.URL.createObjectURL(); */
                //this._buildFiche();
            },
            (res: ResponseWrapper) => {
                //this.onError(res.json);
            }
        );
    }
 queryMarchand() {
        let listeAgences = UserData.getInstance().listeAgences;
        let agence = '';
        if (listeAgences.length) {
            if (UserData.getInstance().currentAgence) {
                agence = UserData.getInstance().currentAgence.codeAgence;
            } else {
                agence = listeAgences[0].codeAgence || UserData.getInstance().agence;
            }
        } else {
            agence = UserData.getInstance().currentAgence.codeAgence;
        }
        this.affectationService.queryMarchand(agence, true).subscribe(
            (res: ResponseWrapper) => { 
                this.fiche = res.json;
                this._ficheLoadEnd = true;
                this._buildFiche();
            },
            (res: ResponseWrapper) => {
                //this.onError(res.json);
            }
        );
    }
ngAfterViewInit() {
        select_init();
    }
    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._activatedRoute.queryParams.subscribe((p)=>{
            if (p['type'] === 'INDIVIDU'){
                this.getClientsListe(p['type']);
            }else{
                this.queryMarchand();
            }
        });
    }

    public ngOnDestroy(): void {
        //this._subscription.unsubscribe();
    }

    public isSection(id: number): boolean {
        return [1, 13, 20, 29].indexOf(id) > -1;
    }
    async _buildFiche() {
        try {
            let dd = await this._buildData(this.fiche);
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
    private async _buildData(fiche) {
        let picture;
        /* try {
            if(this.client['pictureUrl'])
            picture = await this.onLoadedPhoto(this.client['pictureUrl']);
        } catch (error) {

        } */
        let body = this._buildBody(fiche);
        return {
            content: [
                {
                    margin:[0,2,0,4],
                    table: {
                        widths: ['*'],
                        body: [
                            [{
                                width: '*',
                                text: "LISTE DES MARCHANDS DU SFD ",
                                alignment: 'center',
                                style: 'title'
                            }]
                        ]
                    },
                    layout: {
                        fillColor: function (i, node) {
                            return '#afced7';
                        }
                    }
                },
                {
                    text:'',
                    style:"firstTitle",
                    alignment:'center',
                    bold:true,
                    width:'*'
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
                    padding: [3, 3, 0, 3]
                },
                table: {
                    margin: [0, 8, 0, 5],
                    fontSize: 14
                },
                label: {
                    fontSize: 11,
                    bold:true,
                    margin: [2, 5, 0, 5]
                },
                value: {
                    fontSize: 13,
                    margin: [0, 5, 2, 5]
                },
                subTable: {
                    margin: [0, 10, 0, 5],
                    padding: [0, 3, 0, 3]
                }
            }
        }
    }
    private _buildBody(fiche) {
        if(!fiche.length){
            return [{
                    text:"Pas de marchands dans ce SFD",
                    style:"noCondition",
                     alignment:'center',
                    width:'*',
                    bold:true
                }];
        }
        let body = [],bd = [];
        for (let index = 0,len = fiche.length; index < len; index++) {
            const el = fiche[index];
            bd.push([{
                                text: `${index + 1}`,
                                style: 'produit',
                                width: '*',
                                alignment:'center'
                            }, {
                                text: 'photo',
                                alignment: 'right'
                            },
                            {
                                text: `${el.login}`,
                                alignment: 'center'
                            },
                            {
                                text: `${el.name}`,
                                alignment: 'center'
                            }
                            ,{
                                text:`${el.nomcp || el.affectedTo}`
                            },
                            {
                                text:`${this._datePipe.transform(el.date_affectation||el.dateAffectation, 'mediumDate')}`
                            },
                            {
                                text:`${el.phone}`
                            }]);
        }
        body.push(
                {
                    style: 'subTable',
                    table: {
                        widths: ['auto', 'auto','*','*','*','*','*'],
                        body: [
                            ['N°','Photo','N° Carmes','Nom&prénoms','Affecté à',"Date d'affect.",'Téléphone'],
                            ...bd
                        ]
                    },
                    layout: {
                        hLineWidth: function (i, node) {
                            return 0;
                        },
                        vLineWidth: function (i, node) {
                            return 0;
                        },
                        hLineColor: function (i, node) {
                            return 'gray';
                        },
                        vLineColor: function (i, node) {
                            return 'gray';
                        },
                    }
                }
            );
        return body;
    }
}
