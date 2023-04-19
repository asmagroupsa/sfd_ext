
import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "uniquechargedepret" })
export class UniqueChargeDePret implements PipeTransform {
  transform(charges: any[], chargedepret: any) {
    if (!charges) return [];
    return charges.filter((charge: any) => {
      return charge.userReference != chargedepret;
    });
  }
}