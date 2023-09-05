import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { CreditService } from '../credit.service';

@Component({
  selector: 'jhi-compteActive',
  templateUrl: './compteActive.component.html',
})
export class CompteActiveComponent implements OnInit {
  @Input() public data;
  message: string;

  constructor(
    public ngbActiveModal: NgbActiveModal,
    private _alertService: JhiAlertService,
    private creditService: CreditService,
    private eventManager: JhiEventManager,
) {}

  ngOnInit() {
    console.log(this.data);
    if (this.data.length > 1) {
      this.message= "Impossible de décaisser car les comptes suivants ne sont pas activés";
    } else {
      this.message= "Impossible de décaisser car le compte suivant n'est pas activé";
    }
  }
    save() {}


}
