import { PipeTransform, Pipe } from "@angular/core";
import { EcheancesSFD } from "./echeances-sfd.model";

@Pipe({ name: "echeancier" })
export class EcheancesPipe implements PipeTransform {
  transform(echeances: EcheancesSFD[], id: number) {
    if (!id) return [];
    return echeances.filter((echeance: EcheancesSFD) => {
      return echeance.echeancierSFDId == id;
    });
  }
}
