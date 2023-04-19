import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { LocalStorageService } from 'ng2-webstorage';

import { Principal } from '../auth/principal.service';
import { StateStorageService } from '../auth/state-storage.service';
import { UserService } from '../user/user.service';
import { LoginService } from './login.service';


declare let select_init: any;

@Component({
    selector: 'jhi-login-modal',
    templateUrl: './login.component.html',
    styles: [
        `
    .card-block.text-center{
          display: flex;
    justify-content: center;
    align-items: center;
    font-family: legothick;
    }
  .forget{
    margin-top:25px;
    text-align:center;
  }
  .error-login,.error-login span{
    color:red !important;
  }
  `
    ]
})
export class JhiLoginModalComponent {
    authenticationError: boolean;
    password: string;
    rememberMe = false;
    username: string;
    credentials: any;
    isSaving: boolean = false;
    isTentativeExpired: number = 0;
    agence: any;
    agences: any;
    error: string = '';
    NbreTentative = 3;
    timeElapsed = 1000 * 60 * 2 // 2 minutes
    constructor(
        private eventManager: JhiEventManager,
        private loginService: LoginService,
        private stateStorageService: StateStorageService,
        private $localStorage: LocalStorageService,
        private router: Router,
        public principal: Principal,
        private userService: UserService
    ) {
        this.credentials = {};
    }
    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        if (!this.principal.isAuthenticated()) {
            this.loginService
                .logout()
                .then(() => {
                    window.localStorage.removeItem('userTime');
                })
                .catch(e => {

                });
        }
    }
    cancel() {
        this.isSaving = false;
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        this.authenticationError = false;
    }
    onkeyup(ev: any) {
        if (this.password && this.username && ev.keyCode == 13) this.login();
    }
    login() {
        this.isSaving = true;
        let storage = this.getLastTentative();
        let value: string = btoa(JSON.stringify({
            login: this.username,
            time: storage.time,
            tentative: storage.tentative || 1
        }));
        this.error = '';
        this.principal.credentials.password = this.password.trim();
        this.principal.credentials.userName = this.username.trim();
        this.loginService
            .login({
                username: this.username.trim(),
                password: this.password.trim(),
                rememberMe: this.rememberMe,
            })
            .then(() => {
                this.$localStorage.clear(`tentative-${this.username}`);
                this.isTentativeExpired = 0;
                this.isSaving = false;
                this.authenticationError = false;
                this.router.navigate(['']);
            })
            .catch(err => {
               
                this.isSaving = false;
                this.error = '';
                if (err == 'ALREADY CONNECTED') {
                    this.error = "L'utilisateur est déjà connecté!!! Veuillez contacter l'administrateur pour vous débloquer";
                    this.isTentativeExpired = 0;
                }
                if (err.hasOwnProperty && err.hasOwnProperty('STATUS_NOT_ACTIVATE')) {
                    this.error = "Le compte de l'utilisateur est désactivé";
                    this.isTentativeExpired = 0;
                }
                if (err.hasOwnProperty && err.hasOwnProperty('STATUS_BAD')) {
                    //this.isTentativeExpired = this.isTentativeExpired + 1;
                    this.isTentativeExpired = storage.tentative;
                    if (this.isTentativeExpired >= this.NbreTentative) {
                        //setTimeout(() => {
                        this.isTentativeExpired = 3;
                        //}, 1500);
                        if(this.username !== 'superadminfnm' && this.username !== 'superadminsfd'){
                        this.userService.activerDesactiverUser(this.username, false).subscribe(() => {
                            this.error = "Votre compte est désactivé, veuillez-vous approcher d'un administrateur";
                        });
                        }
                        this.$localStorage.clear(`tentative-${this.username}`);
                    } else {
                        this.error = "Nom d'utilisateur ou mot de passe erroné";
                        //this.$localStorage.store(`tentative-${this.username}`, value);
                    }

                }
                if ((err.hasOwnProperty && err.hasOwnProperty('NOT_AUTHORIZED_ON_PLATFORM')) || err._body == 'NOT_AUTHORIZED_ON_PLATFORM') {
                    this.error = "Vous n'êtes pas autoriser à se connecter sur la plateforme";
                    this.isTentativeExpired = 0;
                }

                this.authenticationError = true;
            });
    }
    private getLastTentative(): any {
        let storage = this.$localStorage.retrieve(`tentative-${this.username}`);
        if (storage) {
            try {
                storage = atob(storage);
                storage = JSON.parse(storage);
                storage.time = storage.time || [];
                let statement;
                if (storage.time.length) {
                    statement = Date.now() - storage.time[storage.time.length - 1] <= this.timeElapsed;
                }
                if (!statement) {
                    storage = {
                        time: [Date.now()],
                        tentative: 1
                    };
                } else {
                    storage.time.push(Date.now());
                    storage.tentative = (storage.tentative || 1) + 1;
                }
            } catch (error) {
                storage = {
                    time: [Date.now()],
                    tentative: 1
                };
            }
        } else {
            storage = {
                time: [Date.now()],
                tentative: 1
            };
        }
        return storage;
    }
    register() {
        this.router.navigate(['/account', 'register']);
    }

    requestResetPassword() {
        this.router.navigate(['/account', 'reset', 'request']);
    }
    manageRedirect() {
        if (
            this.router.url === '/account/register' ||
            /activate/.test(this.router.url) ||
            this.router.url === '/account/finishReset' ||
            this.router.url === '/account/requestReset'
        ) {
            this.router.navigate(['']);
        }

        this.eventManager.broadcast({
            name: 'authenticationSuccess',
            content: 'Sending Authentication Success'
        });

        // // previousState was set in the authExpiredInterceptor before being redirected to login modal.
        // // since login is succesful, go to stored previousState and clear previousState
        const redirect = this.stateStorageService.getUrl();
        if (redirect) {
            this.router.navigate([redirect]);
        } else {
            this.router.navigate(['']);
        }
    }
}
