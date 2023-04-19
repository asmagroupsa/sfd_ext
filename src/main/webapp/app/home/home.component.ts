import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { AgenceService } from '../entities/agence';
import { ClientService } from '../entities/client';
import { CreditService } from '../entities/credit';
import { CreditRequestService } from '../entities/credit-request';
import { SFDService } from '../entities/s-fd';
import { Account, EventBus, LoginModalService, Principal, ResponseWrapper, UserData } from '../shared';
import { LanguesService } from '../shared/myTranslation/langues';
import { HomeService } from './home.service';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.scss', '../shared/state/state.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    time: string = 'JOUR';
    account: Account;
    modalRef: NgbModalRef;

    private nbRequest: number;
    private nbCredit: number;
    private nbClient: number;
    private nbAgence: number;
    private montantRequest: number;
    private montantRegler: number;
    private montantAccorde: number;
    private tauxRemboursement: number;
    routeSub: any;
    public getEffectif: any;
    public brandPrimary = '#20a8d8';
    public brandSuccess = '#4dbd74';
    public brandInfo = '#63c2de';
    public brandWarning = '#f8cb00';
    public brandDanger = '#f86c6b';
    private clientLength: any;
    private agenceLength: any;
    private creditLength: any;
    public lineChart1Data: any;
    public lineChart2Data: any;
    public lineChart3Data: any;
    public barChart1Data: any;
    private creditRequestLength: any;
    scrollTimeoutId: any;
    public status: { isopen } = { isopen: false };
    public lineChart1Labels: Array<any> = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aôut',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre'
    ];
    public lineChart1Options: any = {
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'transparent',
                        zeroLineColor: 'transparent'
                    },
                    ticks: {
                        fontSize: 2,
                        fontColor: 'transparent'
                    }
                }
            ],
            yAxes: [
                {
                    display: false,
                    ticks: {
                        display: false,
                        min: 0 - 5,
                        max: 84 + 5
                    }
                }
            ]
        },
        elements: {
            line: {
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4
            }
        },
        legend: {
            display: false
        }
    };
    public lineChart1Colours: Array<any> = [
        {
            backgroundColor: this.brandPrimary,
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart1Legend = false;
    public lineChart1Type = 'line';

    public lineChart2Labels: Array<any> = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aôut',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre'
    ];
    public lineChart2Options: any = {
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: 'transparent',
                        zeroLineColor: 'transparent'
                    },
                    ticks: {
                        fontSize: 2,
                        fontColor: 'transparent'
                    }
                }
            ],
            yAxes: [
                {
                    display: false,
                    ticks: {
                        display: false,
                        min: 1 - 5,
                        max: 34 + 5
                    }
                }
            ]
        },
        elements: {
            line: {
                tension: 0.00001,
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4
            }
        },
        legend: {
            display: false
        }
    };
    public lineChart2Colours: Array<any> = [
        {
            backgroundColor: this.brandInfo,
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart2Legend = false;
    public lineChart2Type = 'line';

    public lineChart3Labels: Array<any> = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aôut',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre'
    ];
    public lineChart3Options: any = {
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    display: false
                }
            ],
            yAxes: [
                {
                    display: false
                }
            ]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4
            }
        },
        legend: {
            display: false
        }
    };
    public lineChart3Colours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.2)',
            borderColor: 'rgba(255,255,255,.55)'
        }
    ];
    public lineChart3Legend = false;
    public lineChart3Type = 'line';

    public barChart1Labels: Array<any> = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aôut',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre'
    ];
    public barChart1Options: any = {
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    display: false,
                    barPercentage: 0.6
                }
            ],
            yAxes: [
                {
                    display: true
                }
            ]
        },
        legend: {
            display: false
        }
    };
    public barChart1Colours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.3)',
            borderWidth: 0
        }
    ];
    public barChart1Legend = false;
    public barChart1Type = 'bar';

    public mainChartElements = 27;
    public mainChartData1: Array<number> = [];
    public mainChartData2: Array<number> = [];
    public mainChartData3: Array<number> = [];

    public mainChartData: Array<any> = [
        {
            data: this.mainChartData1,
            label: 'Current'
        },
        {
            data: this.mainChartData2,
            label: 'Previous'
        },
        {
            data: this.mainChartData3,
            label: 'BEP'
        }
    ];
    public mainChartLabels: Array<any> = [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche'
    ];
    public mainChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    gridLines: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: (value: any) => {
                            return value.charAt(0);
                        }
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                        max: 250
                    }
                }
            ]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3
            }
        },
        legend: {
            display: false
        }
    };
    public mainChartColours: Array<any> = [
        {
            backgroundColor: this.convertHex(this.brandInfo, 10),
            borderColor: this.brandInfo,
            pointHoverBackgroundColor: '#fff'
        },
        {
            backgroundColor: 'transparent',
            borderColor: this.brandSuccess,
            pointHoverBackgroundColor: '#fff'
        },
        {
            backgroundColor: 'transparent',
            borderColor: this.brandDanger,
            pointHoverBackgroundColor: '#fff',
            borderWidth: 1,
            borderDash: [8, 5]
        }
    ];
    public mainChartLegend = false;
    public mainChartType = 'line';

    // social box charts
    public socialChartData1: Array<any> = [
        {
            data: [65, 59, 84, 84, 51, 55, 40],
            label: 'Facebook'
        }
    ];
    public socialChartData2: Array<any> = [
        {
            data: [1, 13, 9, 17, 34, 41, 38],
            label: 'Twitter'
        }
    ];
    public socialChartData3: Array<any> = [
        {
            data: [78, 81, 80, 45, 34, 12, 40],
            label: 'LinkedIn'
        }
    ];
    public socialChartData4: Array<any> = [
        {
            data: [35, 23, 56, 22, 97, 23, 64],
            label: 'Google+'
        }
    ];

    public socialChartLabels: Array<any> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July'
    ];
    public socialChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    display: false
                }
            ],
            yAxes: [
                {
                    display: false
                }
            ]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3
            }
        },
        legend: {
            display: false
        }
    };
    public socialChartColours: Array<any> = [
        {
            backgroundColor: 'rgba(255,255,255,.1)',
            borderColor: 'rgba(255,255,255,.55)',
            pointHoverBackgroundColor: '#fff'
        }
    ];
    public socialChartLegend = false;
    public socialChartType = 'line';

    // sparkline charts
    public sparklineChartData1: Array<any> = [
        {
            data: [35, 23, 56, 22, 97, 23, 64],
            label: 'Clients'
        }
    ];
    public sparklineChartData2: Array<any> = [
        {
            data: [65, 59, 84, 84, 51, 55, 40],
            label: 'Clients'
        }
    ];

    public sparklineChartLabels: Array<any> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July'
    ];
    public sparklineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [
                {
                    display: false
                }
            ],
            yAxes: [
                {
                    display: false
                }
            ]
        },
        elements: {
            line: {
                borderWidth: 2
            },
            point: {
                radius: 0,
                hitRadius: 10,
                hoverRadius: 4,
                hoverBorderWidth: 3
            }
        },
        legend: {
            display: false
        }
    };
    public sparklineChartDefault: Array<any> = [
        {
            backgroundColor: 'transparent',
            borderColor: '#d1d4d7'
        }
    ];
    public sparklineChartPrimary: Array<any> = [
        {
            backgroundColor: 'transparent',
            borderColor: this.brandPrimary
        }
    ];
    public sparklineChartInfo: Array<any> = [
        {
            backgroundColor: 'transparent',
            borderColor: this.brandInfo
        }
    ];
    public sparklineChartDanger: Array<any> = [
        {
            backgroundColor: 'transparent',
            borderColor: this.brandDanger
        }
    ];
    public sparklineChartWarning: Array<any> = [
        {
            backgroundColor: 'transparent',
            borderColor: this.brandWarning
        }
    ];
    public sparklineChartSuccess: Array<any> = [
        {
            backgroundColor: 'transparent',
            borderColor: this.brandSuccess
        }
    ];

    public sparklineChartLegend = false;
    public sparklineChartType = 'line';

    constructor(
        private route: ActivatedRoute,
        public homeService: HomeService,
        public principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private router: Router,
       /*  private statistique: StateService, */
        public langue: LanguesService,
        private _clientService: ClientService,
        private _agenceService: AgenceService,
        private _creditService: CreditService,
        private _creditRequestService: CreditRequestService,
        private sfdService: SFDService
    ) {
        this.getEffectif = {};
        this.creditRequestLength = [];
        this.clientLength = [];
        this.agenceLength = [];
        this.creditLength = [];
        this.lineChart1Data = [{ data: [], label: 'NbCli/mois' }];
        this.lineChart2Data = [{ data: [], label: 'NbCli/mois' }];
        this.lineChart3Data = [{ data: [], label: 'NbCli/mois' }];
        this.barChart1Data = [{ data: [], label: 'NbCli/mois' }];

        /* this.graphJan = 0;
        this.graphFeb = 0;
        this.graphMar = 0;
        this.graphApr = 0;
        this.graphMay = 0;
        this.graphJun = 0;
        this.graphJul = 0;
        this.graphAou = 0;
        this.graphSep = 0;
        this.graphOct = 0;
        this.graphNov = 0;
        this.graphDec = 0; */
    }

    ngAfterViewInit() {
        //this.scrollPageMethod();
    }

    ngOnDestroy() {
        clearTimeout(this.scrollTimeoutId);
        window.scrollTo(0, 0);
        if(this.routeSub)
        this.routeSub.unsubscribe();
    }
    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (UserData.getInstance().listeAgences || UserData.getInstance().currentSfdReference != null) {
                this.homeService.reportSfdUtilisateur()
                    .subscribe((res) => {
                        this.getEffectif = res[0];
                        this.getEffectif.taux_remb_individu = parseFloat(this.getEffectif.taux_remb_individu.toFixed(3))
                        this.getEffectif.taux_remb_groupe = parseFloat(this.getEffectif.taux_remb_groupe.toFixed(3))
                        this.getEffectif.taux_remb_entpse = parseFloat(this.getEffectif.taux_remb_entpse.toFixed(3))
                        this.getEffectif.taux_remb_total = parseFloat(this.getEffectif.taux_remb_total.toFixed(3))

                    })
            }

            EventBus.subscribe('agences', agences => {
                let sfd = agences[0].sfdId;
                this.homeService.reportSfdUtilisateur()
                    .subscribe((res) => {
                        this.getEffectif = res[0];

                        this.getEffectif.taux_remb_individus = parseFloat(this.getEffectif.taux_remb_individu.toFixed(3))
                        this.getEffectif.taux_remb_groupe = parseFloat(this.getEffectif.taux_remb_groupe.toFixed(3))
                        this.getEffectif.taux_remb_entpse = parseFloat(this.getEffectif.taux_remb_entpse.toFixed(3))
                        this.getEffectif.taux_remb_total = parseFloat(this.getEffectif.taux_remb_total.toFixed(3))


                    })

                this.homeService.reportSfdClient(sfd)
                    .subscribe((res) => {
                        UserData.getInstance().listeStatistique[0] = res[0].nbrequest;
                        this.nbRequest = UserData.getInstance().listeStatistique[0];

                        UserData.getInstance().listeStatistique[0] = res[0].nbrequest;
                        this.nbRequest = UserData.getInstance().listeStatistique[0];

                        UserData.getInstance().listeStatistique[1] = res[0].nbcredit;
                        this.nbCredit = UserData.getInstance().listeStatistique[1]

                        UserData.getInstance().listeStatistique[2] = res[0].nbclient;
                        this.nbClient = UserData.getInstance().listeStatistique[2];

                        UserData.getInstance().listeStatistique[3] = res[0].nbagence;
                        this.nbAgence = UserData.getInstance().listeStatistique[3];

                        UserData.getInstance().listeStatistique[4] = res[0].montantRequest;
                        this.montantRequest = UserData.getInstance().listeStatistique[4];

                        UserData.getInstance().listeStatistique[5] = res[0].montantRegler;
                        this.montantRegler = UserData.getInstance().listeStatistique[5];

                        UserData.getInstance().listeStatistique[6] = res[0].montantAccorde;
                        this.montantAccorde = UserData.getInstance().listeStatistique[6];

                        UserData.getInstance().listeStatistique[7] = parseFloat(res[0].tauxRemboursement.toFixed(3));
                        this.tauxRemboursement = UserData.getInstance().listeStatistique[7];
                    })
            })
            this.nbRequest = UserData.getInstance().listeStatistique[0];
            this.nbCredit = UserData.getInstance().listeStatistique[1]
            this.nbClient = UserData.getInstance().listeStatistique[2];
            this.nbAgence = UserData.getInstance().listeStatistique[3];
            this.montantRequest = UserData.getInstance().listeStatistique[4];
            this.montantRegler = UserData.getInstance().listeStatistique[5];
            this.montantAccorde = UserData.getInstance().listeStatistique[6];
            this.tauxRemboursement = UserData.getInstance().listeStatistique[7];
        });
        for (let i = 0; i <= this.mainChartElements; i++) {
            this.mainChartData1.push(this.random(50, 200));
            this.mainChartData2.push(this.random(80, 100));
            this.mainChartData3.push(65);
        }
        this.langue.langState.subscribe(lang => {
            if (lang == 'fr') {
                this.mainChartLabels = [
                    'Lundi',
                    'Mardi',
                    'Mercredi',
                    'Jeudi',
                    'Vendredi',
                    'Samedi',
                    'Dimanche',
                    'Lundi',
                    'Mardi',
                    'Mercredi',
                    'Jeudi',
                    'Vendredi',
                    'Samedi',
                    'Dimanche',
                    'Lundi',
                    'Mardi',
                    'Mercredi',
                    'Jeudi',
                    'Vendredi',
                    'Samedi',
                    'Dimanche',
                    'Lundi',
                    'Mardi',
                    'Mercredi',
                    'Jeudi',
                    'Vendredi',
                    'Samedi',
                    'Dimanche'
                ];
            } else if (lang == 'en') {
                this.mainChartLabels = [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                    'Monday',
                    'Thursday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ];
            }
        });

        this.registerAuthenticationSuccess();

        /*  UserData.getInstance().listeAgencesState.subscribe(agences => {
            let id=UserData.getInstance().sfdId;
            this.homeService.queryReportSfd(id)
                .subscribe((res)=>
                {
                })


            if (agences) {
                this.getAllCreditsRequest();
                this.getAllCredits();
                this.getAllClients();
                this.getAllAgences();
            }
        }); */
    }
    public random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public toggleDropdown($event: MouseEvent): void {
        $event.preventDefault();
        $event.stopPropagation();
        this.status.isopen = !this.status.isopen;
    }

    // convert Hex to RGBA
    public convertHex(hex: string, opacity: number) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const rgba =
            'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
        return rgba;
    }

    // events
    public chartClicked(e: any): void {
    }

    public chartHovered(e: any): void {
    }
    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal
                .identity()
                .then(account => {
                    this.account = account;
                    if (!this.account) this.login();
                })
                .catch(err => {
                    this.login();
                });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }
    login() {
        this.router.navigate(['/login']);
    }
    chartTimed(time: string) {
        this.time = time;
    }

    public getAllClients() {
        this._clientService.query().subscribe((res: ResponseWrapper) => {
            this.clientLength = res.json;
           /*  this.lineChart1Data = getStatistiqueByMonth(this.clientLength); */
        });
    }

    public getAllAgences() {
        this._agenceService
            .query({
                // 'sfdId:equals': UserData.getInstance().listeAgences[0].sfdId,
                size: 1000
            })
            .subscribe((res: ResponseWrapper) => {
                this.agenceLength = res.json;
               /*  this.barChart1Data = getStatistiqueByMonth(this.agenceLength); */
            });
    }

    public getAllCredits() {
        this._creditService.query().subscribe((res: ResponseWrapper) => {
            this.creditLength = res.json;
            /* this.lineChart3Data = getStatistiqueByMonth(this.creditLength); */
        });
    }

    public getAllCreditsRequest() {
        this._creditRequestService.query().subscribe((res: ResponseWrapper) => {
            this.creditRequestLength = res.json;
            /* this.lineChart2Data = getStatistiqueByMonth(
                this.creditRequestLength
            ); */
        });
    }
    scrollPageMethod() {
        if(true == true || this.router.url.indexOf('/sfd') == -1) return ;
        let scrollStep = 50;
        let timeToScroll = Math.floor(window.innerHeight / scrollStep) - 1;
        let scroll = (index) => {
        if(this.router.url.indexOf('/sfd') == -1){
         clearTimeout(this.scrollTimeoutId);
         //window.scrollTo(0, 0);
             return ;
        }
            window.scrollTo(0, index * scrollStep);
            if (index >= timeToScroll) {
                window.scrollTo(0, 0);
                clearTimeout(this.scrollTimeoutId);
                this.scrollPageMethod();
            }
        };
        for (let index = 1; index <= timeToScroll; index++) {
            this.scrollTimeoutId = setTimeout(() => {
                scroll(index);
            }, 3000 * index);
        }
    }
}

//effectifSFDcLIENT  IdSFD
/* function getStatistiqueByMonth(arrayData) {
    let graphJan = 0;
    let graphFeb = 0;
    let graphMar = 0;
    let graphApr = 0;
    let graphMay = 0;
    let graphJun = 0;
    let graphJul = 0;
    let graphAou = 0;
    let graphSep = 0;
    let graphOct = 0;
    let graphNov = 0;
    let graphDec = 0;
    let graphYear = arrayData.length - 1;
    for (let i = 0; i <= arrayData.length - 1; i++) {
        let createdDate = arrayData[i].createdDate;
        graphYear = createdDate.getFullYear();
        let now = new Date().getFullYear();
        if (now === graphYear) {
            let graphMonth = parseInt(createdDate.getMonth());

            if (graphMonth == 0) {
                graphJan = graphJan + 1;
            } else if (graphMonth == 1) {
                graphFeb = graphFeb + 1;
            } else if (graphMonth == 2) {
                graphMar = graphMar + 1;
            } else if (graphMonth == 3) {
                graphApr = graphApr + 1;
            } else if (graphMonth == 4) {
                graphMay = graphMay + 1;
            } else if (graphMonth == 5) {
                graphJun = graphJun + 1;
            } else if (graphMonth == 6) {
                graphJul = graphJul + 1;
            } else if (graphMonth == 7) {
                graphAou = graphAou + 1;
            } else if (graphMonth == 8) {
                graphSep = graphSep + 1;
            } else if (graphMonth == 9) {
                graphOct = graphOct + 1;
            } else if (graphMonth == 10) {
                graphNov = graphNov + 1;
            } else if (graphMonth == 11) {
                graphDec = graphDec + 1;
            }
        }
    }
    return [
        {
            data: [
                graphJan,
                graphFeb,
                graphMar,
                graphApr,
                graphMay,
                graphJun,
                graphJul,
                graphAou,
                graphSep,
                graphOct,
                graphNov,
                graphDec
            ],
            label: 'Nbr/mois'
        }
    ];
} */
