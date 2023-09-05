import { Injectable, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { getToken } from '..';
import { SFDService } from '../../entities/s-fd/sfd.service';
import { EventBus } from '../model/functions';
import { UserData } from '../model/singleton';
import { AccountService } from './account.service';
import { CryptoCookies } from './crypt-cookies.service';







@Injectable()
export class Principal implements OnInit {
    
    public userIdentity: any;
    
    credentials = {
        password: '',
        userName: ''
    }

    public authenticated = false;
    private authenticationState = new Subject<any>();
    private firstAuthenticationState = new Subject<boolean>();
    photoState = new Subject<any>();
    public store: any = {};
    public loading: string = 'Chargement ...';

    constructor(
        private _cookieService: CookieService,
        private account: AccountService,
        private sfdService: SFDService,
        private router: Router,
        private cryptoCookies:CryptoCookies
    ) { }

    ngOnInit(): void {
        this.localisation();
    }


    localisation() {
        navigator.geolocation.getCurrentPosition(position => {
            this.store['coords'] = position;
        });
    }

    authenticate(identity) {
        console.log(identity)
        this.setUserIdentity(identity);
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }

    hasAnyAuthority(authorities: string[]): Promise<boolean> {
        return Promise.resolve(this.hasAnyAuthorityDirect(authorities));
    }

    hasAnyAuthorityDirect(authorities: string[]): boolean {
        if (
            !this.authenticated ||
            !this.userIdentity ||
            !this.userIdentity.authorities
        ) {
            return false;
        }

        for (let i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authorities.indexOf(authorities[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    hasAuthority(authority: string): Promise<boolean> {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }
        return this.identity().then(
            id => {
                return Promise.resolve(
                    id.authorities && id.authorities.indexOf(authority) !== -1
                );
            },
            () => {
                return Promise.resolve(false);
            }
        );
    }
    hasRessources(ressource: string): boolean {
        if (!UserData.getInstance().ressources) return false;
        return UserData.getInstance().ressources.indexOf(ressource) != -1;
    }
    hasAnyRessources(ressources: string[]): boolean {
        if (!UserData.getInstance().ressources) return false;
        for (let index = 0, len = ressources.length; index < len; index++) {
            if (this.hasRessources(ressources[index])) {
                return true;
            }
        }
        return false;
    }
    setEtatConnexion(etat: boolean = false): Observable<any> {
        if (this.userIdentity && this.userIdentity.id) {
            return this.account.setEtatConnexion(this.userIdentity.id, etat);
        } else {
            return Observable.create(observer => {
                observer.error('');
                observer.complete();
            });
        }
    }
    setUserIdentity(account: any) {
        this.userIdentity = account;
        UserData.getInstance().account = account;
        this._cookieService.put('userIdentity', this.cryptoCookies.encryptWithPublicKey(JSON.stringify(account)))
       // this._cookieService.putObject('userIdentity', account);
    }
    identity(force?: boolean): Promise<any> {
        if (!this.store['coords']) this.localisation();
        if (force === true) {
            this.setUserIdentity(undefined);
        }

        // check and see if we have retrieved the userIdentity data from the server.
        // if we have, reuse it by immediately resolving
        if (this.userIdentity && UserData.getInstance().infos) {
            return Promise.resolve(this.userIdentity);
        }

        // retrieve the userIdentity data from the server, update the identity object, and then resolve.
        if (!getToken()) {
            console.log('cookieService.remove !getToken()');
            // this._cookieService.remove('userIdentity');
            this._cookieService.remove('tab');
            this._cookieService.remove('userdata');
            this._cookieService.remove('userReference');
            this._cookieService.remove('sfdReference');
            this._cookieService.remove('agenceReference');
            this._cookieService.remove('listeAgence');
            this.router.navigate(['/'])
            console.log('no token yet');
            return Promise.resolve(null);
        }
       // let cookieObj: any = this._cookieService.getObject('userIdentity');
       let cookieObj: any =this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('userIdentity')) ? JSON.parse(this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('userIdentity'))) : this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('userIdentity'))
    
      
       // let cookieObjUserReference: any = this._cookieService.getObject( 'userReference' );
        let cookieObjUserReference: any = this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('userReference')) ? JSON.parse(this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('userReference'))) : this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('userReference'))
    

       // let cookieObjSfdReference: any = this._cookieService.getObject( 'sfdReference' );
        let cookieObjSfdReference: any = this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('sfdReference')) ? JSON.parse(this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('sfdReference'))) : this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('sfdReference'))


       // let cookieObjAgenceReference: any = this._cookieService.getObject('agenceReference' );
        let cookieObjAgenceReference: any = this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('agenceReference')) ? JSON.parse(this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('agenceReference'))) : this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('agenceReference'))


       // let cookieObjListeAgence: any = this._cookieService.getObject('listeAgence' );
        let cookieObjListeAgence: any = this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('listeAgence')) ? JSON.parse(this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('listeAgence'))) : this.cryptoCookies.decryptWithPrivateKey(this._cookieService.get('listeAgence'))
        


        if (cookieObj) {
            if (cookieObj['typeUser'] != 'SFD') {
                console.log('cookieService.remove typeUSer != SFD');
                this._cookieService.remove('userIdentity');
                return Promise.resolve(null);
            }
            this.setUserIdentity(cookieObj);
            UserData.getInstance().userReference = cookieObjUserReference;
            EventBus.publish('user_reference', UserData.getInstance().userReference)
            UserData.getInstance().sfd = cookieObjSfdReference;
            UserData.getInstance().agence = cookieObjAgenceReference;
            UserData.getInstance().listeAgences = cookieObjListeAgence;
        }
        let newAccount: boolean =
            UserData.getInstance().infos || (cookieObj && cookieObj.id);
        return this.getAccount(newAccount ? false : true)
            .then(account => {
                if (account) {

                    this.setUserIdentity(account);
                   // this._cookieService.putObject('userIdentity', account);
                   this._cookieService.put('userIdentity', this.cryptoCookies.encryptWithPublicKey(JSON.stringify(account)));
                  
        
                    this.authenticated = true;
                } else {
                    this.setUserIdentity(null);
                    console.log('cookieService.remove !account');
                    this._cookieService.remove('userIdentity');
                    this.authenticated = false;
                }
                this.authenticationState.next(this.userIdentity);
                return this.userIdentity;
            })
            .then(userIdentity => {
              
                return this.getRessources();
            })
            .catch(err => {
                console.log(err +"err");
                console.log('cookieService.remove getAccount');
                this._cookieService.remove('userIdentity');
                this.setUserIdentity(null);
                this.authenticated = false;
                this.authenticationState.next(this.userIdentity);
                if (err == 'ALREADY CONNECTED') return Promise.reject(err);
                return null;
            });
    }
    authenticateUser(): Observable<any> {
        return this.account.get();
    }
    getAccount(newAccount: boolean = true): Promise<any> {
        if (newAccount) {
            return this.authenticateUser()
                .toPromise()
                .then(account => {
                    if (
                        /superAdminSfd/i.test(account.login) ||
                        ~account.authorities.indexOf('SOUS_TRAITANT') ||
                        ~account.authorities.indexOf('DASHBOARD_SFD')
                    ) {
                        return Promise.resolve(account);
                    }
                    return new Promise((resolve, reject) => {
                        this.account
                            .getEtatConnexion(account.id)
                            .subscribe(state => {
                                if (state.resultat == 'CONNECTER') {
                                    reject('ALREADY CONNECTED');
                                } else {
                                    this.account
                                        .setEtatConnexion(account.id, true)
                                        .subscribe(() => { }, e => { });
                                    resolve(account);
                                }
                            });
                    });
                });
        } else {
            return Promise.resolve(this.userIdentity);
        }
    }
    getRessources(): Promise<any> {
        if (!this.userIdentity || !this.userIdentity.id) {
            return Promise.resolve(null);
        }
        if (UserData.getInstance().infos) {
            EventBus.publish('ressources', {});
            return Promise.resolve(this.userIdentity);
        }
        return this.account
            .getRessources(this.userIdentity.id)
            .toPromise()
            .then(ressources => {
                let account = Object.assign({}, this.userIdentity);
                if (ressources) {
                    UserData.getInstance().userReference =
                        ressources.user_reference;
                    EventBus.publish('user_reference', ressources.user_reference);
                    //this._cookieService.putObject('userReference', ressources.user_reference);
                    this._cookieService.put('userReference', this.cryptoCookies.encryptWithPublicKey(JSON.stringify(ressources.user_reference)))


                    UserData.getInstance().sfd = ressources.sfd_reference;
                    UserData.getInstance().currentSfdReference = ressources.sfd_reference;
                    //this._cookieService.putObject('sfdReference', ressources.sfd_reference);
                    this._cookieService.put('sfdReference', this.cryptoCookies.encryptWithPublicKey(JSON.stringify(ressources.sfd_reference)))

                    this.getSfd();
                    UserData.getInstance().zoneAgence = ressources.zone_reference;
                    UserData.getInstance().agence = ressources.agence_reference;
                    //console.log(userdata);
                    //this._cookieService.putObject('agenceReference', ressources.agence_reference);
                    this._cookieService.put('agenceReference', this.cryptoCookies.encryptWithPublicKey(JSON.stringify(ressources.agence_reference)))

                    UserData.getInstance().agencesReference = ressources.liste_agence ? ressources.liste_agence.split(',') : null;
                    console.log(ressources.liste_agence);
                    console.log(UserData.getInstance().agencesReference);
                    if (!ressources.liste_agence && ressources.sfd_reference) {
                        EventBus.publish('agences', ressources.sfd_reference);
                    }
                    if (ressources.sfd_reference && this.userIdentity.firstConnection !== false && this.hasAnyAuthorityDirect(['ROLE_ADMIN'])) {
                        console.log('valeur retourne first === true ', true);
                        
                        this.firstAuthenticationState.next(true);
                    } else if (this.userIdentity.firstConnection !== false) {
                        console.log('valeur retourné first === false', false);
                        this.firstAuthenticationState.next(false);
                    }
                    this.account
                        .getUserAgences(ressources.liste_agence)
                        .subscribe(
                            agences => {
                                UserData.getInstance().listeAgences = agences;
                               // this._cookieService.putObject('listeAgence', agences);
                                this._cookieService.put('listeAgence', this.cryptoCookies.encryptWithPublicKey(JSON.stringify(agences)))


                                if (agences && agences.length) {
                                    EventBus.publish('agences', agences);
                                    this.account.getUserZones(agences, ressources.zoneAgence);
                                }
                                if (
                                    !UserData.getInstance().sfdId &&
                                    UserData.getInstance().listeAgences[0]
                                ) {
                                    this.sfdService
                                        .find(UserData.getInstance().listeAgences[0].sfdId)
                                        .subscribe(sfd => {
                                            UserData.getInstance().currentSfdReference = sfd.code;
                                            UserData.getInstance().sfdId = sfd.id;
                                            UserData.getInstance().sfd_ = sfd;
                                        });
                                }
                                UserData.getInstance().listeAgencesState.next(
                                    agences
                                );
                                return account;
                            },
                            err => {
                                return account;
                            }
                        );
                } else {
                    UserData.getInstance().sfd = null;
                    UserData.getInstance().zoneAgence = null;
                    UserData.getInstance().agence = null;
                    UserData.getInstance().agencesReference = null;
                    UserData.getInstance().userReference = null;
                    return null;
                }
                EventBus.publish('ressources', {});
                return account;
            })
            .catch(err => {
                UserData.getInstance().sfd = UserData.getInstance().sfd || null;
                UserData.getInstance().zoneAgence =
                    UserData.getInstance().zoneAgence || null;
                UserData.getInstance().agence =
                    UserData.getInstance().agence || null;
                UserData.getInstance().agencesReference = (UserData.getInstance().agencesReference && UserData.getInstance()
                    .agencesReference.length)
                    ? UserData.getInstance().agencesReference
                    : null;
                UserData.getInstance().userReference =
                    UserData.getInstance().userReference || null;
                if (UserData.getInstance().userReference){
                        EventBus.publish('user_reference', UserData.getInstance().userReference)
                    }
                return this.userIdentity;
            });
    }
    isAuthenticated(): boolean {
        return this.authenticated;
    }
    getSfd() {
        if (UserData.getInstance().sfd && !UserData.getInstance().sfdId) {
            this.sfdService
                .query({
                    NO_QUERY: true,
                    'code.equals': UserData.getInstance().sfd
                })
                .subscribe(sfd => {
                    sfd = sfd.json;
                    if (sfd && sfd[0]) {
                        UserData.getInstance().currentSfdReference = sfd[0].code;
                        UserData.getInstance().sfdId = sfd[0].id;
                        UserData.getInstance().sfd_ = sfd[0];
                    }
                });
        }
    }
    isIdentityResolved(): boolean {
        return this.userIdentity !== undefined;
    }

    getAuthenticationState(): Observable<any> {
        return this.authenticationState.asObservable();
    }
    getFirstAuthenticationState(): Observable<boolean> {
        return this.firstAuthenticationState.asObservable();
    }
    photoUpdateState(): Observable<any> {
        return this.photoState.asObservable();
    }

    getImageUrl(): String {
        return this.isIdentityResolved() ? this.userIdentity.imageUrl : null;
    }
}
