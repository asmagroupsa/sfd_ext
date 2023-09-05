import { PipeTransform, Pipe } from "@angular/core";
import { EcheancesClient } from "./echeances-client.model";

@Pipe({ name: "echeancier" })
export class EcheancesPipe implements PipeTransform {
  transform(echeances: EcheancesClient[], id: number) {
    if (!id) return [];
    return echeances.filter((echeance: EcheancesClient) => {
      return echeance.echeancierClientId == id;
    });
  }
}
