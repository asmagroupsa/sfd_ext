import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseWrapper } from '../../shared';
import { ClientService } from './client.service';

@Component({
  selector: 'jhi-client-assurance',
  templateUrl: './client-assurance.component.html',
//   styleUrls: ['./client-assurance.component.scss']
})
export class ClientAssuranceComponent implements OnInit {
    params: any = {};
    client: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
        this.params = params;
        console.log(params);
    });
   }

  ngOnInit() {
    this.getClient();
  }

  getClient() {
    if (!this.params['client']) return;
    this.clientService.find(+this.params.client)
        .subscribe(
            (res) => {
                this.client = res;
                console.log(this.client);
            },
            (res: ResponseWrapper) => {
            }
        );
}


}
