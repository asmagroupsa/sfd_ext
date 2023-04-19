import { PipeTransform, Pipe } from "@angular/core";
import { Client } from "../client/client.model";

@Pipe({
  name: "individu"
})
export class IndividuPipe implements PipeTransform {
  transform(clients: Client[]) {
    return clients.filter((client: Client) => {
      return client.typeClientId == 7 && !client.groupMembers.length;
    });
  }
}

@Pipe({
  name: "group"
})
export class GroupPipe implements PipeTransform {
  transform(clients: Client[]) {
    return clients.filter((client: Client) => {
      return client.typeClientId == 6;
    });
  }
}
