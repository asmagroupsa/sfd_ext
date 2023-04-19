import { Client } from "./client.model";
import { PipeTransform, Pipe } from "@angular/core";
import { Leader } from "../leader/leader.model";

@Pipe({
  name: "leader"
})
export class LeaderPipe implements PipeTransform {
  transform(leaders: Leader[], ClientEts: Client) {
    if (!ClientEts) return [];
    return leaders.filter((leader: Leader) => {
      return leader.id == ClientEts.leaderId;
    });
  }
}
